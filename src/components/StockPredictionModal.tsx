import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { Dispatch } from "redux";
import { useFormatAIResponse } from "../hooks/useFormatAIResponse";
import { useInFlightRequests } from "../hooks/useInFlightRequests";
import { setCachedPrediction } from "../store/aiAnalysisSlice.ts";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface DOMRect {
  top: number;
  left: number;
  [key: string]: number;
}

interface PredictionContent {
  prediction: string;
  latest_price?: number;
  [key: string]: any;
}

interface StockPredictionData {
  prediction?: PredictionContent;
  [key: string]: any;
}

interface CachedPrediction {
  data: StockPredictionData;
  timestamp: number;
}

interface StockPredictionModalProps {
  ticker: string;
  isOpen: boolean;
  cardRect: DOMRect | null;
  onClose: () => void;
}

interface RootState {
  theme: {
    darkMode: boolean;
  };
  aiAnalysis: {
    stockPredictions: Record<string, CachedPrediction>;
    cacheExpiry: number;
  };
}

function StockPredictionModal({
  ticker,
  isOpen,
  cardRect,
  onClose,
}: StockPredictionModalProps) {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const dispatch = useDispatch<Dispatch>();
  const cachedPredictions = useSelector(
    (state: RootState) => state.aiAnalysis.stockPredictions,
  );
  const cacheExpiry = useSelector(
    (state: RootState) => state.aiAnalysis.cacheExpiry,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<StockPredictionData | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const { formatPrediction, theme } = useFormatAIResponse();
  const { makeCachedRequest } = useInFlightRequests();

  // Additional theme colors
  const extendedTheme = {
    ...theme,
    warning: "#f59e0b",
  };

  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Format error message for better display
  const formatErrorMessage = (errorMsg: string): string => {
    if (!errorMsg) return "An error occurred";

    // Check for quota exceeded error
    if (errorMsg.includes("429") || errorMsg.includes("quota")) {
      return "Daily limit reached. Please try again later.";
    }

    // For other errors, show first line only (max 60 chars)
    const firstLine = errorMsg.split("\n")[0];
    return firstLine.length > 60
      ? firstLine.substring(0, 57) + "..."
      : firstLine;
  };

  useEffect(() => {
    if (isOpen && ticker) {
      // Check if prediction is cached and not expired
      const cached = cachedPredictions[ticker];
      if (cached && Date.now() - cached.timestamp < cacheExpiry) {
        setPrediction(cached.data);
        setError(null);
        setLoading(false);
      } else {
        fetchStockPrediction();
      }
    }
  }, [isOpen, ticker]);

  const fetchStockPrediction = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await makeCachedRequest(`stock-${ticker}`, async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/agents/stock_prediction/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ticker: ticker,
            }),
          },
        );

        if (response.ok) {
          const result = await response.json();
          // Store in Redux cache
          dispatch(setCachedPrediction({ ticker, data: result }));
          return result;
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || "Failed to fetch stock prediction",
          );
        }
      });

      setPrediction(data);
    } catch (err: unknown) {
      console.error("Error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !cardRect) return null;

  const cancelHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleTooltipEnter = () => {
    cancelHideTimeout();
  };

  const handleTooltipLeave = () => {
    cancelHideTimeout();
    hideTimeoutRef.current = setTimeout(onClose, 120);
  };

  // Extract recommendation
  const extractRecommendation = (
    text: string,
  ): { type: string; confidence: number } => {
    if (!text) return { type: "Hold", confidence: 0 };
    const holdMatch = text.match(/Recommendation:\s*(\w+)/i);
    const confidenceMatch = text.match(/Confidence[^:]*:\s*(\d+)%/i);
    return {
      type: holdMatch ? holdMatch[1] : "Hold",
      confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 0,
    };
  };

  const recommendation = prediction?.prediction?.prediction
    ? extractRecommendation(prediction.prediction.prediction)
    : null;

  const getRecommendationColor = (type: string | undefined): string => {
    switch (type?.toUpperCase()) {
      case "BUY":
        return theme.positive;
      case "SELL":
        return theme.negative;
      case "HOLD":
      default:
        return extendedTheme.warning;
    }
  };

  const bg = darkMode ? "rgba(10,14,26,0.97)" : "rgba(255,255,255,0.97)";
  const borderColor = darkMode
    ? "rgba(99,102,241,0.32)"
    : "rgba(99,102,241,0.22)";
  const shadow = darkMode
    ? "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.12)"
    : "0 20px 60px rgba(99,102,241,0.18), 0 0 0 1px rgba(99,102,241,0.08)";

  const sidebarWidth =
    typeof window !== "undefined" && window.innerWidth > 768 ? 240 : 0;
  const pad = 16;
  const leftOffset = sidebarWidth + pad;
  // Calculate tail position to point at the hovered card
  const tailLeftPx = Math.max(22, cardRect.left - leftOffset + 22);

  return (
    <>
      <style>{`
        @keyframes stock-tooltip-in {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes stock-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Floating Tooltip */}
      <div
        onMouseEnter={handleTooltipEnter}
        onMouseLeave={handleTooltipLeave}
        style={{
          position: "fixed",
          bottom: `${window.innerHeight - cardRect.top + 14}px`,
          left: `${leftOffset}px`,
          right: `${pad}px`,
          zIndex: 9999,
          pointerEvents: "auto",
          animation: "stock-tooltip-in 0.22s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Tooltip body with transparent background */}
        <div
          style={{
            position: "relative",
            background: bg,
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: `1px solid ${borderColor}`,
            borderRadius: "14px",
            overflow: "visible",
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
              Financial Advisor
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: "0.85rem",
                fontWeight: "700",
                color: theme.text,
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              {ticker}
            </span>
            {prediction?.prediction?.latest_price && (
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  color: theme.accent,
                  fontFamily: "'Roboto Mono', monospace",
                }}
              >
                ${(prediction.prediction?.latest_price as number).toFixed(2)}
              </span>
            )}
          </div>

          {/* Body */}
          <div style={{ padding: "0.85rem 1.1rem", overflow: "hidden" }}>
            {/* Loading spinner */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.55rem",
                  padding: "0.2rem 0",
                }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    border: `2px solid ${darkMode ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)"}`,
                    borderTop: `2px solid ${theme.accent}`,
                    animation: "stock-spin 0.7s linear infinite",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: theme.textSecondary,
                    fontStyle: "italic",
                  }}
                >
                  Analyzing with AI…
                </span>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#ef4444",
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

            {/* Prediction result */}
            {prediction && !loading && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                  maxHeight: "300px",
                  overflowY: "auto",
                  paddingRight: "0.5rem",
                }}
              >
                {/* Recommendation tag */}
                {recommendation && (
                  <div
                    style={{
                      display: "flex",
                      gap: "0.4rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        background: `${getRecommendationColor(recommendation.type)}1a`,
                        color: getRecommendationColor(recommendation.type),
                        border: `1px solid ${getRecommendationColor(recommendation.type)}44`,
                        padding: "0.15rem 0.55rem",
                        borderRadius: "9999px",
                        fontSize: "0.65rem",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {recommendation.type?.toUpperCase()}
                    </span>
                    <span
                      style={{
                        background: `${theme.neutral}1a`,
                        color: theme.neutral,
                        border: `1px solid ${theme.neutral}44`,
                        padding: "0.15rem 0.55rem",
                        borderRadius: "9999px",
                        fontSize: "0.65rem",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {recommendation.confidence}% Confidence
                    </span>
                  </div>
                )}

                {/* AI analysis text - formatted */}
                {prediction?.prediction?.prediction && (
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: theme.text,
                      lineHeight: "1.6",
                    }}
                  >
                    {formatPrediction(
                      prediction.prediction.prediction as string,
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Speech-bubble tail — points down toward the hovered card */}
          <div
            style={{
              position: "absolute",
              bottom: "-11px",
              left: `${tailLeftPx}px`,
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: `11px solid ${darkMode ? "rgba(99,102,241,0.28)" : "rgba(99,102,241,0.18)"}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-9px",
              left: `${tailLeftPx + 1}px`,
              width: 0,
              height: 0,
              borderLeft: "9px solid transparent",
              borderRight: "9px solid transparent",
              borderTop: `9px solid ${bg}`,
            }}
          />
        </div>
      </div>
    </>
  );
}

export default StockPredictionModal;
