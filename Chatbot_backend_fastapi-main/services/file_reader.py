import PyPDF2
from docx import Document
from PIL import Image
import pytesseract
from fastapi import UploadFile

async def read_file_content(file: UploadFile) -> str:
    try:
        filename = file.filename.lower()
        content = ""

        # PDF
        if filename.endswith(".pdf"):
            pdf_reader = PyPDF2.PdfReader(file.file)
            for page in pdf_reader.pages:
                content += page.extract_text() + "\n"

        # Word Document
        elif filename.endswith(".docx"):
            doc = Document(file.file)
            for para in doc.paragraphs:
                content += para.text + "\n"

        # Plain text
        elif filename.endswith(".txt"):
            content = (await file.read()).decode()

        # Image (OCR)
        elif filename.endswith((".png", ".jpg", ".jpeg")):
            img = Image.open(file.file)
            content = pytesseract.image_to_string(img)

        return content.strip()

    except Exception as e:
        print("File reading error:", e)
        return ""
