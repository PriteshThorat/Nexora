import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Chart, registerables } from "chart.js";
import StockPredictionModal from "./StockPredictionModal";

// Register Chart.js components
Chart.register(...registerables);

// Backend API base URL (Django Alpha Vantage proxy)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Simple cache to reduce API calls (5 min TTL)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key: string): any => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changesPercentage: number;
}

interface ChartPoint {
  date: string;
  close: number;
}

interface RootState {
  theme: {
    darkMode: boolean;
  };
}

interface StockCardProps {
  symbol: string;
}

/**
 * StockCard Component - Displays individual stock information with mini chart
 */
function StockCard({ symbol }: StockCardProps) {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Theme colors
  const theme = {
    cardBg: darkMode ? "#1e293b" : "white",
    text: darkMode ? "#f1f5f9" : "#1f2937",
    textSecondary: darkMode ? "#94a3b8" : "#6b7280",
    border: darkMode ? "rgba(148, 163, 184, 0.1)" : "rgba(226, 232, 240, 0.8)",
    positive: "#10b981",
    negative: "#ef4444",
    chartLine: darkMode ? "#818cf8" : "#6366f1",
  };

  /**
   * Fetch current stock quote via backend /api/v1/market-data (GLOBAL_QUOTE)
   */
  const fetchStockQuote = async () => {
    try {
      // Check cache first
      const cacheKey = `quote_${symbol}`;
      const cachedQuote = getCachedData(cacheKey);
      if (cachedQuote) {
        setStockData(cachedQuote);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const url = `${API_BASE_URL.replace(
        /\/$/,
        "",
      )}/api/v1/market-data/?symbol=${encodeURIComponent(symbol)}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result) {
        const message =
          (result && result.error) || "Failed to fetch stock quote";
        throw new Error(message);
      }

      const data = result.data || {};
      const quote = data["Global Quote"];
      if (quote && Object.keys(quote).length > 0 && quote["01. symbol"]) {
        // Normalize Alpha Vantage response
        const transformedData = {
          symbol: quote["01. symbol"],
          name: quote["01. symbol"],
          price: parseFloat(quote["05. price"]),
          change: parseFloat(quote["09. change"]),
          changesPercentage: parseFloat(
            quote["10. change percent"].replace("%", ""),
          ),
        };
        setStockData(transformedData);
        setCachedData(cacheKey, transformedData);
      } else {
        throw new Error("No valid data received from API");
      }
    } catch (err) {
      console.error(`Error fetching quote for ${symbol}:`, err);
      setError((err as Error).message);
    }
  };

  /**
   * Fetch daily historical data via backend /api/v1/market-data (TIME_SERIES_DAILY)
   * Gets last 7-10 trading days for sparkline
   */
  const fetchChartData = async () => {
    try {
      // Check cache first
      const cacheKey = `chart_${symbol}`;
      const cachedChart = getCachedData(cacheKey);
      if (cachedChart) {
        setChartData(cachedChart);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        // If user is not authenticated, skip chart fetch
        return;
      }

      const url = `${API_BASE_URL.replace(
        /\/$/,
        "",
      )}/api/v1/market-data/?symbol=${encodeURIComponent(
        symbol,
      )}&function=TIME_SERIES_DAILY`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result) {
        console.error("Failed to fetch chart data for", symbol, result);
        return;
      }

      const data = result.data || {};
      const timeSeries = data["Time Series (Daily)"];
      if (timeSeries && Object.keys(timeSeries).length > 0) {
        // Extract last 10 days of closing prices
        const dates = Object.keys(timeSeries).slice(0, 10).reverse();
        const chartPoints = dates.map((date) => ({
          date: date,
          close: parseFloat(timeSeries[date]["4. close"]),
        }));
        setChartData(chartPoints);
        setCachedData(cacheKey, chartPoints);
      }
    } catch (err) {
      console.error(`Error fetching chart data for ${symbol}:`, err);
    }
  };

  /**
   * Initialize and update chart
   */
  useEffect(() => {
    if (!chartData || !chartRef.current) return;

    // Destroy existing chart instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    // Extract price data
    const prices = chartData.map((d: ChartPoint) => d.close);
    const labels = chartData.map((d: ChartPoint) => d.date);

    // Create new chart
    chartInstanceRef.current = new Chart(ctx!, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            data: prices,
            borderColor: theme.chartLine,
            borderWidth: 2,
            fill: false,
            tension: 0.4, // Smooth curve
            pointRadius: 0, // No point markers
            pointHoverRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }, // No legend
          tooltip: { enabled: false }, // No tooltips
        },
        scales: {
          x: { display: false }, // No x-axis
          y: { display: false }, // No y-axis
        },
        interaction: {
          mode: undefined, // Disable interactions
        },
        animation: {
          duration: 0, // Disable animations for performance
        },
      },
    });

    // Cleanup on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData, darkMode]);

  /**
   * Fetch data on mount and set up auto-refresh
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch sequentially to respect rate limits (not in parallel)
      await fetchStockQuote();
      await fetchChartData();
      setLoading(false);
    };

    // Initial fetch
    fetchData();

    // Auto-refresh every 5 minutes (respects Alpha Vantage rate limits)
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [symbol]);

  /**
   * Calculate if price is positive or negative
   */
  const priceChange = stockData?.change || 0;
  const priceChangePercent = stockData?.changesPercentage || 0;
  const isPositive = priceChange >= 0;

  if (loading) {
    return (
      <div
        style={{
          background: theme.cardBg,
          borderRadius: "1rem",
          padding: "1.5rem",
          border: `1px solid ${theme.border}`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          minHeight: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: theme.textSecondary }}>Loading {symbol}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: theme.cardBg,
          borderRadius: "1rem",
          padding: "1.5rem",
          border: `1px solid ${theme.border}`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: theme.text,
            fontSize: "1rem",
            fontWeight: "600",
            marginBottom: "0.5rem",
          }}
        >
          {symbol}
        </p>
        <p style={{ color: theme.negative, fontSize: "0.875rem" }}>
          {error.includes("rate limit")
            ? "⏱️ Rate limit reached"
            : "❌ Error loading data"}
        </p>
        <p
          style={{
            color: theme.textSecondary,
            fontSize: "0.75rem",
            marginTop: "0.5rem",
          }}
        >
          {error.includes("rate limit")
            ? "Please wait a moment..."
            : "Please try again later"}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: theme.cardBg,
        borderRadius: "1rem",
        padding: "1.5rem",
        border: `1px solid ${theme.border}`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
    >
      {/* Header - Symbol and Name */}
      <div style={{ marginBottom: "1rem" }}>
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "700",
            color: theme.text,
            marginBottom: "0.25rem",
            fontFamily: "'Roboto Mono', monospace",
          }}
        >
          {symbol}
        </h3>
        <p style={{ fontSize: "0.875rem", color: theme.textSecondary }}>
          {stockData?.name || ""}
        </p>
      </div>

      {/* Mini Chart */}
      <div
        style={{ height: "80px", marginBottom: "1rem", position: "relative" }}
      >
        <canvas
          ref={chartRef}
          style={{ display: "block", width: "100%", height: "100%" }}
        ></canvas>
      </div>

      {/* Price Information */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "1.75rem",
              fontWeight: "700",
              color: theme.text,
              fontFamily: "'Roboto Mono', monospace",
            }}
          >
            ${stockData?.price?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              color: isPositive ? theme.positive : theme.negative,
              fontFamily: "'Roboto Mono', monospace",
            }}
          >
            {isPositive ? "+" : ""}
            {priceChange.toFixed(2)}
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: "600",
              color: isPositive ? theme.positive : theme.negative,
              fontFamily: "'Roboto Mono', monospace",
            }}
          >
            {isPositive ? "+" : ""}
            {priceChangePercent.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * StockWidget Component - Main container for all stock cards
 */
function StockWidget() {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const theme = {
    text: darkMode ? "#f1f5f9" : "#1f2937",
    textSecondary: darkMode ? "#94a3b8" : "#6b7280",
  };

  // Search state
  const [searchSymbol, setSearchSymbol] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  // Watched stocks state
  const [watchedStocks, setWatchedStocks] = useState<string[]>([]);
  const [loadingTick, setLoadingTick] = useState<string | null>(null);
  // Stock prediction modal state
  const [showPredictionModal, setShowPredictionModal] = useState<boolean>(false);
  const [selectedStockForPrediction, setSelectedStockForPrediction] =
    useState<string | null>(null);
  const [cardRect, setCardRect] = useState<(DOMRect & { readonly toJSON: () => any }) | null>(null);
  // Store all available symbols in frontend
  const ALL_SYMBOLS = [
    "AAPL",
    "META",
    "AMZN",
    "GOOGL",
    "MSFT",
    "TSLA",
    "NFLX",
    "NVDA",
    "INTC",
    "IBM",
    "ADBE",
    "ORCL",
    "PYPL",
    "CRM",
    "CSCO",
    "QCOM",
    "AMD",
    "SHOP",
    "UBER",
    "BIDU",
    "SBUX",
    "ZM",
    "TWTR",
    "SNAP",
    "SQ",
    "PLTR",
    "COIN",
    "ROKU",
    "DOCU",
    "SPOT",
  ];
  const token = localStorage.getItem("token");

  // Fetch watched stocks on mount
  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/v1/get-watched-stocks`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setWatchedStocks(data.watched_stocks || []));
  }, [token]);

  // Notify SentimentNewsHeading when watched stocks change (after render, not during)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    window.dispatchEvent(
      new CustomEvent("watchedStocksChanged", {
        detail: { watchedStocks },
      }),
    );
  }, [watchedStocks]);

  // Tick/untick handlers
  const handleTick = async (symbol: string): Promise<void> => {
    if (!token) {
      console.error("No token found");
      return;
    }
    setLoadingTick(symbol);
    try {
      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/v1/tick-stock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ symbol }),
        },
      );
      if (response.ok) {
        setWatchedStocks((prev: string[]) => [...new Set([...prev, symbol])]);
      } else {
        console.error("Failed to tick stock:", response.statusText);
      }
    } catch (error) {
      console.error("Error ticking stock:", error);
    } finally {
      setLoadingTick(null);
    }
  };

  const handleUntick = async (symbol: string): Promise<void> => {
    if (!token) {
      console.error("No token found");
      return;
    }
    setLoadingTick(symbol);
    try {
      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/v1/untick-stock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ symbol }),
        },
      );
      if (response.ok) {
        setWatchedStocks((prev: string[]) => prev.filter((s: string) => s !== symbol));
      } else {
        console.error("Failed to untick stock:", response.statusText);
      }
    } catch (error) {
      console.error("Error unticking stock:", error);
    } finally {
      setLoadingTick(null);
    }
  };

  // Enhanced StockCard with tick/untick
  function StockCardWithTick({ symbol }: StockCardProps) {
    const isWatched = watchedStocks.includes(symbol);
    const isLoading = loadingTick === symbol;
    const [hoverTimeout, setHoverTimeout] = useState<number | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
      // Show prediction modal after 500ms hover
      const timeout = setTimeout((): void => {
        if (cardRef.current) {
          setSelectedStockForPrediction(symbol);
          setCardRect(cardRef.current.getBoundingClientRect());
          setShowPredictionModal(true);
        }
      }, 500);
      setHoverTimeout(timeout);
    };

    const handleMouseLeave = () => {
      // Clear timeout if user leaves before 500ms
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
    };

    return (
      <div
        ref={cardRef}
        style={{ position: "relative" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <StockCard symbol={symbol} />
        <button
          onClick={() =>
            isWatched ? handleUntick(symbol) : handleTick(symbol)
          }
          disabled={isLoading}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: isWatched ? "#10b981" : "#e5e7eb",
            color: isWatched ? "white" : "#1f2937",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            fontSize: "1.25rem",
            cursor: isLoading ? "wait" : "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            transition: "background 0.2s",
            opacity: isLoading ? 0.7 : 1,
          }}
          title={isWatched ? "Remove from dashboard" : "Add to dashboard"}
        >
          {isLoading ? "..." : isWatched ? "✓" : "✗"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "2rem" }}>
      {/* Section Header */}
      <div style={{ marginBottom: "1.5rem" }}></div>

      {/* Search Input with Dropdown */}
      <div style={{ marginBottom: "1.5rem", position: "relative" }}>
        <input
          type="text"
          placeholder="Search stock symbol (e.g. AAPL)"
          value={searchSymbol}
          onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            border: `1px solid ${theme.textSecondary}`,
            fontSize: "1rem",
            width: "100%",
            maxWidth: "400px",
            fontFamily: "'Roboto Mono', monospace",
            color: theme.text,
            background: darkMode ? "#1e293b" : "white",
          }}
        />

        {/* Dropdown Suggestions */}
        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              maxWidth: "400px",
              background: darkMode ? "#0f172a" : "white",
              border: `1px solid ${theme.textSecondary}`,
              borderRadius: "0.5rem",
              marginTop: "0.25rem",
              maxHeight: "300px",
              overflowY: "auto",
              zIndex: 1000,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {ALL_SYMBOLS.filter(
              (s) =>
                !watchedStocks.includes(s) &&
                (s.toUpperCase().includes(searchSymbol.toUpperCase()) ||
                  searchSymbol === ""),
            ).map((symbol) => (
              <div
                key={symbol}
                onClick={() => {
                  handleTick(symbol);
                  setSearchSymbol("");
                  setShowDropdown(false);
                }}
                style={{
                  padding: "0.75rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  cursor: "pointer",
                  borderBottom: `1px solid ${theme.textSecondary}20`,
                  transition: "background 0.2s",
                  background:
                    searchSymbol === symbol
                      ? darkMode
                        ? "#1e293b"
                        : "#f3f4f6"
                      : "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = darkMode
                    ? "#1e293b"
                    : "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    searchSymbol === symbol
                      ? darkMode
                        ? "#1e293b"
                        : "#f3f4f6"
                      : "transparent")
                }
              >
                <input
                  type="checkbox"
                  checked={watchedStocks.includes(symbol)}
                  onChange={() => {
                    handleTick(symbol);
                    setSearchSymbol("");
                    setShowDropdown(false);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  disabled={loadingTick === symbol}
                  style={{
                    cursor: loadingTick === symbol ? "wait" : "pointer",
                    width: "18px",
                    height: "18px",
                    opacity: loadingTick === symbol ? 0.7 : 1,
                  }}
                />
                <span
                  style={{
                    color: theme.text,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                >
                  {symbol}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stock Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Show watched stocks only */}
        {watchedStocks.length > 0 ? (
          watchedStocks.map((symbol) => (
            <StockCardWithTick key={symbol} symbol={symbol} />
          ))
        ) : (
          <p style={{ color: theme.textSecondary, gridColumn: "1 / -1" }}>
            No stocks in your dashboard. Search and add stocks to get started!
          </p>
        )}
      </div>

      {/* Stock Prediction Modal */}
      <StockPredictionModal
        ticker={selectedStockForPrediction || ""}
        isOpen={showPredictionModal}
        cardRect={cardRect as any}
        onClose={() => {
          setShowPredictionModal(false);
          setSelectedStockForPrediction(null);
          setCardRect(null);
        }}
      />
    </div>
  );
}

export default StockWidget;
