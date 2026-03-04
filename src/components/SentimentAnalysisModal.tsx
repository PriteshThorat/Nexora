import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { Dispatch } from "@reduxjs/toolkit";
import { useFormatAIResponse } from "../hooks/useFormatAIResponse.tsx";
import { useInFlightRequests } from "../hooks/useInFlightRequests.tsx";
import { setCachedSentimentAnalysis } from "../store/aiAnalysisSlice.ts";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface SentimentAnalysisModalProps {
  headline: string;
  isOpen: boolean;
  onClose: () => void;
}

interface SentimentAnalysis {
  status: string;
  analysis: {
    sentiment_analysis: string;
  };
  user_interests: string[];
}

function SentimentAnalysisModal({
  headline,
  isOpen,
  onClose,
}: SentimentAnalysisModalProps) {
  const darkMode = useSelector(
    (state: any) => state.theme.darkMode as boolean,
  );
  const dispatch = useDispatch<Dispatch>();
  const sentimentAnalysisCache = useSelector(
    (state: any) => state.aiAnalysis.sentimentAnalysis as Record<string, any>,
  );
  const cacheExpiry = useSelector((state: any) => state.aiAnalysis.cacheExpiry as number);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SentimentAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { formatPrediction } = useFormatAIResponse();
  const { makeCachedRequest } = useInFlightRequests();

  // Helper function to create a hash of the headline
  const hashHeadline = (text: string): string => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  };

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
      const headlineHash = hashHeadline(headline);
      // Check if analysis is cached and not expired
      const cached = sentimentAnalysisCache[headlineHash];
      if (cached && Date.now() - cached.timestamp < cacheExpiry) {
        setAnalysis(cached.data);
        setError(null);
        setLoading(false);
      } else {
        fetchSentimentAnalysis();
      }
    }
  }, [isOpen, headline]);

  const fetchSentimentAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const headlineHash = hashHeadline(headline);

      const data = await makeCachedRequest(
        `sentiment-${headlineHash}`,
        async () => {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("Authentication required");
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
            const result = await response.json();
            // Store in Redux cache
            dispatch(
              setCachedSentimentAnalysis({ headlineHash, data: result }),
            );
            return result;
          } else {
            throw new Error("Failed to fetch sentiment analysis");
          }
        },
      );

      setAnalysis(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An error occurred";
      console.error("Error:", err);
      setError(message);
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
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = theme.text;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = theme.textSecondary;
            }}
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
                    }}
                  >
                    {formatPrediction(analysis.analysis.sentiment_analysis)}
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
                    {analysis.user_interests.map((ticker: string) => (
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
            onMouseEnter={(e: React.MouseEvent) => {
              const target = e.target as HTMLElement;
              target.style.opacity = "0.9";
              target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e: React.MouseEvent) => {
              const target = e.target as HTMLElement;
              target.style.opacity = "1";
              target.style.transform = "translateY(0)";
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
