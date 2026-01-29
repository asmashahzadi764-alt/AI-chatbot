# AI Assistant Chatbot API

Backend for React Frontend

This is a FastAPI based AI chatbot backend. It accepts JSON input and returns structured JSON output using LangChain and Groq. Frontend developers can easily connect this API to React, Next.js, or any JS framework.

## Tech Stack

- Python
- FastAPI
- LangChain
- Groq LLM
- Pydantic

## Folder Structure

```

main.py
requirements.txt
services/
 └─chatbot.py
api/
 └─ routers/
     └─ chatbot.py
.env
```

## Prerequisites

Make sure you have:
- Python 3.12
- A Groq API key

## Environment Setup

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

**Do not commit this file to GitHub.**

## Install Dependencies

### Create virtual environment (optional but recommended)

```bash
python -m venv venv
source venv/bin/activate   # Linux or Mac
venv\Scripts\activate      # Windows
```

### Install requirements

```bash
pip install -r requirements.txt
```

## Run the Backend Server

```bash
uvicorn app.main:app --reload
```

Server will start at:
- **Base URL:** `http://127.0.0.1:8000`
- **Swagger API docs:** `http://127.0.0.1:8000/docs`

## API Endpoint for Frontend

### URL

```
POST /chatbot/chat
```

### Request Body (JSON)

```json
{
  "question": "Explain this code in simple terms",
  "document": "optional document text"
}
```

> **Note:** `document` field is optional. You can pass empty string if not needed.

### Response (JSON)

```json
{
  "answer": "Short and clear AI response",
  "date": "2026-01-27"
}
```

## React Example Using Fetch

```javascript
fetch("http://127.0.0.1:8000/chatbot/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    question: "What does this function do",
    document: ""
  })
})
.then(res => res.json())
.then(data => {
  console.log(data.answer)
  console.log(data.date)
})
```

## Notes for Frontend Dev

- API always returns valid JSON
- No HTML or markdown in response
- Easy to map response to UI state
- Safe to use with Axios or Fetch
- Can be extended for streaming or WebSockets

## Common Errors

### If you get 500 error

- Check Groq API key
- Check `.env` file loaded
- Restart server

