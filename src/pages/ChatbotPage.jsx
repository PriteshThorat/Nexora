import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function ChatbotPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello, How can I help you?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const [chatHistory] = useState([
    "Fitness plan with Trainer",
    "Star or pin icon to mark new",
    "Favorite horoscope readings",
    "Random input clarification",
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      type: "user",
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/api/agents/finance_chatbot/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            query: inputMessage,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Backend response:", data);

        // Extract the reply text from nested structure
        const botText =
          data.reply?.reply ||
          data.reply ||
          data.response ||
          data.message ||
          data.answer ||
          data.result ||
          data.text ||
          (typeof data === "string" ? data : null) ||
          JSON.stringify(data);

        const botMessage = {
          type: "bot",
          text: botText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorData = await response.json();
        const errorMessage = {
          type: "bot",
          text: `Error: ${errorData.message || "Failed to get response"}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = {
        type: "bot",
        text: "Network error. Please check your connection and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  // Function to format markdown bold text
  const formatMessage = (text) => {
    // Split by ** and alternate between normal and bold
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Remove the ** and make it bold
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div
      className="flex h-screen bg-gray-50 dark:bg-slate-900"
      style={{ fontFamily: "'Roboto Mono', monospace" }}
    >
      {/* Left Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-xl font-bold dark:text-white"
              style={{ color: "#667eea" }}
            >
              Nexora
            </span>
          </div>

          {/* Search */}
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-[#6b7280] dark:text-[#94a3b8] text-left hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.75 15.75L12.4875 12.4875"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Search
          </button>

          {/* New Chat Button */}
          <button
            onClick={() => {
              setMessages([
                {
                  type: "bot",
                  text: "Hello, How can I help you?",
                  timestamp: new Date(),
                },
              ]);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 mt-3 rounded-lg bg-gray-100 dark:bg-slate-700 text-[#1f2937] dark:text-[#f1f5f9] text-left hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 3.75V14.25M3.75 9H14.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            New Chat
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Chat History */}
          <div className="mb-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-semibold text-[#6b7280] dark:text-[#94a3b8] uppercase">
                Chat History
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#6b7280] dark:text-[#94a3b8]"
              >
                <path
                  d="M12 6L8 10L4 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="space-y-1">
              {chatHistory.map((item, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[#6b7280] dark:text-[#94a3b8] text-left hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-sm"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 2L10 8L6 14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="truncate">{item}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Back to Dashboard Button */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <button
            onClick={handleBack}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-colors"
            style={{
              backgroundColor: "rgb(102, 126, 234)",
              fontFamily: "'Roboto Mono', monospace",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.25 13.5L6.75 9L11.25 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#1f2937] dark:text-[#f1f5f9]"
              >
                <path
                  d="M3 12H21M3 6H21M3 18H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-linear-to-b from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-900">
          {messages.length === 1 && (
            <div className="flex flex-col items-center justify-center h-full">
              {/* Mascot/Logo */}
              <div className="mb-8">
                <img
                  src="/ChatBot Avatar.png"
                  alt="Chatbot Avatar"
                  className="w-32 h-32 mb-4"
                />
              </div>
              <h1 className="text-3xl font-bold text-[#1f2937] dark:text-[#f1f5f9] mb-2 text-center">
                How can I help you today?
              </h1>
              <p className="text-[#6b7280] dark:text-[#94a3b8] text-center mb-8">
                Ask me anything about your finances, investments, or budgeting
              </p>
            </div>
          )}

          {messages.length > 1 && (
            <div
              className="max-w-3xl mx-auto space-y-6 p-6 rounded-xl"
              style={{
                backdropFilter: "blur(10px)",
              }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] ${
                      message.type === "user"
                        ? "text-white"
                        : "bg-white dark:bg-slate-700 text-[#1f2937] dark:text-[#f1f5f9] border border-gray-200 dark:border-slate-600"
                    } rounded-2xl px-4 py-3 shadow-sm`}
                    style={
                      message.type === "user"
                        ? { backgroundColor: "rgb(102, 126, 234)" }
                        : {}
                    }
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {formatMessage(message.text)}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: "#667eea",
                          animationDelay: "0s",
                        }}
                      />
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: "#667eea",
                          animationDelay: "0.2s",
                        }}
                      />
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: "#667eea",
                          animationDelay: "0.4s",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-3"
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Chat here..."
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-[#1f2937] dark:text-[#f1f5f9] placeholder-[#6b7280] dark:placeholder-[#94a3b8] focus:outline-none focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.outline = "2px solid #667eea")
                  }
                  onBlur={(e) => (e.currentTarget.style.outline = "none")}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="p-3 rounded-lg text-white transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor:
                    loading || !inputMessage.trim()
                      ? "#9ca3af"
                      : "rgb(102, 126, 234)",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5 2.5L8.75 11.25M17.5 2.5L12.5 17.5L8.75 11.25M17.5 2.5L2.5 7.5L8.75 11.25"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPage;
