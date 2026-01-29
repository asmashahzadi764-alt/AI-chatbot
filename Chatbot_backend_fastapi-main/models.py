from sqlalchemy import Column, Integer, String
from db import Base

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String)
    answer = Column(String)
    date = Column(String)
