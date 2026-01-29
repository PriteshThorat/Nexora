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
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loadingSessions, setLoadingSessions] = useState(false);

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
    } else {
      fetchChatSessions();
    }
  }, [navigate]);

  const fetchChatSessions = async () => {
    setLoadingSessions(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/api/agents/chat_sessions/?limit=10",
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Chat sessions:", data);
        setChatSessions(data.sessions || []);
      }
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      type: "user",
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputMessage;
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
            query: messageText,
            session_id: currentSessionId,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Backend response:", data);

        // Update current session ID if returned
        if (data.session_id) {
          setCurrentSessionId(data.session_id);
          // Refresh chat sessions after first message to show new session
          if (!currentSessionId) {
            fetchChatSessions();
          }
        }

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

  const handleNewChat = () => {
    setMessages([
      {
        type: "bot",
        text: "Hello, How can I help you?",
        timestamp: new Date(),
      },
    ]);
    setCurrentSessionId(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const loadChatHistory = async (sessionId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/agents/chat_history/?session_id=${sessionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Chat history:", data);

        // Convert API messages to component format
        const formattedMessages = data.messages.map((msg) => ({
          type: msg.role === "user" ? "user" : "bot",
          text: msg.content,
          timestamp: new Date(msg.timestamp),
        }));

        setMessages(formattedMessages);
        setCurrentSessionId(sessionId);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId, e) => {
    e.stopPropagation(); // Prevent loading the session when clicking delete
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/api/agents/delete_session/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            session_id: sessionId,
          }),
        },
      );

      if (response.ok) {
        // If the deleted session was the current one, reset to new chat
        if (currentSessionId === sessionId) {
          handleNewChat();
        }
        // Refresh the sessions list
        fetchChatSessions();
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  // Function to format markdown text
  const formatMessage = (text) => {
    // First, unescape dollar signs
    let formattedText = text.replace(/\\\$/g, "$");

    // Split by lines to handle each line separately
    const lines = formattedText.split("\n");

    return lines.map((line, lineIndex) => {
      // Check if line is a bullet point (starts with * but not **)
      const bulletMatch = line.match(/^(\s*)\*\s+(.*)$/);
      const isBullet = bulletMatch && !line.trim().startsWith("**");
      const isNumbered = /^\s*\d+\.\s/.test(line);

      // Determine indentation level for nested bullets
      const indentLevel = bulletMatch
        ? Math.floor(bulletMatch[1].length / 4)
        : 0;

      // Get the content without the bullet marker
      let content = isBullet ? bulletMatch[2] : line;

      // Process bold text within the line
      const parts = content.split(/(\*\*.*?\*\*)/g);
      const processedParts = parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
      });

      // Render based on line type
      if (isBullet) {
        return (
          <div
            key={lineIndex}
            className={`flex gap-2 my-1`}
            style={{ marginLeft: `${indentLevel * 1.5 + 1.5}rem` }}
          >
            <span className="shrink-0">•</span>
            <span>{processedParts}</span>
          </div>
        );
      } else if (isNumbered) {
        return (
          <div key={lineIndex} className="ml-6 my-1">
            {processedParts}
          </div>
        );
      } else if (line.trim() === "") {
        return <div key={lineIndex} className="h-2" />;
      } else {
        return (
          <div key={lineIndex} className="my-1">
            {processedParts}
          </div>
        );
      }
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
            onClick={handleNewChat}
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
              {loadingSessions ? (
                <div className="px-4 py-2 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  Loading...
                </div>
              ) : chatSessions.length === 0 ? (
                <div className="px-4 py-2 text-sm text-[#6b7280] dark:text-[#94a3b8]">
                  No chat history yet
                </div>
              ) : (
                chatSessions.map((session) => (
                  <div
                    key={session.session_id}
                    className={`group relative w-full flex flex-col gap-1 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${
                      currentSessionId === session.session_id
                        ? "bg-gray-100 dark:bg-slate-700"
                        : ""
                    }`}
                  >
                    <button
                      onClick={() => loadChatHistory(session.session_id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between pr-6">
                        <span className="text-sm font-medium text-[#1f2937] dark:text-[#f1f5f9] truncate">
                          {session.first_message?.substring(0, 30) ||
                            session.title}
                        </span>
                        <span className="text-xs text-[#6b7280] dark:text-[#94a3b8] shrink-0 ml-2">
                          {formatDate(session.created_at)}
                        </span>
                      </div>
                      <span className="text-xs text-[#6b7280] dark:text-[#94a3b8]">
                        {session.message_count} messages
                      </span>
                    </button>
                    <button
                      onClick={(e) => deleteSession(session.session_id, e)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all"
                      title="Delete session"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-[#6b7280] dark:text-[#94a3b8]"
                      >
                        <path
                          d="M12 4L4 12M4 4L12 12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              )}
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
                    <div className="text-sm leading-relaxed">
                      {formatMessage(message.text)}
                    </div>
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
