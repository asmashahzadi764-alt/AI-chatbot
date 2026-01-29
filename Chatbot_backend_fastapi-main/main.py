from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers.chatbot import router as chatbot_router
from api.routers.chat_history import router as history_router   # NEW

app = FastAPI(
    title="AI Assistant Chatbot",
    description="FastAPI based chatbot with document upload",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatbot_router)
app.include_router(history_router)   # NEW

@app.get("/")
def root():
    return {"message": "AI Assistant Chatbot is running"}
