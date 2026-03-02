import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useFormatAIResponse } from "../hooks/useFormatAIResponse";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function CreditRiskWidget({ isVisible, onClose }) {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const { formatPrediction, theme } = useFormatAIResponse();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryTime, setRetryTime] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const hideTimeoutRef = useRef(null);

  const fetchCreditRisk = async () => {
    if (!isVisible) return;

    setLoading(true);
    setError(null);
    setRetryTime(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      console.log("🏦 Fetching credit risk assessment...");

      const response = await fetch(`${API_BASE_URL}/api/agents/credit_risk/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      console.log("🏦 Credit risk response:", data);

      if (response.ok && data.status === "success") {
        setAssessment(data.assessment?.credit_assessment || data.assessment);
        setError(null);
        setRetryTime(null);
        console.log("✅ Credit risk assessment loaded");
      } else {
        const errorMsg = data.error || "Failed to load credit risk assessment";
        setError(errorMsg);
        setAssessment(null);

        // Extract retry time from error message
        if (errorMsg.includes("429") || errorMsg.includes("quota")) {
          const retryMatch = errorMsg.match(/Please retry in ([\d.]+)s/);
          if (retryMatch) {
            setRetryTime(Math.round(parseFloat(retryMatch[1])));
          }
        }

        console.error("❌ Credit risk failed:", errorMsg);
      }
    } catch (err) {
      console.error("❌ Credit risk error:", err);
      setError(err.message || "Error fetching credit risk assessment");
      setAssessment(null);
      setRetryTime(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setIsOpen(true);
      fetchCreditRisk();
    }
  }, [isVisible]);

  // Auto-retry after quota timeout
  useEffect(() => {
    if (retryTime && retryTime > 0 && isVisible) {
      console.log(`⏳ Will retry credit risk assessment in ${retryTime}s`);
      const timer = setTimeout(() => {
        console.log("🔄 Retrying credit risk assessment...");
        fetchCreditRisk();
      }, retryTime * 1000);

      return () => clearTimeout(timer);
    }
  }, [retryTime, isVisible]);

  const handleCardEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleCardLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      onClose();
    }, 120);
  };

  if (!isOpen) {
    return null;
  }

  const bg = darkMode ? "rgba(10,14,26,0.97)" : "rgba(255,255,255,0.97)";
  const borderColor = darkMode
    ? "rgba(99,102,241,0.32)"
    : "rgba(99,102,241,0.22)";
  const shadow = darkMode
    ? "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.12)"
    : "0 20px 60px rgba(99,102,241,0.18), 0 0 0 1px rgba(99,102,241,0.08)";

  const pad = 16;

  return (
    <>
      <style>{`
        @keyframes credit-modal-in {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>

      {/* Floating Credit Risk Card - Top Right Position */}
      <div
        className="credit-risk-widget"
        onMouseEnter={handleCardEnter}
        onMouseLeave={handleCardLeave}
        style={{
          position: "fixed",
          top: `${pad + 60}px`,
          right: `${pad}px`,
          maxWidth: "420px",
          maxHeight: "70vh",
          zIndex: 9999,
          pointerEvents: "auto",
          animation: "credit-modal-in 0.22s cubic-bezier(0.16,1,0.3,1) both",
          overflowY: "auto",
          scrollBehavior: "smooth",
        }}
      >
        {/* Card */}
        <div
          style={{
            position: "relative",
            background: bg,
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: `1px solid ${borderColor}`,
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: shadow,
          }}
        >
          {/* Header strip */}
          <div
            style={{
              padding: "0.65rem 1.1rem",
              borderBottom: `1px solid ${
                darkMode ? "rgba(148,163,184,0.07)" : "rgba(226,232,240,0.7)"
              }`,
              background: darkMode
                ? "rgba(99,102,241,0.1)"
                : "rgba(99,102,241,0.05)",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: "700",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: theme.accent,
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              Credit Assessment
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                onClose();
              }}
              style={{
                marginLeft: "auto",
                background: "transparent",
                border: "none",
                color: theme.textSecondary,
                fontSize: "0.9rem",
                cursor: "pointer",
                padding: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = theme.text)}
              onMouseLeave={(e) => (e.target.style.color = theme.textSecondary)}
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div
            style={{
              padding: "0.85rem 1.1rem",
              overflow: "auto",
              maxHeight: "calc(70vh - 50px)",
            }}
          >
            {/* Loading spinner */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: theme.textSecondary,
                  fontSize: "0.8rem",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: theme.accent,
                    animation: "pulse 1.5s infinite",
                  }}
                />
                Loading assessment...
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div
                style={{
                  fontSize: "0.8rem",
                  color: theme.negative,
                  padding: "0.6rem",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  borderRadius: "6px",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  lineHeight: "1.5",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <div>
                  {error.includes("429") || error.includes("quota")
                    ? "Daily API limit reached"
                    : error.includes("Authentication")
                      ? "Authentication required"
                      : "Unable to load assessment"}
                </div>
                {retryTime && (
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "#fca5a5",
                      fontWeight: "500",
                    }}
                  >
                    Retry in {retryTime}s
                  </div>
                )}
              </div>
            )}

            {/* Result State */}
            {assessment && !loading && (
              <div style={{ fontSize: "0.75rem", color: theme.text }}>
                {formatPrediction(assessment)}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        /* Scrollbar styling */
        .credit-risk-widget::-webkit-scrollbar {
          width: 8px;
        }
        
        .credit-risk-widget::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .credit-risk-widget::-webkit-scrollbar-thumb {
          background: ${darkMode ? "rgba(148, 163, 184, 0.4)" : "rgba(99, 102, 241, 0.3)"};
          border-radius: 4px;
        }
        
        .credit-risk-widget::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? "rgba(148, 163, 184, 0.6)" : "rgba(99, 102, 241, 0.5)"};
        }
      `}</style>
    </>
  );
}

export default CreditRiskWidget;
