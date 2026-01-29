AI Chat Web App
A modern AI Chat Web Application with React.js frontend and FastAPI / custom backend API. Supports chat, file & image uploads, chat history, and dark/light theme.
________________________________________
Setup Instructions
1. Clone the Repository
git clone <repo-url>
cd <repo-folder>
________________________________________
2. Backend Setup
1.	Create Python virtual environment:
python -m venv venv
2.	Activate the virtual environment:
•	Windows
venv\Scripts\activate
•	macOS / Linux
source venv/bin/activate
3.	Install backend dependencies:
pip install fastapi uvicorn python-docx lxml
Or, if requirements.txt exists:
pip install -r backend/requirements.txt
4.	Initialize the database (if applicable):
python backend/create_db.py
5.	Start the backend server:
uvicorn backend.main:app --reload
Backend will run on: http://127.0.0.1:8000
________________________________________
3. Frontend Setup
1.	Open a new terminal, go to frontend folder:
cd frontend
2.	Install frontend dependencies:
npm install
3.	Start the frontend app:
npm start
Open in browser

________________________________________
Usage
1.	Type a message in the chat input.
2.	Optional: attach documents (.pdf, .doc, .docx, .txt) or images.
3.	Press Send (➤) to receive AI response.
4.	Chat history loads automatically.
5.	Delete chats using ✕ button.
6.	Toggle Dark/Light theme as needed.
________________________________________
Notes
•	Backend must be running for AI responses.
•	File uploads are limited to supported formats only.
•	Fully responsive design for mobile and desktop.

