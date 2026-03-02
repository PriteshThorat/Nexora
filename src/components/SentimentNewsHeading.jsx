import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCachedSentimentAnalysis,
  setCachedNewsSentiment,
} from "../store/aiAnalysisSlice";
import { useInFlightRequests } from "../hooks/useInFlightRequests";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const SCROLL_ANIMATION_NAME = "scroll-ticker";

const DEFAULT_STOCKS = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN"];

function SentimentNewsHeading() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const sentimentAnalysisCache = useSelector(
    (state) => state.aiAnalysis.sentimentAnalysis,
  );
  const newsSentimentCache = useSelector(
    (state) => state.aiAnalysis.newsSentiment,
  );
  const cacheExpiry = useSelector((state) => state.aiAnalysis.cacheExpiry);
  const dispatch = useDispatch();
  const { makeCachedRequest } = useInFlightRequests();
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchedStocks, setWatchedStocks] = useState([]);

  // Hover tooltip state
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredAnalysis, setHoveredAnalysis] = useState(null);
  const [loadingHover, setLoadingHover] = useState(false);
  const [hoverError, setHoverError] = useState(null);
  const [itemRect, setItemRect] = useState(null);

  // Stale guard
  const activeHoverRef = useRef(null);
  // Delayed hide so user can move mouse into the tooltip
  const hideTimeoutRef = useRef(null);

  // Theme colors
  const theme = {
    positive: "#10b981",
    negative: "#ef4444",
    neutral: "#6366f1",
    bearish: "#ef4444",
    bullish: "#10b981",
    bg: darkMode ? "#0f172a" : "#f8fafc",
    text: darkMode ? "#f1f5f9" : "#1f2937",
    textSecondary: darkMode ? "#94a3b8" : "#6b7280",
    accent: darkMode ? "#818cf8" : "#6366f1",
  };

  // Fetch watched stocks
  useEffect(() => {
    const fetchWatchedStocks = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(
          `${API_BASE_URL.replace(/\/$/, "")}/api/get-watched-stocks`,
          {
            headers: { Authorization: `Token ${token}` },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setWatchedStocks(data.watched_stocks || []);
        }
      } catch (err) {
        console.error("Error fetching watched stocks:", err);
      }
    };

    fetchWatchedStocks();
  }, []);

  // Sync watched stocks when user ticks/unticks from StockWidget
  useEffect(() => {
    const handleWatchedStocksChanged = (e) => {
      setWatchedStocks(e.detail.watchedStocks);
    };
    window.addEventListener("watchedStocksChanged", handleWatchedStocksChanged);
    return () => {
      window.removeEventListener(
        "watchedStocksChanged",
        handleWatchedStocksChanged,
      );
    };
  }, []);

  // Fetch news headlines
  useEffect(() => {
    const fetchHeadlines = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const defaults = DEFAULT_STOCKS.filter(
          (s) => !watchedStocks.includes(s),
        );
        const stocksToFetch = [...watchedStocks, ...defaults].slice(0, 6);

        const newsPromises = stocksToFetch.map((ticker) => {
          // Check if news is cached for this ticker
          const cached = (newsSentimentCache || {})[ticker];
          if (cached && Date.now() - cached.timestamp < cacheExpiry) {
            return Promise.resolve(cached.data);
          }

          // Fetch if not cached
          return makeCachedRequest(`news-${ticker}`, async () => {
            const res = await fetch(
              `${API_BASE_URL.replace(/\/$/, "")}/api/news-sentiment/?ticker=${encodeURIComponent(ticker)}&output_format=full`,
              {
                headers: { Authorization: `Token ${token}` },
              },
            );
            if (!res.ok) {
              throw new Error(`News API failed: ${res.status}`);
            }
            const result = await res.json();
            if (!result) {
              throw new Error("Empty response from news API");
            }
            // Store in cache
            dispatch(setCachedNewsSentiment({ ticker, data: result }));
            return result;
          }).catch((err) => {
            console.warn(`Failed to fetch news for ${ticker}:`, err);
            return null;
          });
        });

        const results = await Promise.all(newsPromises);

        const allHeadlines = [];
        results.forEach((result) => {
          if (result && result.data && result.data.feed) {
            const articles = result.data.feed.slice(0, 2);
            articles.forEach((article) => {
              allHeadlines.push({
                title: article.title || "Breaking News",
                sentiment: article.ticker_sentiment_score || 0,
              });
            });
          }
        });

        setHeadlines(
          allHeadlines.length > 0
            ? allHeadlines
            : [{ title: "Market News", sentiment: 0 }],
        );
      } catch (err) {
        console.error("Error fetching headlines:", err);
        setHeadlines([{ title: "Market News", sentiment: 0 }]);
      } finally {
        setLoading(false);
      }
    };

    if (watchedStocks.length > 0 || loading === true) {
      fetchHeadlines();
    }
  }, [watchedStocks]);

  // --- Hover handlers ---
  const hashHeadline = (text) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  };

  const cancelHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleItemHoverEnter = async (headline, idx, e) => {
    cancelHideTimeout();
    const key = `ticker-${idx}`;
    activeHoverRef.current = key;
    setHoveredIndex(idx);
    setItemRect(e.currentTarget.getBoundingClientRect());
    setHoverError(null);

    const headlineHash = hashHeadline(headline.title);
    const cached = sentimentAnalysisCache[headlineHash];

    // Check if cached and not expired
    if (cached && Date.now() - cached.timestamp < cacheExpiry) {
      setHoveredAnalysis(cached.data);
      setLoadingHover(false);
      return;
    }

    setHoveredAnalysis(null);
    setLoadingHover(true);

    try {
      const data = await makeCachedRequest(
        `sentiment-${headlineHash}`,
        async () => {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("Not authenticated");
          }

          const res = await fetch(
            `${API_BASE_URL}/api/agents/sentiment_analysis/`,
            {
              method: "POST",
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ news_text: headline.title }),
            },
          );

          if (res.ok) {
            const result = await res.json();
            dispatch(
              setCachedSentimentAnalysis({ headlineHash, data: result }),
            );
            return result;
          } else {
            throw new Error("Analysis unavailable");
          }
        },
      );

      if (activeHoverRef.current !== key) return;

      setHoveredAnalysis(data);
    } catch (err) {
      if (activeHoverRef.current === key) setHoverError(err.message || "Error");
    } finally {
      if (activeHoverRef.current === key) setLoadingHover(false);
    }
  };

  const dismissTooltip = () => {
    activeHoverRef.current = null;
    setHoveredIndex(null);
    setItemRect(null);
    setHoveredAnalysis(null);
    setHoverError(null);
    setLoadingHover(false);
  };

  const handleItemHoverLeave = () => {
    cancelHideTimeout();
    hideTimeoutRef.current = setTimeout(dismissTooltip, 120);
  };

  const handleTooltipEnter = () => {
    cancelHideTimeout();
    // Pause ticker animation while hovering the analysis tooltip
    const container = document.querySelector(".ticker-container");
    if (container) container.style.animationPlayState = "paused";
  };

  const handleTooltipLeave = () => {
    cancelHideTimeout();
    hideTimeoutRef.current = setTimeout(dismissTooltip, 120);
    // Resume ticker animation
    const container = document.querySelector(".ticker-container");
    if (container) container.style.animationPlayState = "running";
  };

  if (loading) {
    return (
      <div
        style={{
          background: theme.neutral,
          padding: "12px 20px",
          borderRadius: "4px",
          color: "white",
          fontWeight: "600",
          fontSize: "14px",
        }}
      >
        Loading...
      </div>
    );
  }

  // Ticker animation
  const totalWidth = headlines.length * 400;
  const duration = headlines.length * 8;

  const styles = `
    @keyframes ${SCROLL_ANIMATION_NAME} {
      0% { transform: translateX(0); }
      100% { transform: translateX(-${totalWidth}px); }
    }
    .ticker-container {
      animation: ${SCROLL_ANIMATION_NAME} ${duration}s linear infinite;
    }
    .ticker-item {
      display: inline-block;
      flex-shrink: 0;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease;
      position: relative;
    }
    .ticker-dot {
      display: inline-block;
      color: rgba(100, 100, 100, 0.7);
      font-size: 14px;
      padding: 0 10px;
      user-select: none;
    }
    .ticker-item:hover {
      opacity: 0.9;
      text-decoration: underline;
    }
    .ticker-item::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: rgba(255, 255, 255, 0.3);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.2s ease;
    }
    .ticker-item:hover::after {
      transform: scaleX(1);
    }
    @keyframes snh-bubble-in {
      from { opacity: 0; transform: translateY(6px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes snh-spin {
      to { transform: rotate(360deg); }
    }
  `;

  // Full-body-width floating tooltip (position:fixed)
  const FloatingTooltip = () => {
    if (hoveredIndex === null || !itemRect) return null;
    const headline = headlines[hoveredIndex];
    if (!headline) return null;

    const bg = darkMode ? "rgba(10,14,26,0.97)" : "rgba(255,255,255,0.97)";
    const borderColor = darkMode
      ? "rgba(99,102,241,0.32)"
      : "rgba(99,102,241,0.22)";
    const shadow = darkMode
      ? "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.12)"
      : "0 20px 60px rgba(99,102,241,0.18), 0 0 0 1px rgba(99,102,241,0.08)";

    const sidebarWidth = window.innerWidth > 768 ? 240 : 0;
    const pad = 16;
    const leftOffset = sidebarWidth + pad;
    const tailLeftPx = Math.max(22, itemRect.left - leftOffset + 22);

    return (
      <div
        onMouseEnter={handleTooltipEnter}
        onMouseLeave={handleTooltipLeave}
        style={{
          position: "fixed",
          top: `${itemRect.bottom + 14}px`,
          left: `${leftOffset}px`,
          right: `${pad}px`,
          zIndex: 9999,
          pointerEvents: "auto",
          animation: "snh-bubble-in 0.22s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Tail arrow - UP pointing */}
        <div
          style={{
            position: "absolute",
            top: "-11px",
            left: `${tailLeftPx}px`,
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderBottom: `11px solid ${darkMode ? "rgba(99,102,241,0.28)" : "rgba(99,102,241,0.18)"}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-9px",
            left: `${tailLeftPx + 1}px`,
            width: 0,
            height: 0,
            borderLeft: "9px solid transparent",
            borderRight: "9px solid transparent",
            borderBottom: `9px solid ${bg}`,
          }}
        />

        {/* Bubble body */}
        <div
          style={{
            background: bg,
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: `1px solid ${borderColor}`,
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: shadow,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "0.6rem 1.1rem",
              borderBottom: `1px solid ${darkMode ? "rgba(148,163,184,0.07)" : "rgba(226,232,240,0.7)"}`,
              background: darkMode
                ? "rgba(99,102,241,0.1)"
                : "rgba(99,102,241,0.05)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "0.63rem",
                fontWeight: "700",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: theme.accent,
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              AI Sentiment
            </span>
          </div>

          {/* Body */}
          <div style={{ padding: "0.85rem 1.1rem" }}>
            {/* Headline title */}
            <p
              style={{
                fontSize: "0.78rem",
                color: theme.textSecondary,
                fontStyle: "italic",
                lineHeight: "1.5",
                margin: "0 0 0.7rem 0",
              }}
            >
              {headline.title}
            </p>

            {/* Loading */}
            {loadingHover && (
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
                    animation: "snh-spin 0.7s linear infinite",
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
            {hoverError && !loadingHover && (
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span>⚠️</span> {hoverError}
              </div>
            )}

            {/* Analysis */}
            {hoveredAnalysis && !loadingHover && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                {hoveredAnalysis.analysis?.sentiment_analysis && (
                  <p
                    style={{
                      fontSize: "0.84rem",
                      color: theme.text,
                      lineHeight: "1.65",
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {hoveredAnalysis.analysis.sentiment_analysis}
                  </p>
                )}

                {hoveredAnalysis.user_interests &&
                  hoveredAnalysis.user_interests.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.35rem",
                        paddingTop: "0.4rem",
                        borderTop: `1px solid ${darkMode ? "rgba(148,163,184,0.06)" : "rgba(226,232,240,0.8)"}`,
                      }}
                    >
                      {hoveredAnalysis.user_interests.map((ticker) => (
                        <span
                          key={ticker}
                          style={{
                            padding: "0.22rem 0.55rem",
                            background: darkMode
                              ? "rgba(16,185,129,0.12)"
                              : "rgba(16,185,129,0.08)",
                            color: "#10b981",
                            border: "1px solid rgba(16,185,129,0.2)",
                            borderRadius: "9999px",
                            fontSize: "0.72rem",
                            fontWeight: "700",
                            fontFamily: "'Roboto Mono', monospace",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {ticker}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTickerItem = (item, index, keyPrefix = "") => (
    <span key={`${keyPrefix}${index}`} style={{ display: "inline" }}>
      <span
        className="ticker-item"
        onMouseEnter={(e) => handleItemHoverEnter(item, index, e)}
        onMouseLeave={handleItemHoverLeave}
        style={{
          color: darkMode ? "#e2e8f0" : "#1e293b",
          fontWeight: "600",
          fontSize: "14px",
          lineHeight: "1.4",
          backgroundColor:
            hoveredIndex === index
              ? darkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.06)"
              : "transparent",
          borderRadius: "4px",
          padding: "4px 6px",
        }}
        role="button"
        tabIndex={0}
        title="Hover to view sentiment analysis"
      >
        {item.title}
      </span>
      <span className="ticker-dot">•</span>
    </span>
  );

  return (
    <>
      <style>{styles}</style>

      {/* Full-body-width tooltip */}
      <FloatingTooltip />

      <div
        style={{
          background: "transparent",
          borderRadius: "4px",
          overflow: "hidden",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
          e.currentTarget.style.transform = "translateY(-2px)";
          const container = e.currentTarget.querySelector(".ticker-container");
          if (container) container.style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
          const container = e.currentTarget.querySelector(".ticker-container");
          if (container) container.style.animationPlayState = "running";
          cancelHideTimeout();
          hideTimeoutRef.current = setTimeout(dismissTooltip, 120);
        }}
        role="region"
        aria-label="Market news ticker"
      >
        <div
          className="ticker-container"
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            padding: "16px 20px",
          }}
        >
          {headlines.map((item, index) => renderTickerItem(item, index))}
          {/* Duplicate for seamless loop */}
          {headlines.map((item, index) =>
            renderTickerItem(item, index, "dup-"),
          )}
        </div>
      </div>
    </>
  );
}

export default SentimentNewsHeading;
