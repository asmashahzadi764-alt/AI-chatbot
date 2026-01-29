from pydantic import BaseModel

class ChatHistoryCreate(BaseModel):
    question: str
    answer: str
    document: str | None = ""

class ChatHistoryResponse(BaseModel):
    id: int
    question: str
    answer: str
    document: str | None = ""

    class Config:
        orm_mode = True
