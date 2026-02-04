import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import StockWidget from "../components/StockWidget";

function DashboardPage() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  const [financialAdvice, setFinancialAdvice] = useState(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [adviceError, setAdviceError] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profileComplete");
    navigate("/login");
  };

  // Helper function to format text with markdown-style formatting
  const formatTextContent = (text) => {
    if (!text) return text;

    // Remove all backslashes (they're used for escaping in the source text)
    let cleanText = text
      .replace(/\\/g, "") // Remove ALL backslashes
      .replace(/^\*\*\s*/g, "")
      .replace(/\s*\*\*$/g, "");

    // Split by **bold** markers (match pairs properly)
    const parts = cleanText.split(/(\*\*[^*]+\*\*)/);

    return parts.map((part, i) => {
      // Handle bold text between **
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong key={i} style={{ fontWeight: "700", color: theme.text }}>
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Remove any unpaired ** markers
      let cleanedPart = part.replace(/\*\*/g, "");

      // Handle italic text between single * (only if no **)
      if (cleanedPart.includes("*")) {
        const italicParts = cleanedPart.split(/(\*[^*]+\*)/);
        return italicParts.map((iPart, j) => {
          if (
            iPart.startsWith("*") &&
            iPart.endsWith("*") &&
            iPart.length > 2
          ) {
            return (
              <em
                key={`${i}-${j}`}
                style={{ fontStyle: "italic", color: theme.textSecondary }}
              >
                {iPart.slice(1, -1)}
              </em>
            );
          }
          // Remove any remaining single * markers
          return iPart.replace(/\*/g, "");
        });
      }

      return cleanedPart;
    });
  };

  // Helper function to format the advice text with proper styling
  const formatAdviceText = (text) => {
    if (!text) return null;

    const lines = text.split("\n");
    const elements = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Skip empty lines
      if (trimmedLine === "") {
        return;
      }

      // Handle ### headers (main sections like "### 1. Savings Recommendation")
      if (trimmedLine.startsWith("###")) {
        const headerText = trimmedLine.replace(/^###\s*/, "");
        elements.push(
          <h2
            key={index}
            style={{
              fontSize: fontSize.xl,
              fontWeight: "700",
              color: theme.accent,
              marginTop: spacing.xl,
              marginBottom: spacing.md,
              borderLeft: `4px solid ${theme.accent}`,
              paddingLeft: spacing.md,
              background: `${theme.accent}15`,
              paddingTop: spacing.sm,
              paddingBottom: spacing.sm,
              borderRadius: "0.25rem",
            }}
          >
            {headerText}
          </h2>,
        );
        return;
      }

      // Handle bullet points (lines starting with • or *)
      if (trimmedLine.startsWith("•") || trimmedLine.startsWith("*")) {
        const bulletText = trimmedLine.replace(/^[•*]\s*/, "");

        // Check if this bullet has a colon (subsection header)
        if (bulletText.includes(":") && bulletText.indexOf(":") < 80) {
          const colonIndex = bulletText.indexOf(":");
          const beforeColon = bulletText.substring(0, colonIndex);

          // If short text before colon, it's likely a subsection header
          if (beforeColon.split(" ").length < 8) {
            // Clean ALL * markers from the label (both ** and single *)
            const cleanLabel = beforeColon
              .replace(/\*/g, "")
              .replace(/\\/g, "");
            const afterColon = bulletText.substring(colonIndex + 1);

            // Check if afterColon starts with * (like ":**")
            const cleanAfterColon = afterColon.replace(/^\*+\s*/, " ");

            elements.push(
              <h4
                key={index}
                style={{
                  fontSize: fontSize.md,
                  fontWeight: "700",
                  color: theme.text,
                  marginTop: spacing.md,
                  marginBottom: spacing.sm,
                  marginLeft: spacing.md,
                  paddingLeft: spacing.sm,
                  borderLeft: `3px solid ${theme.accent}`,
                }}
              >
                • <strong>{cleanLabel}:</strong>
                {formatTextContent(cleanAfterColon)}
              </h4>,
            );
            return;
          }
        }

        // Regular bullet point
        elements.push(
          <div
            key={index}
            style={{
              marginLeft: spacing.lg,
              marginBottom: spacing.xs,
              paddingLeft: spacing.md,
            }}
          >
            <p
              style={{
                color: theme.text,
                lineHeight: "1.7",
              }}
            >
              • {formatTextContent(bulletText)}
            </p>
          </div>,
        );
        return;
      }

      // Handle numbered list items in final section (e.g., "1. **Define Your Goal:**")
      if (/^\d+\.\s+\*\*/.test(trimmedLine)) {
        elements.push(
          <div
            key={index}
            style={{
              marginLeft: spacing.md,
              marginTop: spacing.md,
              marginBottom: spacing.sm,
            }}
          >
            <p
              style={{
                color: theme.text,
                lineHeight: "1.8",
                fontWeight: "600",
              }}
            >
              {formatTextContent(trimmedLine)}
            </p>
          </div>,
        );
        return;
      }

      // Handle lines with colons (e.g., "Recommendation: Text" or "Purpose: Text")
      if (
        trimmedLine.includes(":") &&
        !trimmedLine.startsWith("•") &&
        trimmedLine.indexOf(":") < 80
      ) {
        const colonIndex = trimmedLine.indexOf(":");
        const beforeColon = trimmedLine.substring(0, colonIndex);

        // If it's a short label followed by colon, format as a labeled item
        if (beforeColon.split(" ").length <= 5) {
          // Check if the label contains ** markers
          const cleanLabel = beforeColon.replace(/\*\*/g, "");
          const afterColon = trimmedLine.substring(colonIndex + 1);

          elements.push(
            <div
              key={index}
              style={{
                marginLeft: spacing.lg,
                marginBottom: spacing.sm,
              }}
            >
              <p
                style={{
                  color: theme.text,
                  lineHeight: "1.7",
                }}
              >
                <strong style={{ fontWeight: "700" }}>{cleanLabel}:</strong>
                {formatTextContent(afterColon)}
              </p>
            </div>,
          );
          return;
        }
      }

      // Handle regular paragraphs
      elements.push(
        <p
          key={index}
          style={{
            marginBottom: spacing.sm,
            marginLeft: spacing.md,
            color: theme.text,
            lineHeight: "1.7",
          }}
        >
          {formatTextContent(trimmedLine)}
        </p>,
      );
    });

    return elements;
  };

  const handleGetFinancialAdvice = async () => {
    setLoadingAdvice(true);
    setAdviceError("");
    setShowAdviceModal(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setAdviceError("Authentication required. Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/agents/financial_advisor/",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setFinancialAdvice(data);
      } else {
        const errorData = await response.json();
        setAdviceError(
          errorData.message ||
            "Failed to get financial advice. Please ensure your financial profile is complete.",
        );
      }
    } catch (err) {
      setAdviceError("Network error. Please try again.");
    } finally {
      setLoadingAdvice(false);
    }
  };

  // Design system - consistent with HomePage
  const spacing = {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
    xxl: "4rem",
  };

  const fontSize = {
    xs: "0.875rem",
    sm: "1rem",
    md: "1.125rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  };

  // Theme colors
  const theme = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    bgGradient: darkMode
      ? "linear-gradient(to bottom, #0f172a 0%, #1e293b 100%)"
      : "linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%)",
    navBg: darkMode ? "#1e293b" : "white",
    text: darkMode ? "#f1f5f9" : "#1f2937",
    textSecondary: darkMode ? "#94a3b8" : "#6b7280",
    cardBg: darkMode ? "#1e293b" : "white",
    cardBgAlt: darkMode ? "#334155" : "#f1f5f9",
    sectionBg: darkMode ? "#1e293b" : "#f9fafb",
    accent: darkMode ? "#818cf8" : "#6366f1",
    accentHover: darkMode ? "#a5b4fc" : "#4f46e5",
    success: darkMode ? "#34d399" : "#10b981",
    warning: darkMode ? "#fbbf24" : "#f59e0b",
    danger: darkMode ? "#f87171" : "#ef4444",
    shadow: darkMode
      ? "0 4px 12px rgba(0,0,0,0.3)"
      : "0 4px 12px rgba(0,0,0,0.08)",
    shadowHover: darkMode
      ? "0 8px 24px rgba(0,0,0,0.4)"
      : "0 8px 24px rgba(0,0,0,0.12)",
    border: darkMode ? "rgba(148, 163, 184, 0.1)" : "rgba(226, 232, 240, 0.8)",
  };

  // Mock data for demonstration
  const stats = {
    activeRequests: 120,
    activeValue: "$22.5M",
    newRequests: 8,
    newValue: "$5.5M",
    totalSent: 112,
    sentValue: "$17.5M",
  };

  const quickActions = [
    {
      title: "Financial Advisor",
      description: "Get personalized financial advice",
      icon: "�",
      onClick: handleGetFinancialAdvice,
      color: "#f59e0b",
    },
    {
      title: "AI Financial Advisor",
      description: "Chat with AI advisor",
      icon: "💬",
      path: "/chatbot",
      color: theme.accent,
    },
    {
      title: "Stock Predictions",
      description: "View AI-powered stock forecasts",
      icon: "📈",
      path: "/features",
      color: theme.success,
    },
    {
      title: "Credit Risk Analysis",
      description: "Assess your creditworthiness",
      icon: "🎯",
      path: "/features",
      color: theme.warning,
    },
    {
      title: "Fraud Detection",
      description: "Monitor suspicious activities",
      icon: "🛡️",
      path: "/features",
      color: theme.danger,
    },
    {
      title: "Sentiment Analysis",
      description: "Market sentiment insights",
      icon: "📊",
      path: "/features",
      color: "#8b5cf6",
    },
    {
      title: "Portfolio Manager",
      description: "Manage your investments",
      icon: "💼",
      path: "/features",
      color: "#ec4899",
    },
  ];

  const recentActivities = [
    {
      action: "Stock prediction requested",
      time: "2 hours ago",
      status: "completed",
    },
    {
      action: "Credit risk assessment",
      time: "5 hours ago",
      status: "completed",
    },
    { action: "AI chatbot session", time: "1 day ago", status: "completed" },
    { action: "Portfolio analysis", time: "2 days ago", status: "pending" },
  ];

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: "100vh",
          background: theme.bgGradient,
          padding: isMobile ? spacing.sm : spacing.lg,
          paddingTop: "5rem",
          fontFamily: "'Roboto Mono', monospace",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {/* Welcome Section */}
          <div
            style={{
              background: theme.cardBg,
              borderRadius: "1rem",
              padding: isMobile ? spacing.md : spacing.lg,
              boxShadow: theme.shadow,
              marginBottom: spacing.lg,
              border: `1px solid ${theme.border}`,
            }}
          >
            <h1
              style={{
                fontSize: isMobile ? fontSize.xl : "2.5rem",
                fontWeight: "bold",
                color: theme.text,
                marginBottom: spacing.xs,
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              Welcome back, {localStorage.getItem("username") || "User"}!
            </h1>
            <p style={{ color: theme.textSecondary, fontSize: fontSize.md }}>
              Your Financial Statistics
            </p>
          </div>

          {/* Stats Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(280px, 1fr))",
              gap: spacing.md,
              marginBottom: spacing.lg,
            }}
          >
            <div
              style={{
                background: theme.cardBg,
                borderRadius: "1rem",
                padding: spacing.lg,
                boxShadow: theme.shadow,
                border: `1px solid ${theme.border}`,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = theme.shadowHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = theme.shadow;
              }}
            >
              <div style={{ marginBottom: spacing.sm }}>
                <p
                  style={{ color: theme.textSecondary, fontSize: fontSize.sm }}
                >
                  Active Requests
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: spacing.xs,
                }}
              >
                <h2
                  style={{
                    fontSize: fontSize.xxl,
                    fontWeight: "bold",
                    color: theme.text,
                    fontFamily: "'Roboto Mono', monospace",
                  }}
                >
                  {stats.activeRequests}
                </h2>
                <span
                  style={{ fontSize: fontSize.md, color: theme.textSecondary }}
                >
                  req.
                </span>
              </div>
              <p
                style={{
                  color: theme.success,
                  fontSize: fontSize.md,
                  marginTop: spacing.xs,
                }}
              >
                {stats.activeValue}
              </p>
            </div>

            <div
              style={{
                background: theme.cardBg,
                borderRadius: "1rem",
                padding: spacing.lg,
                boxShadow: theme.shadow,
                border: `1px solid ${theme.border}`,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = theme.shadowHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = theme.shadow;
              }}
            >
              <div style={{ marginBottom: spacing.sm }}>
                <p
                  style={{ color: theme.textSecondary, fontSize: fontSize.sm }}
                >
                  New Requests
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: spacing.xs,
                }}
              >
                <h2
                  style={{
                    fontSize: fontSize.xxl,
                    fontWeight: "bold",
                    color: theme.text,
                    fontFamily: "'Roboto Mono', monospace",
                  }}
                >
                  {stats.newRequests}
                </h2>
                <span
                  style={{ fontSize: fontSize.md, color: theme.textSecondary }}
                >
                  req.
                </span>
              </div>
              <p
                style={{
                  color: theme.warning,
                  fontSize: fontSize.md,
                  marginTop: spacing.xs,
                }}
              >
                {stats.newValue}
              </p>
            </div>

            <div
              style={{
                background: theme.cardBg,
                borderRadius: "1rem",
                padding: spacing.lg,
                boxShadow: theme.shadow,
                border: `1px solid ${theme.border}`,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = theme.shadowHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = theme.shadow;
              }}
            >
              <div style={{ marginBottom: spacing.sm }}>
                <p
                  style={{ color: theme.textSecondary, fontSize: fontSize.sm }}
                >
                  Total Sent
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: spacing.xs,
                }}
              >
                <h2
                  style={{
                    fontSize: fontSize.xxl,
                    fontWeight: "bold",
                    color: theme.text,
                    fontFamily: "'Roboto Mono', monospace",
                  }}
                >
                  {stats.totalSent}
                </h2>
              </div>
              <p
                style={{
                  color: theme.accent,
                  fontSize: fontSize.md,
                  marginTop: spacing.xs,
                }}
              >
                {stats.sentValue}
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
              gap: spacing.lg,
              marginBottom: spacing.lg,
            }}
          >
            {/* Quick Actions */}
            <div
              style={{
                background: theme.cardBg,
                borderRadius: "1rem",
                padding: spacing.lg,
                boxShadow: theme.shadow,
                border: `1px solid ${theme.border}`,
              }}
            >
              <h2
                style={{
                  fontSize: fontSize.xl,
                  fontWeight: "bold",
                  color: theme.text,
                  marginBottom: spacing.md,
                  fontFamily: "'Roboto Mono', monospace",
                }}
              >
                Quick Actions
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                  gap: spacing.md,
                }}
              >
                {quickActions.map((action, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      action.onClick ? action.onClick() : navigate(action.path)
                    }
                    style={{
                      background: theme.cardBgAlt,
                      borderRadius: "0.75rem",
                      padding: spacing.md,
                      cursor: "pointer",
                      transition: "all 0.3s",
                      border: `1px solid ${theme.border}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = theme.shadowHover;
                      e.currentTarget.style.borderColor = action.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = theme.border;
                    }}
                  >
                    <div
                      style={{
                        fontSize: "2rem",
                        marginBottom: spacing.xs,
                      }}
                    >
                      {action.icon}
                    </div>
                    <h3
                      style={{
                        fontSize: fontSize.md,
                        fontWeight: "600",
                        color: theme.text,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {action.title}
                    </h3>
                    <p
                      style={{
                        fontSize: fontSize.sm,
                        color: theme.textSecondary,
                      }}
                    >
                      {action.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div
              style={{
                background: theme.cardBg,
                borderRadius: "1rem",
                padding: spacing.lg,
                boxShadow: theme.shadow,
                border: `1px solid ${theme.border}`,
              }}
            >
              <h2
                style={{
                  fontSize: fontSize.xl,
                  fontWeight: "bold",
                  color: theme.text,
                  marginBottom: spacing.md,
                  fontFamily: "'Roboto Mono', monospace",
                }}
              >
                Recent Activity
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: spacing.md,
                }}
              >
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    style={{
                      background: theme.cardBgAlt,
                      borderRadius: "0.5rem",
                      padding: spacing.md,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: spacing.xs,
                      }}
                    >
                      <p
                        style={{
                          fontSize: fontSize.sm,
                          fontWeight: "600",
                          color: theme.text,
                        }}
                      >
                        {activity.action}
                      </p>
                      <span
                        style={{
                          fontSize: fontSize.xs,
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          background:
                            activity.status === "completed"
                              ? theme.success
                              : theme.warning,
                          color: "white",
                          fontWeight: "600",
                        }}
                      >
                        {activity.status}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: fontSize.xs,
                        color: theme.textSecondary,
                      }}
                    >
                      {activity.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stock Market Widget */}
          <StockWidget />

          {/* Financial Overview Card */}
          <div
            style={{
              background: theme.cardBg,
              borderRadius: "1rem",
              padding: spacing.lg,
              boxShadow: theme.shadow,
              border: `1px solid ${theme.border}`,
            }}
          >
            <h2
              style={{
                fontSize: fontSize.xl,
                fontWeight: "bold",
                color: theme.text,
                marginBottom: spacing.md,
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              Financial Overview
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
                gap: spacing.lg,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: fontSize.sm,
                    color: theme.textSecondary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Total Portfolio Value
                </p>
                <p
                  style={{
                    fontSize: fontSize.xl,
                    fontWeight: "bold",
                    color: theme.text,
                  }}
                >
                  $125,430
                </p>
                <p
                  style={{
                    fontSize: fontSize.sm,
                    color: theme.success,
                    marginTop: spacing.xs,
                  }}
                >
                  +12.5% this month
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: fontSize.sm,
                    color: theme.textSecondary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Monthly Income
                </p>
                <p
                  style={{
                    fontSize: fontSize.xl,
                    fontWeight: "bold",
                    color: theme.text,
                  }}
                >
                  $8,250
                </p>
                <p
                  style={{
                    fontSize: fontSize.sm,
                    color: theme.textSecondary,
                    marginTop: spacing.xs,
                  }}
                >
                  Last updated today
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: fontSize.sm,
                    color: theme.textSecondary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Monthly Expenses
                </p>
                <p
                  style={{
                    fontSize: fontSize.xl,
                    fontWeight: "bold",
                    color: theme.text,
                  }}
                >
                  $4,820
                </p>
                <p
                  style={{
                    fontSize: fontSize.sm,
                    color: theme.danger,
                    marginTop: spacing.xs,
                  }}
                >
                  +3.2% vs last month
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: fontSize.sm,
                    color: theme.textSecondary,
                    marginBottom: spacing.xs,
                  }}
                >
                  Savings Rate
                </p>
                <p
                  style={{
                    fontSize: fontSize.xl,
                    fontWeight: "bold",
                    color: theme.text,
                  }}
                >
                  41.6%
                </p>
                <p
                  style={{
                    fontSize: fontSize.sm,
                    color: theme.success,
                    marginTop: spacing.xs,
                  }}
                >
                  Excellent!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Chat Button */}
      <button
        onClick={() => navigate("/chatbot")}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          padding: "1rem 2rem",
          background: darkMode ? "#0f172a" : "white",
          color: darkMode ? "white" : "#6366f1",
          border: darkMode ? "2px solid #6366f1" : "2px solid #6366f1",
          borderRadius: "9999px",
          fontSize: fontSize.md,
          fontWeight: "600",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          boxShadow: darkMode
            ? "0 8px 32px rgba(102, 126, 234, 0.4)"
            : "0 4px 12px rgba(99, 102, 241, 0.2)",
          transition: "all 0.3s ease",
          zIndex: 1000,
          fontFamily: "'Roboto Mono', monospace",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px) scale(1.05)";
          e.currentTarget.style.boxShadow = darkMode
            ? "0 12px 48px rgba(102, 126, 234, 0.6)"
            : "0 8px 24px rgba(99, 102, 241, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = darkMode
            ? "0 8px 32px rgba(102, 126, 234, 0.4)"
            : "0 4px 12px rgba(99, 102, 241, 0.2)";
        }}
      >
        <img
          src="/ChatBot Avatar.png"
          alt="AI Assistant"
          style={{
            width: "1.5rem",
            height: "1.5rem",
            objectFit: "contain",
          }}
        />
        Assist Me
      </button>

      {/* Financial Advice Modal */}
      {showAdviceModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: spacing.md,
          }}
          onClick={() => setShowAdviceModal(false)}
        >
          <div
            style={{
              background: theme.cardBg,
              borderRadius: "1rem",
              padding: spacing.lg,
              maxWidth: "900px",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: theme.shadowHover,
              border: `1px solid ${theme.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: spacing.md,
              }}
            >
              <h2
                style={{
                  fontSize: fontSize.xl,
                  fontWeight: "bold",
                  color: theme.text,
                  fontFamily: "'Roboto Mono', monospace",
                }}
              >
                Financial Advisor Recommendations
              </h2>
              <button
                onClick={() => setShowAdviceModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  color: theme.textSecondary,
                  cursor: "pointer",
                  padding: "0.5rem",
                }}
              >
                ×
              </button>
            </div>

            {loadingAdvice && (
              <div
                style={{
                  textAlign: "center",
                  padding: spacing.xl,
                  color: theme.textSecondary,
                }}
              >
                <p style={{ fontSize: fontSize.md }}>
                  Analyzing your financial profile...
                </p>
              </div>
            )}

            {adviceError && (
              <div
                style={{
                  background: darkMode ? "#7f1d1d" : "#fee2e2",
                  border: `1px solid ${darkMode ? "#991b1b" : "#fecaca"}`,
                  borderRadius: "0.5rem",
                  padding: spacing.md,
                  marginBottom: spacing.md,
                }}
              >
                <p
                  style={{
                    color: darkMode ? "#fca5a5" : "#991b1b",
                    fontSize: fontSize.sm,
                  }}
                >
                  {adviceError}
                </p>
              </div>
            )}

            {financialAdvice && !loadingAdvice && (
              <div>
                {/* User Profile Summary */}
                <div
                  style={{
                    background: theme.cardBgAlt,
                    borderRadius: "0.75rem",
                    padding: spacing.md,
                    marginBottom: spacing.md,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <h3
                    style={{
                      fontSize: fontSize.lg,
                      fontWeight: "600",
                      color: theme.text,
                      marginBottom: spacing.sm,
                    }}
                  >
                    Your Financial Profile
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                      gap: spacing.sm,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: fontSize.xs,
                          color: theme.textSecondary,
                        }}
                      >
                        Monthly Income
                      </p>
                      <p
                        style={{
                          fontSize: fontSize.md,
                          fontWeight: "600",
                          color: theme.text,
                        }}
                      >
                        ${financialAdvice.user_profile.income.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: fontSize.xs,
                          color: theme.textSecondary,
                        }}
                      >
                        Monthly Expenses
                      </p>
                      <p
                        style={{
                          fontSize: fontSize.md,
                          fontWeight: "600",
                          color: theme.text,
                        }}
                      >
                        ${financialAdvice.user_profile.expenses.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: fontSize.xs,
                          color: theme.textSecondary,
                        }}
                      >
                        Savings Potential
                      </p>
                      <p
                        style={{
                          fontSize: fontSize.md,
                          fontWeight: "600",
                          color: theme.success,
                        }}
                      >
                        $
                        {financialAdvice.user_profile.savings_potential.toFixed(
                          2,
                        )}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: fontSize.xs,
                          color: theme.textSecondary,
                        }}
                      >
                        Risk Tolerance
                      </p>
                      <p
                        style={{
                          fontSize: fontSize.md,
                          fontWeight: "600",
                          color: theme.text,
                          textTransform: "capitalize",
                        }}
                      >
                        {financialAdvice.user_profile.risk_tolerance}
                      </p>
                    </div>
                  </div>
                  {financialAdvice.user_profile.goal && (
                    <div style={{ marginTop: spacing.sm }}>
                      <p
                        style={{
                          fontSize: fontSize.xs,
                          color: theme.textSecondary,
                        }}
                      >
                        Financial Goal
                      </p>
                      <p
                        style={{
                          fontSize: fontSize.md,
                          fontWeight: "600",
                          color: theme.text,
                        }}
                      >
                        {financialAdvice.user_profile.goal}
                      </p>
                    </div>
                  )}
                </div>

                {/* Financial Advice */}
                <div
                  style={{
                    background: theme.cardBg,
                    borderRadius: "0.75rem",
                    padding: spacing.lg,
                    border: `1px solid ${theme.border}`,
                    maxHeight: "500px",
                    overflowY: "auto",
                  }}
                >
                  <h3
                    style={{
                      fontSize: fontSize.lg,
                      fontWeight: "700",
                      color: theme.text,
                      marginBottom: spacing.md,
                      borderBottom: `2px solid ${theme.border}`,
                      paddingBottom: spacing.sm,
                    }}
                  >
                    Personalized Financial Advice
                  </h3>
                  <div
                    style={{
                      fontSize: fontSize.sm,
                      color: theme.text,
                    }}
                  >
                    {formatAdviceText(financialAdvice.advice.advice)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: spacing.sm,
                    marginTop: spacing.md,
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() => navigate("/financial-profile")}
                    style={{
                      padding: `${spacing.sm} ${spacing.md}`,
                      background: "transparent",
                      border: `2px solid ${theme.accent}`,
                      borderRadius: "0.5rem",
                      color: theme.accent,
                      fontSize: fontSize.sm,
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      fontFamily: "'Roboto Mono', monospace",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.accent;
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = theme.accent;
                    }}
                  >
                    Update Profile
                  </button>
                  <button
                    onClick={() => setShowAdviceModal(false)}
                    style={{
                      padding: `${spacing.sm} ${spacing.md}`,
                      background: theme.accent,
                      border: "none",
                      borderRadius: "0.5rem",
                      color: "white",
                      fontSize: fontSize.sm,
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      fontFamily: "'Roboto Mono', monospace",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.accentHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = theme.accent;
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardPage;
