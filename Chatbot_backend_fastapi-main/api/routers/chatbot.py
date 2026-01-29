from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from datetime import date
from db import SessionLocal
from models import ChatHistory
from services.llm import get_chat_response, read_file_content
import pytesseract

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

# Set Tesseract path (Windows)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Swagger response model
class ChatResponse(BaseModel):
    id: int
    question: str
    answer: str

@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Ask AI a question",
    description="Send a question along with an optional document/image. AI will read the document/image and answer based on its content.",
)
async def chat(
    question: str = Form(..., description="Your question for the AI"),
    file: UploadFile | None = File(None, description="Optional document or image (docx, pdf, txt, png, jpg, jpeg)")
):
    """
    Chat endpoint with optional document/image upload.
    """
    document_content = ""

    # -----------------------------
    # Read uploaded file safely
    # -----------------------------
    if file:
        try:
            await file.seek(0)  # Reset file pointer
            document_content = await read_file_content(file)
        except Exception as e:
            print("File reading error:", e)
            document_content = f"Error reading file: {e}"

    # -----------------------------
    # Get AI response safely
    # -----------------------------
    try:
        response = get_chat_response(question, document_content)
        if "answer" not in response:
            response = {"answer": "AI could not generate an answer."}
    except Exception as e:
        print("AI processing error:", e)
        response = {"answer": f"AI failed to respond: {e}"}

    # -----------------------------
    # Save chat history safely
    # -----------------------------
    try:
        db = SessionLocal()
        history = ChatHistory(
            question=question,
            answer=response["answer"],
            date=str(date.today())
        )
        db.add(history)
        db.commit()
        db.refresh(history)
    except Exception as e:
        print("DB saving error:", e)
        history = {"id": 0, "question": question, "answer": response["answer"]}
    finally:
        db.close()

    return {
        "id": history.id if hasattr(history, "id") else 0,
        "question": history.question if hasattr(history, "question") else question,
        "answer": history.answer if hasattr(history, "answer") else response["answer"]
    }
