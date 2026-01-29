from fastapi import APIRouter, HTTPException
from db import SessionLocal
from models import ChatHistory

router = APIRouter(prefix="/chatbot/history", tags=["History"])

@router.get("/")
def get_history():
    db = SessionLocal()
    data = db.query(ChatHistory).order_by(ChatHistory.id.desc()).all()
    db.close()

    return [
        {
            "id": c.id,
            "question": c.question,
            "answer": c.answer,
            "date": c.date
        }
        for c in data
    ]

@router.delete("/{id}")
def delete_history(id: int):
    db = SessionLocal()
    chat = db.query(ChatHistory).filter(ChatHistory.id == id).first()

    if not chat:
        db.close()
        raise HTTPException(status_code=404, detail="Chat not found")

    db.delete(chat)
    db.commit()
    db.close()
    return {"message": "Deleted"}
