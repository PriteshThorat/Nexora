import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

// EODHD API Configuration
const EODHD_API_KEY = import.meta.env.VITE_EODHD_API_KEY;
const EODHD_BASE_URL = "https://eodhd.com/api";

// Stock symbols to track
const STOCK_SYMBOLS = ["AAPL", "META", "AMZN"];

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
   * Fetch current stock quote
   */
  const fetchStockQuote = async () => {
    try {
      const response = await fetch(
        `${EODHD_BASE_URL}/real-time/${symbol}.US?api_token=${EODHD_API_KEY}&fmt=json`,
      );

      if (!response.ok) throw new Error("Failed to fetch stock quote");

      const data = await response.json();

      if (data && data.code) {
        // Transform EODHD response to match our expected format
        const transformedData = {
          symbol: data.code,
          name: data.code, // EODHD doesn't return company name in this endpoint
          price: data.close,
          change: data.change,
          changesPercentage: data.change_p,
        };
        setStockData(transformedData);
      } else {
        throw new Error("No data received");
      }
    } catch (err) {
      console.error(`Error fetching quote for ${symbol}:`, err);
      setError(err.message);
    }
  };

  /**
   * Fetch intraday chart data (last 30 data points)
   */
  const fetchChartData = async () => {
    try {
      // Get intraday data with 5-minute intervals
      const response = await fetch(
        `${EODHD_BASE_URL}/intraday/${symbol}.US?api_token=${EODHD_API_KEY}&interval=5m&fmt=json`,
      );

      if (!response.ok) throw new Error("Failed to fetch chart data");

      const data = await response.json();

      if (data && data.length > 0) {
        // Get last 30 data points and transform to expected format
        const last30 = data.slice(-30).map((item) => ({
          date: item.datetime,
          close: item.close,
        }));
        setChartData(last30);
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
      await Promise.all([fetchStockQuote(), fetchChartData()]);
      setLoading(false);
    };

    // Initial fetch
    fetchData();

    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);

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
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: theme.negative, fontSize: "0.875rem" }}>
          Error loading {symbol}
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
          Real-time stock prices • Auto-refreshes every 60 seconds
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
