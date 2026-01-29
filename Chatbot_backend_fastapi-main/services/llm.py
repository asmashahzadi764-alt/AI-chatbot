from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
import os
from io import BytesIO
from PIL import Image
import pytesseract
import docx
import PyPDF2

load_dotenv()

# ----------------------
# Tesseract OCR path
# ----------------------
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ----------------------
# Initialize LLM
# ----------------------
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.1-8b-instant",
    temperature=0.4
)

# ----------------------
# Get AI Response
# ----------------------
def get_chat_response(question: str, context: str = ""):
    try:
        full_prompt = f"""
Use the following context to answer the question.

Context:
{context}

Question:
{question}
"""
        result = llm.invoke([HumanMessage(content=full_prompt)])
        answer = result.content

        if not answer.strip():
            return {"answer": "AI could not generate an answer."}

        return {"answer": answer}

    except Exception as e:
        print("LLM ERROR:", e)
        return {"answer": "Something went wrong with AI."}

# ----------------------
# Read uploaded file content (DOCX, PDF, TXT, IMAGE)
# ----------------------
async def read_file_content(file):
    filename = file.filename.lower()
    content = ""

    try:
        # DOCX
        if filename.endswith(".docx"):
            doc = docx.Document(file.file)
            content = "\n".join([para.text for para in doc.paragraphs])

        # PDF
        elif filename.endswith(".pdf"):
            reader = PyPDF2.PdfReader(file.file)
            content = "\n".join([page.extract_text() or "" for page in reader.pages])

        # TXT
        elif filename.endswith(".txt"):
            content = (await file.read()).decode("utf-8")

        # IMAGE (PNG, JPG, JPEG) with OCR
        elif filename.endswith((".png", ".jpg", ".jpeg")):
            file_bytes = await file.read()
            image = Image.open(BytesIO(file_bytes))

            # Ensure image is RGB for OCR
            if image.mode != "RGB":
                image = image.convert("RGB")

            # OCR using pytesseract
            content = pytesseract.image_to_string(image, lang="eng")

        else:
            content = f"Cannot read file type: {filename}"

    except Exception as e:
        print(f"File reading error ({filename}):", e)
        content = f"Error reading file {filename}: {e}"

    return content
