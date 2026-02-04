import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

// Alpha Vantage API Configuration - Multiple keys for rotation
// Add your keys to .env as: VITE_ALPHA_VANTAGE_KEY_1, VITE_ALPHA_VANTAGE_KEY_2, etc.
const API_KEYS = [
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_1,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_2,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_3,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_4,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_5,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_6,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_7,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_8,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_9,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_10,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_11,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_12,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_13,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_14,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_15,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_16,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_17,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_18,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_19,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_20,
].filter(Boolean); // Remove undefined keys

const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";

// API Key rotation management
let currentKeyIndex = 0;
const failedKeys = new Set(); // Track keys that hit rate limits

const getNextApiKey = () => {
  if (API_KEYS.length === 0) {
    console.error("No Alpha Vantage API keys configured");
    return null;
  }

  // Try to find a working key
  const startIndex = currentKeyIndex;
  do {
    const key = API_KEYS[currentKeyIndex];
    if (!failedKeys.has(currentKeyIndex)) {
      return { key, index: currentKeyIndex };
    }
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  } while (currentKeyIndex !== startIndex);

  // All keys failed, reset and try again
  console.warn("All API keys exhausted, resetting...");
  failedKeys.clear();
  return { key: API_KEYS[currentKeyIndex], index: currentKeyIndex };
};

const markKeyAsFailed = (keyIndex) => {
  failedKeys.add(keyIndex);
  console.log(
    `Key ${keyIndex + 1} marked as rate limited. ${failedKeys.size}/${API_KEYS.length} keys exhausted.`,
  );
  // Move to next key
  currentKeyIndex = (keyIndex + 1) % API_KEYS.length;
};

// Reset failed keys after 5 minutes (when rate limits typically reset)
setInterval(
  () => {
    if (failedKeys.size > 0) {
      console.log("Resetting rate-limited API keys...");
      failedKeys.clear();
    }
  },
  5 * 60 * 1000,
);

// Stock symbols to track
const STOCK_SYMBOLS = ["AAPL", "META", "AMZN"];

// Rate limiting: Alpha Vantage free tier allows 1 req/second
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1200; // 1.2 seconds between requests

const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }
  lastRequestTime = Date.now();
};

// Simple cache to reduce API calls (5 min TTL)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

/**
 * StockCard Component - Displays individual stock information with mini chart
 */
function StockCard({ symbol }) {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [stockData, setStockData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

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
   * Fetch current stock quote using Alpha Vantage GLOBAL_QUOTE with automatic key rotation
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

      // Get next available API key
      const apiKeyData = getNextApiKey();
      if (!apiKeyData) {
        throw new Error("No Alpha Vantage API keys configured");
      }

      // Wait for rate limit
      await waitForRateLimit();

      const url = `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKeyData.key}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Failed to fetch stock quote");

      const data = await response.json();

      // Check for rate limit or API limit messages
      if (data["Note"] || data["Information"]) {
        const message = data["Note"] || data["Information"];
        console.warn(
          `Alpha Vantage rate limit for ${symbol} (Key ${apiKeyData.index + 1}):`,
          message,
        );

        // Mark this key as failed and try with next key
        markKeyAsFailed(apiKeyData.index);

        // Retry with next key
        return await fetchStockQuote();
      }

      // Check for error message
      if (data["Error Message"]) {
        throw new Error(data["Error Message"]);
      }

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
      setError(err.message);
    }
  };

  /**
   * Fetch daily historical data using Alpha Vantage TIME_SERIES_DAILY with automatic key rotation
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

      // Get next available API key
      const apiKeyData = getNextApiKey();
      if (!apiKeyData) {
        console.warn("No Alpha Vantage API keys configured");
        return;
      }

      // Wait for rate limit
      await waitForRateLimit();

      const url = `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${apiKeyData.key}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Failed to fetch chart data");

      const data = await response.json();

      // Check for rate limit or API limit messages
      if (data["Note"] || data["Information"]) {
        console.warn(
          `Alpha Vantage rate limit for chart ${symbol} (Key ${apiKeyData.index + 1})`,
        );

        // Mark this key as failed and try with next key
        markKeyAsFailed(apiKeyData.index);

        // Retry with next key
        return await fetchChartData();
      }

      // Check for error message
      if (data["Error Message"]) {
        console.error(`Chart data error for ${symbol}:`, data["Error Message"]);
        return;
      }

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
    const prices = chartData.map((d) => d.close);
    const labels = chartData.map((d) => d.date);

    // Create new chart
    chartInstanceRef.current = new Chart(ctx, {
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
          mode: null, // Disable interactions
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
      <div style={{ height: "80px", marginBottom: "1rem" }}>
        <canvas ref={chartRef}></canvas>
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
  const darkMode = useSelector((state) => state.theme.darkMode);

  const theme = {
    text: darkMode ? "#f1f5f9" : "#1f2937",
    textSecondary: darkMode ? "#94a3b8" : "#6b7280",
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      {/* Section Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: theme.text,
            marginBottom: "0.5rem",
            fontFamily: "'Roboto Mono', monospace",
          }}
        >
          📈 Market Watch
        </h2>
        <p style={{ fontSize: "0.875rem", color: theme.textSecondary }}>
          Real-time stock prices • Auto-refreshes every 5 minutes
        </p>
      </div>

      {/* Stock Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {STOCK_SYMBOLS.map((symbol) => (
          <StockCard key={symbol} symbol={symbol} />
        ))}
      </div>
    </div>
  );
}

export default StockWidget;
