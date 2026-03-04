import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useFormatAIResponse } from "../hooks/useFormatAIResponse.tsx";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface FinancialAdvisorWidgetProps {
  isVisible: boolean;
  onClose: () => void;
}

function FinancialAdvisorWidget({ isVisible, onClose }: FinancialAdvisorWidgetProps) {
  const darkMode = useSelector((state: any) => state.theme.darkMode);
  const { formatPrediction } = useFormatAIResponse();
  const [advice, setAdvice] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryTime, setRetryTime] = useState<number | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const widgetTheme = {
    text: darkMode ? "#f1f5f9" : "#1f2937",
    textSecondary: darkMode ? "#94a3b8" : "#6b7280",
    accent: darkMode ? "#818cf8" : "#6366f1",
    positive: "#10b981",
    negative: "#ef4444",
    warning: "#f59e0b",
    cardBg: darkMode ? "#1e293b" : "#ffffff",
    border: darkMode ? "#334155" : "#e2e8f0",
  };

  const fetchFinancialAdvice = async () => {
    if (!isVisible) return;

    setLoading(true);
    setError(null);
    setRetryTime(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      console.log("💼 Fetching financial advisor...");

      const response = await fetch(
        `${API_BASE_URL}/api/agents/financial_advisor/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        },
      );

      const data = await response.json();
      console.log("💼 Financial advisor response:", data);

      if (response.ok && data.status === "success") {
        setAdvice(data.advice?.advice || data.advice);
        setError(null);
        setRetryTime(null);
        console.log("✅ Financial advice loaded");
      } else {
        const errorMsg = data.error || "Failed to get financial advice";
        setError(errorMsg);
        setAdvice(null);

        // Extract retry time from error message
        if (errorMsg.includes("429") || errorMsg.includes("quota")) {
          const retryMatch = errorMsg.match(/Please retry in ([\d.]+)s/);
          if (retryMatch) {
            setRetryTime(Math.round(parseFloat(retryMatch[1])));
          }
        }

        console.error("❌ Financial advisor failed:", errorMsg);
      }
    } catch (err: any) {
      console.error("❌ Financial advisor error:", err);
      setError((err as Error).message || "Error fetching financial advice");
      setAdvice(null);
      setRetryTime(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchFinancialAdvice();
    }
  }, [isVisible]);

  // Auto-retry after quota timeout
  useEffect(() => {
    if (retryTime && retryTime > 0 && isVisible) {
      console.log(`⏳ Will retry financial advisor in ${retryTime}s`);
      const timer = setTimeout(() => {
        console.log("🔄 Retrying financial advisor...");
        fetchFinancialAdvice();
      }, retryTime * 1000);

      return () => clearTimeout(timer);
    }
  }, [retryTime, isVisible]);

  const handleClose = () => {
    if (hideTimeoutRef.current !== null) {
      clearTimeout(hideTimeoutRef.current);
    }
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        right: "16px",
        transform: "translateY(-50%)",
        width: "500px",
        maxHeight: "80vh",
        background: widgetTheme.cardBg,
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        border: `1px solid ${widgetTheme.border}`,
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        zIndex: 9997,
        animation: "0.22s cubic-bezier(0.16, 1, 0.3, 1) both slideInRight",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        overflowY: "auto",
      }}
      onMouseLeave={() => {
        hideTimeoutRef.current = setTimeout(handleClose, 500);
      }}
      onMouseEnter={() => {
        if (hideTimeoutRef.current !== null) {
          clearTimeout(hideTimeoutRef.current);
        }
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateY(-50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) scale(1);
          }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "12px",
          borderBottom: `1px solid ${widgetTheme.border}`,
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: "700",
            color: widgetTheme.text,
          }}
        >
          FINANCIAL ADVISOR
        </span>
        <button
          onClick={handleClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            color: widgetTheme.textSecondary,
            padding: "0",
            display: "flex",
            alignItems: "center",
          }}
        >
          ✕
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            color: widgetTheme.textSecondary,
          }}
        >
          <div
            style={{
              display: "inline-block",
              width: "20px",
              height: "20px",
              border: `3px solid ${widgetTheme.border}`,
              borderTop: `3px solid ${widgetTheme.accent}`,
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <span style={{ marginLeft: "10px" }}>Loading advice...</span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div
          style={{
            padding: "12px",
            background: "rgba(239, 68, 68, 0.1)",
            border: `1px solid ${widgetTheme.negative}`,
            borderRadius: "8px",
            color: widgetTheme.negative,
            fontSize: "13px",
            lineHeight: "1.4",
          }}
        >
          <div>Daily API limit reached</div>
          {retryTime && (
            <div style={{ marginTop: "8px", color: widgetTheme.textSecondary }}>
              Retry in {retryTime}s
            </div>
          )}
        </div>
      )}

      {/* Advice Content */}
      {advice && !loading && !error && (
        <div
          style={{
            fontSize: "13px",
            lineHeight: "1.6",
            color: widgetTheme.text,
            maxHeight: "500px",
            overflowY: "auto",
            paddingRight: "8px",
          }}
        >
          {formatPrediction(advice)}
        </div>
      )}

      {/* Retry Button */}
      {error && !loading && !retryTime && (
        <button
          onClick={fetchFinancialAdvice}
          style={{
            padding: "10px 16px",
            background: widgetTheme.accent,
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "600",
            marginTop: "8px",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e: any) => {
            (e.target as HTMLElement).style.opacity = "0.9";
          }}
          onMouseLeave={(e: any) => {
            (e.target as HTMLElement).style.opacity = "1";
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default FinancialAdvisorWidget;
