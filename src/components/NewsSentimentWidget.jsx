import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCachedSentimentAnalysis,
  setCachedNewsSentiment,
} from "../store/aiAnalysisSlice";
import { useInFlightRequests } from "../hooks/useInFlightRequests";
import { useFormatAIResponse } from "../hooks/useFormatAIResponse";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const DEFAULT_STOCKS = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN"];

function NewsSentimentWidget() {
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
  const { formatPrediction } = useFormatAIResponse();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchedStocks, setWatchedStocks] = useState([]);

  // Hover tooltip state
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [hoveredAnalysis, setHoveredAnalysis] = useState(null);
  const [loadingHover, setLoadingHover] = useState(false);
  const [hoverError, setHoverError] = useState(null);

  // Bounding rect of the hovered card (for fixed-position tooltip)
  const [cardRect, setCardRect] = useState(null);

  // Track active hover index to cancel stale async results
  const activeHoverRef = useRef(null);
  // Delayed hide so user can move mouse into the tooltip
  const hideTimeoutRef = useRef(null);

  const theme = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    cardBg: darkMode ? "#1e293b" : "white",
    text: darkMode ? "#f1f5f9" : "#1f2937",
    textSecondary: darkMode ? "#94a3b8" : "#6b7280",
    border: darkMode ? "rgba(148, 163, 184, 0.1)" : "rgba(226, 232, 240, 0.8)",
    positive: "#10b981",
    negative: "#ef4444",
    neutral: "#6366f1",
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
          { headers: { Authorization: `Token ${token}` } },
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
    return () =>
      window.removeEventListener(
        "watchedStocksChanged",
        handleWatchedStocksChanged,
      );
  }, []);

  // Fetch news for watched stocks or default stocks
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          return;
        }

        const stocksToFetch =
          watchedStocks.length > 0 ? watchedStocks.slice(0, 5) : DEFAULT_STOCKS;

        // Create a small delay to allow cache population from other components
        await new Promise((resolve) => setTimeout(resolve, 50));

        const newsPromises = stocksToFetch.map((ticker) => {
          // Check if news is cached for this ticker
          const cached = (newsSentimentCache || {})[ticker];
          if (cached && Date.now() - cached.timestamp < cacheExpiry) {
            console.log(`✓ Using cached news for ${ticker}`);
            return Promise.resolve(cached.data);
          }

          // Fetch if not cached
          return makeCachedRequest(`news-${ticker}`, async () => {
            const res = await fetch(
              `${API_BASE_URL.replace(/\/$/, "")}/api/news-sentiment/?ticker=${encodeURIComponent(ticker)}&output_format=full`,
              {
                headers: {
                  Authorization: `Token ${token}`,
                },
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
        console.log("📰 Raw API results:", results);
        const allNews = [];
        const seenTitles = new Set();

        results.forEach((result) => {
          if (result && result.data && result.data.feed) {
            console.log(`📰 Found ${result.data.feed.length} articles`);
            result.data.feed.forEach((article) => {
              if (!seenTitles.has(article.title)) {
                seenTitles.add(article.title);
                allNews.push({
                  title: article.title,
                  summary: article.summary || article.description || "",
                  url: article.url,
                  image_url: article.banner_image || article.image_url,
                  published_at: article.time_published,
                  ticker: article.ticker || article.symbol,
                  sentiment:
                    article.overall_sentiment_label?.toLowerCase() || "neutral",
                  sentiment_score:
                    parseFloat(article.overall_sentiment_score) || 0,
                });
              }
            });
          }
        });

        allNews.sort(
          (a, b) => new Date(b.published_at) - new Date(a.published_at),
        );
        console.log(`📰 Final news count: ${allNews.length}`);
        setNews(allNews.slice(0, 6));
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news");
      } finally {
        setLoading(false);
      }
    };

    if (watchedStocks !== undefined) {
      fetchNews();
    }
  }, [watchedStocks]);

  const cancelHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const hashHeadline = (text) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  };

  const handleHoverEnter = async (article, idx, e) => {
    cancelHideTimeout();
    activeHoverRef.current = idx;
    setHoveredIdx(idx);
    setCardRect(e.currentTarget.getBoundingClientRect());
    setHoverError(null);

    // Return cached result immediately (from Redux persistent cache)
    const headlineHash = hashHeadline(article.title);
    const cached = sentimentAnalysisCache[headlineHash];

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
              body: JSON.stringify({ news_text: article.title }),
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

      // Guard: discard result if hover has already moved to a different card
      if (activeHoverRef.current !== idx) return;

      setHoveredAnalysis(data);
    } catch (e) {
      if (activeHoverRef.current === idx) {
        if (e.message.includes("quota") || e.message.includes("429")) {
          setHoverError("Daily limit reached. Try again later.");
        } else {
          const msg = e.message || "Error";
          setHoverError(msg.length > 60 ? msg.substring(0, 57) + "..." : msg);
        }
      }
    } finally {
      if (activeHoverRef.current === idx) setLoadingHover(false);
    }
  };

  const dismissTooltip = () => {
    activeHoverRef.current = null;
    setHoveredIdx(null);
    setCardRect(null);
    setHoveredAnalysis(null);
    setHoverError(null);
    setLoadingHover(false);
  };

  const handleHoverLeave = () => {
    cancelHideTimeout();
    hideTimeoutRef.current = setTimeout(dismissTooltip, 120);
  };

  const handleTooltipEnter = () => {
    cancelHideTimeout();
  };

  const handleTooltipLeave = () => {
    cancelHideTimeout();
    hideTimeoutRef.current = setTimeout(dismissTooltip, 120);
  };

  const getSentimentColor = (sentiment) => {
    if (!sentiment) return theme.neutral;
    if (["bullish", "positive", "somewhat-bullish"].includes(sentiment))
      return theme.positive;
    if (["bearish", "negative", "somewhat-bearish"].includes(sentiment))
      return theme.negative;
    return theme.neutral;
  };

  const getSentimentLabel = (s) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ") : "Neutral";

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(
      dateString.replace(
        /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/,
        "$1-$2-$3T$4:$5:$6",
      ),
    );
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Full-body-width floating tooltip rendered via position:fixed
  const FloatingTooltip = ({ idx, article }) => {
    if (hoveredIdx !== idx || !cardRect) return null;
    const sentColor = getSentimentColor(article.sentiment);
    const bg = darkMode ? "rgba(10,14,26,0.97)" : "rgba(255,255,255,0.97)";
    const borderColor = darkMode
      ? "rgba(99,102,241,0.32)"
      : "rgba(99,102,241,0.22)";
    const shadow = darkMode
      ? "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.12)"
      : "0 20px 60px rgba(99,102,241,0.18), 0 0 0 1px rgba(99,102,241,0.08)";

    const sidebarWidth = window.innerWidth > 768 ? 240 : 0;
    const pad = 16; // horizontal page padding
    const leftOffset = sidebarWidth + pad;
    // tail points at the hovered card, positioned relative to the tooltip's left edge
    const tailLeftPx = Math.max(22, cardRect.left - leftOffset + 22);

    return (
      <>
        <style>{`
          @keyframes nsw-bubble-in {
            from { opacity: 0; transform: translateY(6px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes nsw-spin {
            to { transform: rotate(360deg); }
          }
          .nsw-tooltip-body::-webkit-scrollbar {
            width: 12px;
          }
          .nsw-tooltip-body::-webkit-scrollbar-track {
            background: transparent;
          }
          .nsw-tooltip-body::-webkit-scrollbar-thumb {
            background: rgb(102, 126, 234);
            border-radius: 6px;
          }
          .nsw-tooltip-body::-webkit-scrollbar-thumb:hover {
            background: rgb(92, 116, 224);
          }
        `}</style>

        {/* Fixed overlay spanning content area (excluding sidebar) */}
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
            animation: "nsw-bubble-in 0.22s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {/* Speech-bubble body — full width */}
          <div
            className="nsw-tooltip-body"
            style={{
              background: bg,
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: `1px solid ${borderColor}`,
              borderRadius: "14px",
              overflowY: "scroll",
              overflowX: "hidden",
              maxHeight: "400px",
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
                AI Sentiment
              </span>
              <span
                style={{
                  background: `${sentColor}1a`,
                  color: sentColor,
                  border: `1px solid ${sentColor}44`,
                  padding: "0.15rem 0.55rem",
                  borderRadius: "9999px",
                  fontSize: "0.65rem",
                  fontWeight: "700",
                  textTransform: "capitalize",
                  letterSpacing: "0.03em",
                }}
              >
                {getSentimentLabel(article.sentiment)}
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: "0.65rem",
                  color: theme.textSecondary,
                }}
              >
                {formatDate(article.published_at)}
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: "0.85rem 1.1rem" }}>
              {/* Article title as context */}
              <p
                style={{
                  fontSize: "0.78rem",
                  color: theme.textSecondary,
                  fontStyle: "italic",
                  lineHeight: "1.5",
                  margin: "0 0 0.7rem 0",
                }}
              >
                {article.title}
              </p>

              {/* Loading spinner */}
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
                      animation: "nsw-spin 0.7s linear infinite",
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
                    lineHeight: "1.3",
                  }}
                >
                  {hoverError.includes("quota") || hoverError.includes("429")
                    ? "Daily limit reached. Try again later."
                    : hoverError.length > 60
                      ? hoverError.substring(0, 57) + "..."
                      : hoverError}
                </div>
              )}

              {/* Analysis result */}
              {hoveredAnalysis && !loadingHover && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}
                >
                  {hoveredAnalysis.analysis?.sentiment_analysis && (
                    <div
                      style={{
                        fontSize: "0.84rem",
                        color: theme.text,
                        lineHeight: "1.65",
                        margin: 0,
                      }}
                    >
                      {formatPrediction(
                        hoveredAnalysis.analysis.sentiment_analysis,
                      )}
                    </div>
                  )}

                  {/* Tracked stocks */}
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
      </>
    );
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}></div>

      {loading && (
        <div
          style={{
            background: theme.cardBg,
            borderRadius: "1rem",
            padding: "2rem",
            textAlign: "center",
            color: theme.textSecondary,
            border: `1px solid ${theme.border}`,
          }}
        >
          Loading news…
        </div>
      )}

      {error && !loading && (
        <div
          style={{
            background: theme.cardBg,
            borderRadius: "1rem",
            padding: "1.5rem",
            color: theme.negative,
            border: `1px solid ${theme.border}`,
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && news.length === 0 && (
        <div
          style={{
            background: theme.cardBg,
            borderRadius: "1rem",
            padding: "2rem",
            textAlign: "center",
            color: theme.textSecondary,
            border: `1px solid ${theme.border}`,
          }}
        >
          No news available
        </div>
      )}

      {!loading && !error && news.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
            gap: "1.25rem",
            alignItems: "start",
          }}
        >
          {news.map((article, index) => {
            const isHovered = hoveredIdx === index;
            const sentColor = getSentimentColor(article.sentiment);

            return (
              <div
                key={index}
                style={{
                  position: "relative",
                  // Raise z-index so tooltip floats above adjacent cards
                  zIndex: isHovered ? 50 : 1,
                }}
                onMouseEnter={(e) => handleHoverEnter(article, index, e)}
                onMouseLeave={handleHoverLeave}
              >
                {/* Floating speech-bubble tooltip */}
                <FloatingTooltip idx={index} article={article} />

                {/* News card */}
                <div
                  style={{
                    background: theme.cardBg,
                    borderRadius: "1rem",
                    overflow: "hidden",
                    border: `1px solid ${isHovered ? theme.accent : theme.border}`,
                    display: "flex",
                    flexDirection: "column",
                    cursor: "default",
                    transition: "all 0.2s ease",
                    boxShadow: isHovered
                      ? `0 0 0 2px ${theme.accent}30, 0 10px 36px rgba(99,102,241,0.18)`
                      : "0 2px 8px rgba(0,0,0,0.05)",
                    transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                    position: "relative",
                  }}
                >
                  {/* Card content */}
                  <div
                    style={{
                      padding: "1.1rem",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {/* Badges row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          background: `${theme.neutral}22`,
                          color: theme.accent,
                          border: `1px solid ${theme.accent}44`,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "9999px",
                          fontSize: "0.7rem",
                          fontWeight: "700",
                          fontFamily: "'Roboto Mono', monospace",
                          letterSpacing: "0.04em",
                        }}
                      >
                        ${article.ticker}
                      </span>
                      <span
                        style={{
                          background: `${sentColor}1a`,
                          color: sentColor,
                          border: `1px solid ${sentColor}44`,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "9999px",
                          fontSize: "0.7rem",
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        {getSentimentLabel(article.sentiment)}
                      </span>
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: "0.65rem",
                          color: theme.textSecondary,
                        }}
                      >
                        {formatDate(article.published_at)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: "600",
                        color: theme.text,
                        lineHeight: "1.45",
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {article.title}
                    </h3>

                    {/* Summary */}
                    {article.summary && (
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: theme.textSecondary,
                          lineHeight: "1.5",
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {article.summary}
                      </p>
                    )}

                    {/* Footer */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "auto",
                        paddingTop: "0.55rem",
                        borderTop: `1px solid ${darkMode ? "rgba(148,163,184,0.06)" : "rgba(226,232,240,0.8)"}`,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.68rem",
                          color: isHovered ? theme.accent : theme.textSecondary,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          transition: "color 0.2s",
                          fontStyle: "italic",
                        }}
                      >
                        {isHovered ? "✦ Analyzing…" : "✦ Hover for AI insights"}
                      </span>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          fontSize: "0.72rem",
                          color: theme.accent,
                          fontWeight: "600",
                          textDecoration: "none",
                          padding: "0.28rem 0.65rem",
                          borderRadius: "7px",
                          border: `1px solid ${theme.accent}33`,
                          background: isHovered
                            ? `${theme.accent}12`
                            : "transparent",
                          transition: "all 0.18s",
                          pointerEvents: "auto",
                        }}
                      >
                        Read
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M7 1h4v4M11 1L5 7M3 3H1v8h8V9" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Bottom accent bar on hover */}
                  {isHovered && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: `linear-gradient(90deg, ${theme.accent}, ${theme.positive})`,
                        borderRadius: "0 0 1rem 1rem",
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default NewsSentimentWidget;
