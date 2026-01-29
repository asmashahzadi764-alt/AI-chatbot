from pypdf import PdfReader
import io

def extract_text_from_file(file):
    if file.filename.endswith(".pdf"):
        reader = PdfReader(io.BytesIO(file.file.read()))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text[:6000]   # limit context
    else:
        return file.file.read().decode("utf-8")[:6000]
