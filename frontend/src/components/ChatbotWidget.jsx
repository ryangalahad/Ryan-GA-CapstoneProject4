import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styles/Chatbot.css";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { text, sender, options? }
  const [input, setInput] = useState("");
  const [greeted, setGreeted] = useState(false);
  const bodyRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Send greeting when chat is first opened
  const handleToggle = () => {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen && !greeted) {
      setGreeted(true);
      sendToServer("hi");
    }
  };

  // POST to /api/chatbot with the auth token
  const sendToServer = async (text) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(
        "http://localhost:3000/api/chatbot",
        { message: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [
        ...prev,
        { text: data.message, sender: "bot", options: data.options || [] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: "⚠️ Unable to reach the server. Please try again later.",
          sender: "bot",
          options: [],
        },
      ]);
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { text, sender: "user", options: [] }]);
    setInput("");
    sendToServer(text);
  };

  const handleOptionClick = (key, label) => {
    setMessages((prev) => [
      ...prev,
      { text: `${key}. ${label}`, sender: "user", options: [] },
    ]);
    sendToServer(key);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        className="chatbot-toggle"
        onClick={handleToggle}
        aria-label={open ? "Close chat" : "Open chat"}
        title="Compliance Assistant"
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Chat window */}
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span className="chatbot-header-icon">🤖</span>
            Compliance Assistant
          </div>

          <div className="chatbot-body" ref={bodyRef}>
            {messages.map((msg, i) => (
              <React.Fragment key={i}>
                <div className={`chatbot-msg chatbot-msg--${msg.sender}`}>
                  {msg.text}
                </div>
                {msg.options && msg.options.length > 0 && (
                  <div className="chatbot-options">
                    {msg.options.map((opt) => (
                      <button
                        key={opt.key}
                        className="chatbot-option-btn"
                        onClick={() => handleOptionClick(opt.key, opt.label)}
                      >
                        {opt.key === "menu"
                          ? `↩ ${opt.label}`
                          : `${opt.key}. ${opt.label}`}
                      </button>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="chatbot-footer">
            <input
              className="chatbot-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a number or message…"
              autoComplete="off"
            />
            <button
              className="chatbot-send-btn"
              onClick={handleSend}
              aria-label="Send"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
