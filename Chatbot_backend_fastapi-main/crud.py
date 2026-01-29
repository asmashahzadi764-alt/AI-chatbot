from sqlalchemy.orm import Session
from models import Chat
from schemas import ChatCreate

def create_chat(db: Session, chat: ChatCreate):
    db_chat = Chat(
        question=chat.question,
        answer=chat.answer,
        document=chat.document
    )
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat

def get_all_chats(db: Session):
    return db.query(Chat).order_by(Chat.id.desc()).all()

def delete_chat(db: Session, chat_id: int):
    db_chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if db_chat:
        db.delete(db_chat)
        db.commit()
        return True
    return False
