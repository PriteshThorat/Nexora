import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function ChatbotPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! I'm your AI Financial Advisor. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          padding: "1rem 2rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <button
          onClick={handleBack}
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "600",
          }}
        >
          ← Back
        </button>
        <div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "white",
              margin: 0,
            }}
          >
            AI Financial Advisor
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "rgba(255, 255, 255, 0.7)",
              margin: 0,
            }}
          >
            Get personalized financial advice
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                message.type === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "1rem",
                borderRadius: "1rem",
                background:
                  message.type === "user"
                    ? "rgba(102, 126, 234, 0.8)"
                    : "rgba(255, 255, 255, 0.9)",
                color: message.type === "user" ? "white" : "#1f2937",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <p
                style={{ margin: 0, lineHeight: "1.5", whiteSpace: "pre-wrap" }}
              >
                {formatMessage(message.text)}
              </p>
              <p
                style={{
                  margin: "0.5rem 0 0 0",
                  fontSize: "0.75rem",
                  opacity: 0.7,
                }}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <div
              style={{
                padding: "1rem",
                borderRadius: "1rem",
                background: "rgba(255, 255, 255, 0.9)",
                color: "#1f2937",
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#667eea",
                    animation: "bounce 1.4s infinite ease-in-out both",
                    animationDelay: "-0.32s",
                  }}
                />
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#667eea",
                    animation: "bounce 1.4s infinite ease-in-out both",
                    animationDelay: "-0.16s",
                  }}
                />
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#667eea",
                    animation: "bounce 1.4s infinite ease-in-out both",
                  }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          padding: "1.5rem 2rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <form
          onSubmit={handleSendMessage}
          style={{
            display: "flex",
            gap: "1rem",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about your finances..."
            disabled={loading}
            style={{
              flex: 1,
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              background: "rgba(255, 255, 255, 0.9)",
              color: "#1f2937",
              fontSize: "1rem",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            style={{
              padding: "1rem 2rem",
              background:
                loading || !inputMessage.trim()
                  ? "rgba(107, 114, 128, 0.5)"
                  : "rgba(102, 126, 234, 0.9)",
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: "1rem",
              fontWeight: "600",
              cursor:
                loading || !inputMessage.trim() ? "not-allowed" : "pointer",
              transition: "all 0.3s",
            }}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.875rem",
            marginTop: "1rem",
          }}
        >
          Tip: Ask about budgeting, investments, savings strategies, or debt
          management
        </p>
      </div>

      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}

export default ChatbotPage;
