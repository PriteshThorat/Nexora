import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function FraudDetectionWidget({ transactions, onNewTransaction }) {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [latestTransaction, setLatestTransaction] = useState(null);
  const [fraudDetection, setFraudDetection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResult, setShowResult] = useState(true);
  const analysisTimeoutRef = useRef(null);

  const theme = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    cardBg: darkMode ? "#1e293b" : "white",
    text: darkMode ? "#f1f5f9" : "#1f2937",
    textSecondary: darkMode ? "#94a3b8" : "#6b7280",
    border: darkMode ? "rgba(148, 163, 184, 0.1)" : "rgba(226, 232, 240, 0.8)",
    positive: "#10b981",
    negative: "#ef4444",
    warning: "#f59e0b",
  };

  // Extract latest transaction
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const latest = transactions[0];
      setLatestTransaction(latest);
      setShowResult(true);
      setFraudDetection(null);
      setError(null);

      // Analyze when transaction changes
      analyzeFraud(latest);
    }
  }, [transactions?.length]);

  // Listen for new transactions via prop
  useEffect(() => {
    if (onNewTransaction) {
      const unsubscribe = onNewTransaction((newTxn) => {
        setLatestTransaction(newTxn);
        setShowResult(true);
        setFraudDetection(null);
        setError(null);
        analyzeFraud(newTxn);
      });

      return unsubscribe;
    }
  }, [onNewTransaction]);

  const analyzeFraud = async (txn) => {
    if (!txn) return;

    setLoading(true);
    setError(null);

    // Clear any pending analysis
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }

    // Debounce analysis to avoid rapid consecutive calls
    analysisTimeoutRef.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

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
              frequency: 2, // Default frequency - can be updated based on user data
            }),
          },
        );

        const data = await response.json();

        if (response.ok && data.status === "success") {
          setFraudDetection(data.result);
          setError(null);
        } else {
          setError(data.error || "Failed to analyze transaction");
          setFraudDetection(null);
        }
      } catch (err) {
        console.error("Fraud detection error:", err);
        setError(err.message || "Error analyzing transaction");
        setFraudDetection(null);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const formatErrorMessage = (errorMsg) => {
    if (!errorMsg) return "Unable to analyze transaction";

    if (errorMsg.includes("429") || errorMsg.includes("quota")) {
      const quotaMatch = errorMsg.match(/Please retry in ([\d.]+)s/);
      const retryTime = quotaMatch
        ? Math.round(parseFloat(quotaMatch[1]))
        : null;

      return (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <div>API Quota Exceeded</div>
          <div style={{ fontSize: "0.7rem", color: "#fca5a5" }}>
            Daily limit reached. Please try again shortly.
            {retryTime && ` Retry in ~${retryTime}s`}
          </div>
        </div>
      );
    }

    const firstLine = errorMsg.split("\n")[0];
    return firstLine.length > 80
      ? firstLine.substring(0, 77) + "..."
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

  if (!latestTransaction || !showResult) {
    return null;
  }

  return (
    <div
      style={{
        background: theme.cardBg,
        padding: "1.25rem",
        borderRadius: "12px",
        border: `1px solid ${theme.border}`,
        boxShadow: darkMode
          ? "0 1px 3px rgba(0,0,0,0.3)"
          : "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.85rem",
              fontWeight: "700",
              color: theme.text,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontFamily: "'Roboto Mono', monospace",
            }}
          >
            Fraud Detection
          </div>
          <div
            style={{
              fontSize: "0.7rem",
              color: theme.textSecondary,
              marginTop: "0.25rem",
            }}
          >
            Latest Transaction Analysis
          </div>
        </div>
        <button
          onClick={() => setShowResult(false)}
          style={{
            background: "transparent",
            border: "none",
            color: theme.textSecondary,
            fontSize: "1.2rem",
            cursor: "pointer",
            padding: "0.25rem 0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = darkMode
              ? "rgba(148, 163, 184, 0.1)"
              : "rgba(226, 232, 240, 0.5)";
            e.target.style.color = theme.text;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = theme.textSecondary;
          }}
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* Transaction Info */}
      {latestTransaction && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem",
            background: darkMode
              ? "rgba(148, 163, 184, 0.05)"
              : "rgba(226, 232, 240, 0.5)",
            borderRadius: "8px",
            fontSize: "0.8rem",
          }}
        >
          <div style={{ color: theme.textSecondary, marginBottom: "0.25rem" }}>
            Amount:{" "}
            <span style={{ color: theme.text, fontWeight: "600" }}>
              ${parseFloat(latestTransaction.amount).toFixed(2)}
            </span>
          </div>
          <div style={{ color: theme.textSecondary, marginBottom: "0.25rem" }}>
            Type:{" "}
            <span style={{ color: theme.text, fontWeight: "600" }}>
              {latestTransaction.type === "sent" ? "Sent" : "Received"}
            </span>
          </div>
          {latestTransaction.description && (
            <div style={{ color: theme.textSecondary }}>
              Desc:{" "}
              <span
                style={{
                  color: theme.text,
                  fontFamily: "'Roboto Mono', monospace",
                }}
              >
                {latestTransaction.description.substring(0, 30)}
                {latestTransaction.description.length > 30 ? "..." : ""}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "1rem",
            color: theme.textSecondary,
            fontSize: "0.85rem",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: theme.textSecondary,
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
            fontSize: "0.78rem",
            color: theme.negative,
            padding: "0.75rem",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderRadius: "6px",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <div>{formatErrorMessage(error)}</div>
        </div>
      )}

      {/* Result State */}
      {fraudDetection && !loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {/* Fraud Flag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem",
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
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: getFraudColor(fraudDetection.fraud_flag),
              }}
            />
            <span
              style={{
                fontWeight: "700",
                fontSize: "0.85rem",
                color: getFraudColor(fraudDetection.fraud_flag),
              }}
            >
              {fraudDetection.fraud_flag}
            </span>
            {fraudDetection.fraud_score !== undefined && (
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: "0.75rem",
                  color: theme.textSecondary,
                  background: darkMode
                    ? "rgba(148, 163, 184, 0.2)"
                    : "rgba(226, 232, 240, 0.5)",
                  padding: "0.25rem 0.5rem",
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
                fontSize: "0.78rem",
                color: theme.text,
                lineHeight: "1.6",
                padding: "0.75rem",
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
    </div>
  );
}

export default FraudDetectionWidget;
