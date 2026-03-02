import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function FraudDetectionWidget({ transactions, userProfile, onNewTransaction }) {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [latestTransaction, setLatestTransaction] = useState(null);
  const [fraudDetection, setFraudDetection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const analysisTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const theme = {
    text: darkMode ? "#f1f5f9" : "#1f2937",
    textSecondary: darkMode ? "#94a3b8" : "#6b7280",
    accent: darkMode ? "#818cf8" : "#6366f1",
    positive: "#10b981",
    negative: "#ef4444",
    warning: "#f59e0b",
  };

  // Extract latest transaction
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const latest = transactions[0];
      setLatestTransaction(latest);
      setIsOpen(true);
      setFraudDetection(null);
      setError(null);

      // Analyze when transaction changes
      analyzeFraud(latest);
    }
  }, [transactions?.length, transactions?.[0]?.transaction_id]);

  // Listen for new transactions via prop
  useEffect(() => {
    if (onNewTransaction) {
      const unsubscribe = onNewTransaction((newTxn) => {
        setLatestTransaction(newTxn);
        setIsOpen(true);
        setFraudDetection(null);
        setError(null);
        analyzeFraud(newTxn);
      });

      return unsubscribe;
    }
  }, [onNewTransaction]);

  const analyzeFraud = async (txn) => {
    if (!txn) return;

    console.log("🔍 Starting fraud analysis for transaction:", txn);
    setLoading(true);
    setError(null);

    // Clear any pending analysis
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }

    // Debounce analysis to avoid rapid consecutive calls
    analysisTimeoutRef.current = setTimeout(async () => {
      try {
        if (!txn.amount) {
          throw new Error("Transaction missing amount field");
        }

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        const frequency = userProfile?.transaction_frequency || 2;
        console.log("📊 Fraud detection payload:", {
          amount: parseFloat(txn.amount),
          frequency: frequency,
        });

        const response = await fetch(
          `${API_BASE_URL}/api/agents/fraud_detection/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: parseFloat(txn.amount),
              frequency: frequency,
            }),
          },
        );

        const data = await response.json();
        console.log("🔍 Fraud detection response:", data);

        if (response.ok && data.status === "success") {
          setFraudDetection(data.result);
          setError(null);
          console.log("✅ Fraud detection successful:", data.result);
        } else {
          setError(data.error || "Failed to analyze transaction");
          setFraudDetection(null);
          console.error("❌ Fraud detection failed:", data.error);
        }
      } catch (err) {
        console.error("❌ Fraud detection error:", err);
        setError(err.message || "Error analyzing transaction");
        setFraudDetection(null);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const formatErrorMessage = (errorMsg) => {
    if (!errorMsg) return "Unable to analyze transaction";

    // Check for quota exceeded error
    if (errorMsg.includes("429") || errorMsg.includes("quota")) {
      return "Daily limit reached. Please try again later.";
    }

    // For other errors, show short message
    const firstLine = errorMsg.split("\n")[0];
    return firstLine.length > 60
      ? firstLine.substring(0, 57) + "..."
      : firstLine;
  };

  const getFraudColor = (fraudFlag) => {
    if (!fraudFlag) return theme.textSecondary;
    if (fraudFlag === "Not Suspicious") return theme.positive;
    if (fraudFlag === "Suspicious") return theme.warning;
    if (fraudFlag === "Highly Suspicious") return theme.negative;
    if (fraudFlag === "Error") return theme.negative;
    return theme.textSecondary;
  };

  if (!latestTransaction || !isOpen) {
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

  const handleCardEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleCardLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 120);
  };

  return (
    <>
      <style>{`
        @keyframes fraud-card-in {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Floating Fraud Detection Card - Bottom of Page */}
      <div
        onMouseEnter={handleCardEnter}
        onMouseLeave={handleCardLeave}
        style={{
          position: "fixed",
          bottom: `${pad}px`,
          right: `${pad}px`,
          maxWidth: "420px",
          zIndex: 9999,
          pointerEvents: "auto",
          animation: "fraud-card-in 0.22s cubic-bezier(0.16,1,0.3,1) both",
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
              borderBottom: `1px solid ${darkMode ? "rgba(148,163,184,0.07)" : "rgba(226,232,240,0.7)"}`,
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
              Fraud Detection
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: "0.75rem",
                color: theme.textSecondary,
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              ${parseFloat(latestTransaction.amount).toFixed(2)}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
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
          <div style={{ padding: "0.85rem 1.1rem", overflow: "hidden" }}>
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
                Analyzing transaction...
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
                  lineHeight: "1.4",
                }}
              >
                {formatErrorMessage(error)}
              </div>
            )}

            {/* Result State */}
            {fraudDetection && !loading && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                {/* Fraud Flag */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.6rem",
                    background:
                      fraudDetection.fraud_flag === "Not Suspicious"
                        ? "rgba(16, 185, 129, 0.1)"
                        : fraudDetection.fraud_flag === "Suspicious"
                          ? "rgba(245, 158, 11, 0.1)"
                          : "rgba(239, 68, 68, 0.1)",
                    borderRadius: "8px",
                    border: `1px solid ${
                      fraudDetection.fraud_flag === "Not Suspicious"
                        ? "rgba(16, 185, 129, 0.2)"
                        : fraudDetection.fraud_flag === "Suspicious"
                          ? "rgba(245, 158, 11, 0.2)"
                          : "rgba(239, 68, 68, 0.2)"
                    }`,
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: getFraudColor(fraudDetection.fraud_flag),
                    }}
                  />
                  <span
                    style={{
                      fontWeight: "700",
                      fontSize: "0.8rem",
                      color: getFraudColor(fraudDetection.fraud_flag),
                    }}
                  >
                    {fraudDetection.fraud_flag}
                  </span>
                  {fraudDetection.fraud_score !== undefined && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "0.7rem",
                        color: theme.textSecondary,
                        background: darkMode
                          ? "rgba(148, 163, 184, 0.2)"
                          : "rgba(226, 232, 240, 0.5)",
                        padding: "0.2rem 0.4rem",
                        borderRadius: "4px",
                      }}
                    >
                      Score: {fraudDetection.fraud_score}
                    </span>
                  )}
                </div>

                {/* Explanation */}
                {fraudDetection.explanation && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: theme.text,
                      lineHeight: "1.5",
                      padding: "0.6rem",
                      background: darkMode
                        ? "rgba(148, 163, 184, 0.05)"
                        : "rgba(226, 232, 240, 0.3)",
                      borderRadius: "6px",
                      borderLeft: `3px solid ${getFraudColor(fraudDetection.fraud_flag)}`,
                    }}
                  >
                    {fraudDetection.explanation}
                  </div>
                )}
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
      `}</style>
    </>
  );
}

export default FraudDetectionWidget;
