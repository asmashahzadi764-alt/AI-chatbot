import { useState, useEffect, useRef } from "react";
import { chatWithAI, getHistory, deleteChat } from "./api/chatbotApi";

export default function App() {
  const [question, setQuestion] = useState("");
  const [document, setDocument] = useState(null);
  const [fileName, setFileName] = useState("");
  const [chatList, setChatList] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatList, activeChatId]);

  const loadHistory = async () => {
    const history = await getHistory();
    setChatList(history || []);
    setActiveChatId(history?.[0]?.id || null);
  };

  const handleUpload = (file) => {
    if (!file) return;
    setDocument(file);
    setFileName(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() && !document) return;

    const chatId = Date.now();

    const attachment = document
      ? {
          name: fileName,
          type: document.type,
          url: document.type.startsWith("image/")
            ? URL.createObjectURL(document)
            : null,
        }
      : null;

    const newChat = {
      id: chatId,
      question,
      answer: "Thinking…",
      attachment,
    };

    setChatList((prev) => [newChat, ...prev]);
    setActiveChatId(chatId);
    setLoading(true);

    try {
      const res = await chatWithAI(question, document);
      setChatList((prev) =>
        prev.map((c) =>
          c.id === chatId ? { ...c, answer: res.answer } : c
        )
      );
    } catch {
      setChatList((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? { ...c, answer: "⚠️ Something went wrong." }
            : c
        )
      );
    } finally {
      setLoading(false);
      setQuestion("");
      setDocument(null);
      setFileName("");
      textareaRef.current.style.height = "40px";
    }
  };

  const handleDelete = async (id) => {
    await deleteChat(id);
    loadHistory();
  };

  const activeChat = chatList.find((c) => c.id === activeChatId);

  return (
    <div className={`app ${theme}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${drawerOpen ? "open" : ""}`}>
        <div className="sidebarTop">
          <h2>Chats</h2>
          <button
            className="iconBtn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>

        <div className="chatList">
          {chatList.map((c) => (
            <div
              key={c.id}
              className={`chatItem ${c.id === activeChatId ? "active" : ""}`}
              onClick={() => {
                setActiveChatId(c.id);
                setDrawerOpen(false);
              }}
            >
              <span>{c.question?.slice(0, 30) || "New chat"}</span>
              <button
                className="deleteBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(c.id);
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chatArea">
        <div className="mobileTop">
          <button className="iconBtn" onClick={() => setDrawerOpen(true)}>
            ☰
          </button>
          <div className="title">AI Chat</div>
          <button
            className="iconBtn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>

        {!activeChat ? (
          <div className="empty">
            <h1>Ask anything</h1>
            <p>Your AI assistant is ready ✨</p>
          </div>
        ) : (
          <div className="chatBox">
            {activeChat.attachment && (
              <div className="attachment">
                {activeChat.attachment.type.startsWith("image/") ? (
                  <img src={activeChat.attachment.url} alt="" />
                ) : (
                  <div className="fileChip">📎 {activeChat.attachment.name}</div>
                )}
              </div>
            )}
            <div className="bubble user">{activeChat.question}</div>
            <div className="bubble ai">{activeChat.answer}</div>
            <div ref={bottomRef} />
          </div>
        )}

        {fileName && <div className="filePreview">📎 {fileName}</div>}

        <form className="inputBar" onSubmit={handleSubmit}>
          <button
            type="button"
            className="iconBtn"
            onClick={() => fileInputRef.current.click()}
          >
            📎
          </button>
          <button
            type="button"
            className="iconBtn"
            onClick={() => imageInputRef.current.click()}
          >
            🖼
          </button>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => handleUpload(e.target.files[0])}
          />
          <input
            ref={imageInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => handleUpload(e.target.files[0])}
          />

          <textarea
            ref={textareaRef}
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              e.target.style.height = "40px";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            placeholder="Message AI…"
            rows={1}
          />

          <button className="sendBtn" disabled={loading}>
            {loading ? "…" : "➤"}
          </button>
        </form>

        <div
          className={`overlay ${drawerOpen ? "show" : ""}`}
          onClick={() => setDrawerOpen(false)}
        />
      </main>

      {/* Styles */}
      <style>{`
*{box-sizing:border-box;font-family:Inter,system-ui}
html,body{margin:0;height:100%}
.app{display:flex;height:100vh;background:var(--bg);color:var(--text)}

.app.dark{
--bg:#0f0f0f;--panel:#171717;--border:#262626;--text:#e5e7eb;
--user:#1f2937;--ai:#111827
}
.app.light{
--bg:#f9fafb;--panel:#fff;--border:#e5e7eb;--text:#111827;
--user:#e5e7eb;--ai:#f3f4f6
}

.sidebar{
width:260px;
background:var(--panel);
border-right:1px solid var(--border);
padding:16px;
display:flex;
flex-direction:column;
overflow-y:auto;
}

.sidebarTop{display:flex;justify-content:space-between;align-items:center}
.chatList{margin-top:16px;display:flex;flex-direction:column;gap:6px;flex:1;overflow-y:auto}

.chatItem{
padding:10px;border-radius:10px;cursor:pointer;
display:flex;justify-content:space-between;align-items:center
}
.chatItem:hover{background:rgba(255,255,255,.05)}
.chatItem.active{background:#2563eb;color:#fff}

.chatArea{flex:1;display:flex;flex-direction:column}
.chatBox{flex:1;padding:24px;overflow-y:auto;display:flex;flex-direction:column;gap:12px}

.bubble{padding:12px 16px;border-radius:16px;max-width:75%}
.bubble.user{background:var(--user);margin-left:auto}
.bubble.ai{background:var(--ai);border:1px solid var(--border)}

.attachment img{max-width:260px;border-radius:12px}
.fileChip{padding:6px 12px;border-radius:999px;background:rgba(255,255,255,.1)}

.inputBar{
display:flex;gap:8px;padding:12px;border-top:1px solid var(--border)
}
.inputBar textarea{
flex:1;resize:none;padding:10px 12px;border-radius:12px;
border:1px solid var(--border);background:var(--panel);color:var(--text)
}

.sendBtn{
background:#2563eb;color:#fff;border:none;
border-radius:12px;padding:0 16px
}
.iconBtn{background:none;border:none;color:inherit;font-size:18px;cursor:pointer}

.mobileTop{
display:none;align-items:center;justify-content:space-between;
padding:10px;border-bottom:1px solid var(--border)
}

.empty{text-align:center;margin:auto;opacity:.7}

@media(max-width:768px){
.sidebar{position:fixed;left:-260px;top:0;height:100%;z-index:10}
.sidebar.open{left:0}
.mobileTop{display:flex}
.overlay{
position:fixed;inset:0;background:rgba(0,0,0,.4);display:none
}
.overlay.show{display:block}
}
      `}</style>
    </div>
  );
}
