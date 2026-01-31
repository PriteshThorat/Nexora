import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../components/Header";

function DashboardPage() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const darkMode = useSelector((state) => state.theme.darkMode);

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
      title: "AI Financial Advisor",
      description: "Get personalized financial advice",
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
                    onClick={() => navigate(action.path)}
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
    </>
  );
}

export default DashboardPage;
