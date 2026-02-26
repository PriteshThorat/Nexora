import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function SentimentAnalysisModal({ headline, isOpen, onClose }) {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  // Theme colors
  const theme = {
    bg: darkMode ? "#0f172a" : "#ffffff",
    modalBg: darkMode ? "#1e293b" : "#f8fafc",
    text: darkMode ? "#f1f5f9" : "#1f2937",
    textSecondary: darkMode ? "#94a3b8" : "#6b7280",
    border: darkMode ? "#334155" : "#e2e8f0",
    positive: "#10b981",
    negative: "#ef4444",
    neutral: "#6366f1",
  };

  useEffect(() => {
    if (isOpen && headline) {
      fetchSentimentAnalysis();
    }
  }, [isOpen, headline]);

  const fetchSentimentAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/agents/sentiment_analysis/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            news_text: headline,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
      } else {
        setError("Failed to fetch sentiment analysis");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(4px)",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: theme.modalBg,
          borderRadius: "12px",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          border: `1px solid ${theme.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.5rem",
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: "700",
              color: theme.text,
            }}
          >
            📊 Sentiment Analysis
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: theme.textSecondary,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = theme.text)}
            onMouseLeave={(e) => (e.target.style.color = theme.textSecondary)}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "1.5rem" }}>
          {/* Headline */}
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              backgroundColor: theme.neutral,
              borderRadius: "8px",
              borderLeft: `4px solid ${theme.neutral}`,
            }}
          >
            <p
              style={{
                margin: 0,
                color: "white",
                fontSize: "0.95rem",
                fontWeight: "600",
                lineHeight: "1.5",
              }}
            >
              {headline}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div
                style={{
                  display: "inline-block",
                  width: "40px",
                  height: "40px",
                  border: `3px solid ${theme.border}`,
                  borderTop: `3px solid ${theme.neutral}`,
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginBottom: "1rem",
                }}
              />
              <p style={{ color: theme.textSecondary }}>
                Analyzing sentiment...
              </p>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div
              style={{
                padding: "1rem",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderLeft: `4px solid ${theme.negative}`,
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              <p
                style={{ margin: 0, color: theme.negative, fontWeight: "600" }}
              >
                ⚠️ Error: {error}
              </p>
            </div>
          )}

          {/* Analysis Result */}
          {analysis && !loading && (
            <div>
              {/* Status */}
              {analysis.status === "success" && (
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    borderLeft: `4px solid ${theme.positive}`,
                    borderRadius: "8px",
                    marginBottom: "1.5rem",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: theme.positive,
                      fontWeight: "600",
                      fontSize: "0.95rem",
                    }}
                  >
                    ✓ Analysis Complete
                  </p>
                </div>
              )}

              {/* Agent Analysis */}
              {analysis.analysis && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3
                    style={{
                      margin: "0 0 1rem 0",
                      fontSize: "1rem",
                      fontWeight: "700",
                      color: theme.text,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>🤖</span>
                    AI Agent Analysis
                  </h3>
                  <div
                    style={{
                      backgroundColor: darkMode ? "#0f172a" : "#f8fafc",
                      padding: "1rem",
                      borderRadius: "8px",
                      borderLeft: `4px solid ${theme.neutral}`,
                      fontSize: "0.95rem",
                      lineHeight: "1.6",
                      color: theme.text,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {analysis.analysis.sentiment_analysis}
                  </div>
                </div>
              )}

              {/* User Interests */}
              {analysis.user_interests && (
                <div style={{ marginBottom: "1rem" }}>
                  <h3
                    style={{
                      margin: "0 0 0.75rem 0",
                      fontSize: "0.95rem",
                      fontWeight: "700",
                      color: theme.text,
                    }}
                  >
                    📌 Your Tracked Stocks
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {analysis.user_interests.map((ticker) => (
                      <span
                        key={ticker}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: theme.neutral,
                          color: "white",
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                        }}
                      >
                        {ticker}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: `1px solid ${theme.border}`,
            display: "flex",
            gap: "1rem",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: theme.text,
              color: theme.bg,
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = "0.9";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = "1";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SentimentAnalysisModal;
