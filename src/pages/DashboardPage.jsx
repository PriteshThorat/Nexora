import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "../store/themeSlice";
import StockWidget from "../components/StockWidget";
import NewsSentimentWidget from "../components/NewsSentimentWidget";
import SentimentNewsHeading from "../components/SentimentNewsHeading";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  const [financialAdvice, setFinancialAdvice] = useState(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [adviceError, setAdviceError] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user profile
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/profile/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      // Call logout API
      await fetch(`${API_BASE_URL}/api/users/logout/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear local storage and navigate regardless of API response
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("profileComplete");
      navigate("/login");
    }
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
        `${API_BASE_URL}/api/agents/financial_advisor/`,
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
      icon: "",
      onClick: handleGetFinancialAdvice,
      color: "#f59e0b",
    },
    {
      title: "AI Financial Advisor",
      description: "Chat with AI advisor",
      icon: "",
      path: "/chatbot",
      color: theme.accent,
    },
    {
      title: "Stock Predictions",
      description: "View AI-powered stock forecasts",
      icon: "",
      path: "/features",
      color: theme.success,
    },
    {
      title: "Credit Risk Analysis",
      description: "Assess your creditworthiness",
      icon: "",
      path: "/features",
      color: theme.warning,
    },
    {
      title: "Fraud Detection",
      description: "Monitor suspicious activities",
      icon: "",
      path: "/features",
      color: theme.danger,
    },
    {
      title: "Sentiment Analysis",
      description: "Market sentiment insights",
      icon: "",
      path: "/features",
      color: "#8b5cf6",
    },
    {
      title: "Portfolio Manager",
      description: "Manage your investments",
      icon: "",
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
      <div
        style={{
          minHeight: "100vh",
          background: theme.bg,
          display: "flex",
          fontFamily: "'Roboto Mono', monospace",
          overflowX: "hidden",
          width: "100%",
        }}
      >
        {/* Sidebar */}
        {!isMobile && (
          <div
            style={{
              width: "240px",
              background: theme.cardBg,
              borderRight: `1px solid ${theme.border}`,
              padding: spacing.lg,
              display: "flex",
              flexDirection: "column",
              position: "fixed",
              height: "100vh",
              left: 0,
              top: 0,
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing.sm,
                marginBottom: spacing.xl,
                paddingBottom: spacing.md,
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <span
                style={{
                  fontSize: fontSize.lg,
                  fontWeight: "700",
                  color: theme.text,
                }}
              >
                Nexora
              </span>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1 }}>
              <div
                style={{
                  background: darkMode ? "#334155" : "#f1f5f9",
                  borderRadius: "8px",
                  padding: spacing.sm,
                  marginBottom: spacing.xs,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                <span style={{ fontSize: "1.25rem" }}></span>
                <span
                  style={{
                    color: theme.text,
                    fontSize: fontSize.sm,
                    fontWeight: "600",
                  }}
                >
                  Home
                </span>
              </div>
              <div
                onClick={() => navigate("/profile")}
                style={{
                  borderRadius: "8px",
                  padding: spacing.sm,
                  marginBottom: spacing.xs,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.sm,
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: spacing.sm,
                  }}
                >
                  <span style={{ fontSize: "1.25rem" }}></span>
                  <span
                    style={{
                      color: theme.textSecondary,
                      fontSize: fontSize.sm,
                      fontWeight: "500",
                    }}
                  >
                    Profile
                  </span>
                </div>
                <span
                  style={{
                    background: theme.accent,
                    color: "white",
                    borderRadius: "12px",
                    padding: "2px 8px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                  }}
                >
                  2
                </span>
              </div>
              <div
                style={{
                  borderRadius: "8px",
                  padding: spacing.sm,
                  marginBottom: spacing.xs,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.sm,
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: spacing.sm,
                  }}
                >
                  <span style={{ fontSize: "1.25rem" }}></span>
                  <span
                    style={{
                      color: theme.textSecondary,
                      fontSize: fontSize.sm,
                      fontWeight: "500",
                    }}
                  >
                    Activity
                  </span>
                </div>
                <span
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    borderRadius: "12px",
                    padding: "2px 8px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                  }}
                >
                  410
                </span>
              </div>
              <div
                onClick={() => navigate("/features")}
                style={{
                  borderRadius: "8px",
                  padding: spacing.sm,
                  marginBottom: spacing.xs,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                <span style={{ fontSize: "1.25rem" }}></span>
                <span
                  style={{
                    color: theme.textSecondary,
                    fontSize: fontSize.sm,
                    fontWeight: "500",
                  }}
                >
                  Services
                </span>
              </div>
              <div
                style={{
                  borderRadius: "8px",
                  padding: spacing.sm,
                  marginBottom: spacing.xs,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                <span style={{ fontSize: "1.25rem" }}></span>
                <span
                  style={{
                    color: theme.textSecondary,
                    fontSize: fontSize.sm,
                    fontWeight: "500",
                  }}
                >
                  Shopping
                </span>
              </div>
            </nav>

            {/* User Profile */}
            <div
              style={{
                borderTop: `1px solid ${theme.border}`,
                paddingTop: spacing.md,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.sm,
                  marginBottom: spacing.sm,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: fontSize.sm,
                      fontWeight: "600",
                      color: theme.text,
                    }}
                  >
                    {userProfile?.first_name && userProfile?.last_name
                      ? `${userProfile.first_name} ${userProfile.last_name}`
                      : userProfile?.username || "User"}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: spacing.sm,
                  background: darkMode ? "#7f1d1d" : "#fee2e2",
                  border: "none",
                  borderRadius: "8px",
                  color: darkMode ? "#fca5a5" : "#991b1b",
                  fontSize: fontSize.sm,
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: spacing.xs,
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            maxWidth: "100%",
            overflowX: "hidden",
            marginLeft: isMobile ? 0 : "240px",
            padding: isMobile ? spacing.sm : spacing.lg,
            paddingTop: isMobile ? 0 : spacing.lg,
            paddingBottom: isMobile ? "5rem" : spacing.lg,
          }}
        >
          {/* Mobile Top Header */}
          {isMobile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: `${spacing.xs} ${spacing.md}`,
                background: theme.cardBg,
                borderBottom: `1px solid ${theme.border}`,
                position: "sticky",
                top: 0,
                zIndex: 100,
                marginBottom: spacing.sm,
                marginLeft: `-${spacing.sm}`,
                marginRight: `-${spacing.sm}`,
              }}
            >
              <span
                style={{
                  fontSize: fontSize.md,
                  fontWeight: "700",
                  color: theme.text,
                }}
              >
                Nexora
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                <button
                  onClick={() => dispatch(toggleDarkMode())}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: darkMode
                      ? "2px solid #475569"
                      : "2px solid #e5e7eb",
                    backgroundColor: darkMode ? "#334155" : "#f3f4f6",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="#475569"
                      stroke="none"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                </button>
                <div
                  onClick={() => navigate("/profile")}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                  }}
                >
                  👤
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: `${spacing.xs} ${spacing.sm}`,
                    background: darkMode ? "#7f1d1d" : "#fee2e2",
                    border: "none",
                    borderRadius: "8px",
                    color: darkMode ? "#fca5a5" : "#991b1b",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
            {/* Top Bar */}
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile ? "stretch" : "center",
                gap: isMobile ? spacing.sm : spacing.lg,
                marginBottom: spacing.lg,
              }}
            >
              <div
                style={{
                  flex: 1,
                  maxWidth: isMobile ? "100%" : "400px",
                }}
              >
                <input
                  type="text"
                  placeholder="Search for services"
                  style={{
                    width: "100%",
                    padding: spacing.sm,
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    background: theme.cardBg,
                    color: theme.text,
                    fontSize: fontSize.sm,
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: spacing.sm,
                  alignItems: "center",
                  justifyContent: isMobile ? "space-between" : "flex-end",
                  flexWrap: isMobile ? "wrap" : "nowrap",
                }}
              >
                {!isMobile && (
                  <>
                    <span
                      style={{
                        color: theme.textSecondary,
                        fontSize: fontSize.sm,
                      }}
                    >
                      Trades
                    </span>
                    <span
                      style={{
                        color: theme.textSecondary,
                        fontSize: fontSize.sm,
                      }}
                    >
                      Support
                    </span>
                    <span
                      style={{
                        color: theme.textSecondary,
                        fontSize: fontSize.sm,
                      }}
                    >
                      Language
                    </span>
                  </>
                )}

                <button
                  onClick={() => dispatch(toggleDarkMode())}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: darkMode
                      ? "2px solid #475569"
                      : "2px solid #e5e7eb",
                    backgroundColor: darkMode ? "#334155" : "#f3f4f6",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.backgroundColor = darkMode
                      ? "#475569"
                      : "#e5e7eb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.backgroundColor = darkMode
                      ? "#334155"
                      : "#f3f4f6";
                  }}
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="#475569"
                      stroke="none"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                </button>

                <button
                  style={{
                    padding: `${spacing.xs} ${spacing.sm}`,
                    background: "transparent",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "8px",
                    color: theme.text,
                    fontSize: fontSize.sm,
                    cursor: "pointer",
                    display: isMobile ? "none" : "block",
                  }}
                >
                  List your request
                </button>

                <div
                  style={{
                    position: "relative",
                    width: "32px",
                    height: "32px",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}></span>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "8px",
                      height: "8px",
                      background: "#10b981",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr",
                gap: spacing.lg,
                marginBottom: spacing.lg,
              }}
            >
              {/* Promotional Card */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  borderRadius: "16px",
                  padding: isMobile ? spacing.lg : spacing.xl,
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      letterSpacing: "1px",
                      marginBottom: spacing.xs,
                      opacity: 0.9,
                    }}
                  >
                    FINANCIAL INSIGHTS
                  </div>
                  <h2
                    style={{
                      fontSize: isMobile ? fontSize.xl : fontSize.xxl,
                      fontWeight: "700",
                      marginBottom: spacing.md,
                      lineHeight: 1.2,
                    }}
                  >
                    The best offers
                    <br />
                    for experts
                  </h2>
                  <button
                    onClick={() => navigate("/features")}
                    style={{
                      padding: `${spacing.sm} ${spacing.lg}`,
                      background: "white",
                      border: "none",
                      borderRadius: "8px",
                      color: "#059669",
                      fontSize: fontSize.sm,
                      fontWeight: "600",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    Show more
                  </button>
                </div>
                <div
                  style={{
                    position: "absolute",
                    right: "-20px",
                    bottom: "-20px",
                    fontSize: "200px",
                    opacity: 0.1,
                  }}
                ></div>
              </div>

              {/* Wallet View Card */}
              <div
                style={{
                  background: theme.cardBg,
                  borderRadius: "16px",
                  padding: spacing.lg,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: spacing.sm,
                    marginBottom: spacing.md,
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                    }}
                  ></div>
                  <div>
                    <div
                      style={{
                        fontSize: fontSize.sm,
                        fontWeight: "600",
                        color: theme.text,
                      }}
                    >
                      Wallet view
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: theme.textSecondary,
                      }}
                    >
                      A brief of your situation
                    </div>
                  </div>
                  <span
                    style={{
                      marginLeft: "auto",
                      background: "#10b981",
                      color: "white",
                      fontSize: "0.7rem",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontWeight: "600",
                    }}
                  >
                    New
                  </span>
                </div>

                {/* Balance */}
                <div style={{ marginBottom: spacing.md }}>
                  <div
                    style={{
                      fontSize: fontSize.xxl,
                      fontWeight: "700",
                      color: theme.text,
                    }}
                  >
                    $
                    {userProfile?.monthly_income
                      ? parseFloat(userProfile.monthly_income).toLocaleString()
                      : "0"}
                    <span
                      style={{
                        fontSize: fontSize.md,
                        color:
                          userProfile?.monthly_income &&
                          userProfile?.monthly_expenses
                            ? parseFloat(userProfile.monthly_income) >
                              parseFloat(userProfile.monthly_expenses)
                              ? theme.success
                              : "#ef4444"
                            : theme.textSecondary,
                        marginLeft: spacing.xs,
                      }}
                    >
                      {userProfile?.monthly_income &&
                      userProfile?.monthly_expenses
                        ? parseFloat(userProfile.monthly_income) >
                          parseFloat(userProfile.monthly_expenses)
                          ? `+${(((parseFloat(userProfile.monthly_income) - parseFloat(userProfile.monthly_expenses)) / parseFloat(userProfile.monthly_income)) * 100).toFixed(1)}%`
                          : `-${(((parseFloat(userProfile.monthly_expenses) - parseFloat(userProfile.monthly_income)) / parseFloat(userProfile.monthly_income)) * 100).toFixed(1)}%`
                        : ""}
                    </span>
                  </div>
                  {/* Simple chart line */}
                  <svg
                    width="100%"
                    height="60"
                    viewBox="0 0 270 60"
                    preserveAspectRatio="none"
                    style={{ marginTop: spacing.sm, display: "block" }}
                  >
                    <polyline
                      points="0,40 30,35 60,45 90,30 120,25 150,35 180,20 210,30 240,25 270,15"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                {/* Holdings */}
                <div
                  style={{
                    display: "flex",
                    gap: isMobile ? spacing.sm : spacing.md,
                    fontSize: fontSize.sm,
                    flexWrap: isMobile ? "wrap" : "nowrap",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: "700", color: theme.text }}>
                      {userProfile?.monthly_income
                        ? parseFloat(userProfile.monthly_income).toFixed(0)
                        : "0"}
                    </span>
                    <span
                      style={{ color: theme.textSecondary, marginLeft: "4px" }}
                    >
                      Income
                    </span>
                  </div>
                  <div>
                    <span style={{ fontWeight: "700", color: theme.text }}>
                      {userProfile?.monthly_expenses
                        ? parseFloat(userProfile.monthly_expenses).toFixed(0)
                        : "0"}
                    </span>
                    <span
                      style={{ color: theme.textSecondary, marginLeft: "4px" }}
                    >
                      Expenses
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background:
                          userProfile?.risk_tolerance === "high"
                            ? "#ef4444"
                            : userProfile?.risk_tolerance === "medium"
                              ? "#f59e0b"
                              : "#10b981",
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        fontWeight: "700",
                        color: theme.text,
                        textTransform: "capitalize",
                      }}
                    >
                      {userProfile?.risk_tolerance || "N/A"}
                    </span>
                    <span
                      style={{ color: theme.textSecondary, marginLeft: "2px" }}
                    >
                      Risk
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Icons */}
            <div
              style={{
                display: "flex",
                gap: isMobile ? spacing.md : spacing.lg,
                marginBottom: spacing.lg,
                justifyContent: isMobile ? "flex-start" : "center",
                overflowX: isMobile ? "auto" : "visible",
                paddingBottom: isMobile ? spacing.xs : 0,
              }}
            >
              {[
                { icon: "", label: "Blog", path: "/about" },
                { icon: "", label: "Invest", path: "/features" },
                { icon: "", label: "Chill", path: "/" },
                { icon: "", label: "Trick", path: "/" },
                { icon: "", label: "News", path: "/about" },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => navigate(item.path)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: spacing.xs,
                    cursor: "pointer",
                    flex: "0 0 auto",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      background: theme.cardBg,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    {item.icon}
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: theme.textSecondary,
                      fontWeight: "500",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Statistics Chart Section */}
            <div
              style={{
                background: theme.cardBg,
                borderRadius: "16px",
                padding: spacing.lg,
                marginBottom: spacing.lg,
                border: `1px solid ${theme.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "flex-start" : "center",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? spacing.sm : 0,
                  marginBottom: spacing.lg,
                }}
              >
                <h2
                  style={{
                    fontSize: fontSize.xl,
                    fontWeight: "700",
                    color: theme.text,
                  }}
                >
                  Statistic
                </h2>
                <div
                  style={{
                    display: "flex",
                    gap: spacing.sm,
                    flexWrap: "wrap",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  <button
                    style={{
                      padding: isMobile
                        ? `${spacing.xs} ${spacing.sm}`
                        : `${spacing.xs} ${spacing.md}`,
                      background: "transparent",
                      border: `1px solid ${theme.border}`,
                      borderRadius: "8px",
                      color: theme.textSecondary,
                      fontSize: fontSize.sm,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: spacing.xs,
                    }}
                  >
                    Sell
                  </button>
                  <button
                    style={{
                      padding: isMobile
                        ? `${spacing.xs} ${spacing.sm}`
                        : `${spacing.xs} ${spacing.md}`,
                      background: "transparent",
                      border: `1px solid ${theme.border}`,
                      borderRadius: "8px",
                      color: theme.textSecondary,
                      fontSize: fontSize.sm,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: spacing.xs,
                    }}
                  >
                    Buy
                  </button>
                  <button
                    style={{
                      padding: isMobile
                        ? `${spacing.xs} ${spacing.sm}`
                        : `${spacing.xs} ${spacing.md}`,
                      background: "transparent",
                      border: `1px solid ${theme.border}`,
                      borderRadius: "8px",
                      color: theme.textSecondary,
                      fontSize: fontSize.sm,
                      cursor: "pointer",
                    }}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Chart Legend */}
              <div
                style={{
                  display: "flex",
                  gap: isMobile ? spacing.md : spacing.lg,
                  marginBottom: spacing.md,
                  fontSize: fontSize.sm,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      background: "#3b82f6",
                      borderRadius: "50%",
                    }}
                  />
                  <span style={{ color: theme.textSecondary }}>19,730</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: spacing.xs,
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      background: "#ef4444",
                      borderRadius: "50%",
                    }}
                  />
                  <span style={{ color: theme.textSecondary }}>21,120</span>
                </div>
              </div>

              {/* Chart */}
              <svg
                width="100%"
                height="200"
                viewBox="0 0 720 200"
                preserveAspectRatio="none"
                style={{ display: "block" }}
              >
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 50}
                    x2="720"
                    y2={i * 50}
                    stroke={theme.border}
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Sell line (red dashed) */}
                <polyline
                  points="0,120 80,100 160,110 240,95 320,100 400,90 480,85 560,95 640,90 720,80"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                />

                {/* Buy line (blue solid) */}
                <polyline
                  points="0,130 80,110 160,95 240,105 320,90 400,110 480,100 560,85 640,95 720,90"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
              </svg>

              {/* Date labels */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: spacing.sm,
                  fontSize: "0.7rem",
                  color: theme.textSecondary,
                  flexWrap: isMobile ? "wrap" : "nowrap",
                  gap: isMobile ? spacing.xs : 0,
                }}
              >
                {[
                  "02Jun",
                  "03Mon",
                  "04Tue",
                  "05Wed",
                  "06Thu",
                  "07Fri",
                  "08Sat",
                  "09Sun",
                  "10Mon",
                  "11Tue",
                ].map((date, i) => (
                  <span key={i}>{date}</span>
                ))}
              </div>
            </div>

            {/* Bottom Section - Offers and Subscription */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 400px",
                gap: spacing.lg,
                marginBottom: spacing.lg,
              }}
            >
              {/* Offer Card */}
              <div
                style={{
                  background: theme.cardBg,
                  borderRadius: "16px",
                  padding: spacing.lg,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: spacing.sm,
                    marginBottom: spacing.md,
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.5rem",
                    }}
                  ></span>
                  <span
                    style={{
                      fontSize: fontSize.md,
                      fontWeight: "600",
                      color: theme.text,
                    }}
                  >
                    Offer
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: fontSize.lg,
                    fontWeight: "600",
                    color: theme.text,
                    marginBottom: spacing.sm,
                  }}
                >
                  Create your own profile
                </h3>
                <p
                  style={{
                    fontSize: fontSize.sm,
                    color: theme.textSecondary,
                    marginBottom: spacing.md,
                  }}
                >
                  in avatar bilder platform without login process.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: spacing.sm,
                    marginBottom: spacing.md,
                  }}
                >
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${i === 1 ? "#ec4899, #be185d" : i === 2 ? "#8b5cf6, #6d28d9" : "#f59e0b, #d97706"})`,
                        border: "2px solid white",
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => navigate("/financial-profile")}
                  style={{
                    padding: `${spacing.sm} ${spacing.lg}`,
                    background: theme.accent,
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: fontSize.sm,
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Explore Now
                </button>
              </div>

              {/* Newsletter Subscription Card */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  borderRadius: "16px",
                  padding: spacing.lg,
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <button
                  style={{
                    position: "absolute",
                    top: spacing.md,
                    right: spacing.md,
                    background: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  ×
                </button>
                <div
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: "600",
                    letterSpacing: "1px",
                    marginBottom: spacing.sm,
                    opacity: 0.9,
                  }}
                >
                  NEWSPAPER
                </div>
                <h3
                  style={{
                    fontSize: fontSize.xl,
                    fontWeight: "700",
                    marginBottom: spacing.sm,
                    lineHeight: 1.2,
                  }}
                >
                  Get news on
                  <br />
                  your phone
                </h3>
                <p
                  style={{
                    fontSize: fontSize.sm,
                    marginBottom: spacing.md,
                    opacity: 0.9,
                  }}
                >
                  Priceless and optimal sign
                </p>
                <button
                  style={{
                    padding: `${spacing.sm} ${spacing.lg}`,
                    background: "white",
                    border: "none",
                    borderRadius: "8px",
                    color: "#1d4ed8",
                    fontSize: fontSize.sm,
                    fontWeight: "600",
                    cursor: "pointer",
                    marginBottom: spacing.md,
                  }}
                >
                  Subscribe
                </button>
                <div
                  style={{
                    fontSize: "100px",
                    position: "absolute",
                    bottom: "-20px",
                    right: "-10px",
                    opacity: 0.3,
                  }}
                ></div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2, 1fr)"
                  : "repeat(auto-fit, minmax(200px, 1fr))",
                gap: spacing.md,
                marginBottom: spacing.lg,
              }}
            >
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  onClick={() =>
                    action.onClick ? action.onClick() : navigate(action.path)
                  }
                  style={{
                    background: theme.cardBg,
                    borderRadius: "12px",
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

            {/* Breaking News Heading */}
            <SentimentNewsHeading />

            {/* Stock Widget */}
            <NewsSentimentWidget />
            <StockWidget />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: theme.cardBg,
            borderTop: `1px solid ${theme.border}`,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            zIndex: 500,
            paddingTop: "0.5rem",
            paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))",
            boxShadow: "0 -4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {[
            { icon: "🏠", label: "Home", path: "/dashboard" },
            { icon: "👤", label: "Profile", path: "/profile" },
            { icon: "⚡", label: "Services", path: "/features" },
            { icon: "💬", label: "AI Chat", path: "/chatbot" },
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                padding: "0.25rem 0.75rem",
                flex: 1,
                borderRadius: "8px",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
              <span
                style={{
                  fontSize: "0.65rem",
                  color: theme.textSecondary,
                  fontWeight: "500",
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Floating AI Chat Button */}
      <button
        onClick={() => navigate("/chatbot")}
        style={{
          position: "fixed",
          bottom: isMobile ? "4.5rem" : "2rem",
          right: isMobile ? "1rem" : "2rem",
          padding: isMobile ? "0.75rem 1rem" : "1rem 2rem",
          background: darkMode ? "#0f172a" : "white",
          color: darkMode ? "white" : "#6366f1",
          border: darkMode ? "2px solid #6366f1" : "2px solid #6366f1",
          borderRadius: "9999px",
          fontSize: isMobile ? fontSize.sm : fontSize.md,
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
