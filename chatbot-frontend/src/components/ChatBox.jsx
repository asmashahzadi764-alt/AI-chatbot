import { useState } from "react";
import { chatWithAI } from "./api/chatbotApi";

export default function ChatBox() {
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState(null); // now storing the actual file
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question && !file) {
      alert("Please ask a question or upload a document/image.");
      return;
    }

    const response = await chatWithAI(question, file);
    setAnswer(response.answer);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 p-5 border rounded">
      <h1 className="text-2xl font-bold mb-4">AI Assistant Chatbot</h1>

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Question:</label>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Ask something..."
        />

        <label className="block mb-2">Upload Document / Image (Optional):</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-2 border rounded mb-4"
        />

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Ask AI
        </button>
      </form>

      {answer && (
        <div className="mt-6 p-3 border rounded bg-gray-100">
          <h2 className="font-bold">Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
