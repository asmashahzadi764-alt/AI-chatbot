import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

// Updated to send FormData instead of JSON
export const chatWithAI = async (question, file) => {
  const formData = new FormData();
  formData.append("question", question);
  if (file) formData.append("file", file); // append file if selected

  const res = await axios.post(`${BASE_URL}/chatbot/chat`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const getHistory = async () => {
  const res = await axios.get(`${BASE_URL}/chatbot/history/`);
  return res.data;
};

export const deleteChat = async (id) => {
  await axios.delete(`${BASE_URL}/chatbot/history/${id}`);
};
