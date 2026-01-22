import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Design system - consistent spacing and typography
  const spacing = {
    xs: "0.5rem", // 8px
    sm: "1rem", // 16px
    md: "1.5rem", // 24px
    lg: "2rem", // 32px
    xl: "3rem", // 48px
    xxl: "4rem", // 64px
  };

  const fontSize = {
    xs: "0.875rem", // 14px
    sm: "1rem", // 16px
    md: "1.125rem", // 18px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    xxl: "3rem", // 48px
    hero: "3.5rem", // 56px
  };

  // Theme colors
  const theme = {
    bg: darkMode ? "#0f172a" : "#ffffff",
    bgGradient: darkMode
      ? "linear-gradient(to bottom, #0f172a 0%, #1e293b 100%)"
      : "linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)",
    navBg: darkMode ? "#1e293b" : "white",
    text: darkMode ? "#f1f5f9" : "#1f2937",
    textSecondary: darkMode ? "#94a3b8" : "#6b7280",
    cardBg: darkMode ? "#1e293b" : "#f8fafc",
    cardBgWhite: darkMode ? "#1e293b" : "white",
    cardBgDark: darkMode ? "#0f172a" : "#1f2937",
    sectionBg: darkMode ? "#1e293b" : "#f9fafb",
    badgeBg: darkMode ? "#312e81" : "#e0e7ff",
    shadow: darkMode
      ? "0 4px 12px rgba(0,0,0,0.3)"
      : "0 4px 12px rgba(0,0,0,0.08)",
    shadowHover: darkMode
      ? "0 8px 24px rgba(0,0,0,0.4)"
      : "0 8px 24px rgba(0,0,0,0.12)",
  };

  return (
    <div
      style={{
        fontFamily: "'Roboto Mono', monospace",
        minHeight: "100vh",
        background: theme.bgGradient,
        transition: "background 0.3s ease",
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: `${spacing.md} ${spacing.xxl}`,
          backgroundColor: theme.navBg,
          boxShadow: theme.shadow,
          position: "sticky",
          top: 0,
          zIndex: 1000,
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              fontSize: fontSize.lg,
              fontWeight: "bold",
              color: "#667eea",
              letterSpacing: "-0.02em",
            }}
          >
            Nexora
          </div>
        </div>

        <div style={{ display: "flex", gap: spacing.lg, alignItems: "center" }}>
          <Link
            to="/about"
            style={{
              textDecoration: "none",
              color: theme.text,
              fontWeight: "500",
              fontSize: fontSize.sm,
              transition: "all 0.2s ease",
              padding: `${spacing.xs} ${spacing.sm}`,
              borderRadius: "0.5rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#667eea";
              e.currentTarget.style.backgroundColor = darkMode
                ? "#1e293b"
                : "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.text;
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            About us
          </Link>
          <Link
            to="/features"
            style={{
              textDecoration: "none",
              color: theme.text,
              fontWeight: "500",
              fontSize: fontSize.sm,
              transition: "all 0.2s ease",
              padding: `${spacing.xs} ${spacing.sm}`,
              borderRadius: "0.5rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#667eea";
              e.currentTarget.style.backgroundColor = darkMode
                ? "#1e293b"
                : "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.text;
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Features
          </Link>
          <Link
            to="/dashboard"
            style={{
              textDecoration: "none",
              color: theme.text,
              fontWeight: "500",
              fontSize: fontSize.sm,
              transition: "all 0.2s ease",
              padding: `${spacing.xs} ${spacing.sm}`,
              borderRadius: "0.5rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#667eea";
              e.currentTarget.style.backgroundColor = darkMode
                ? "#1e293b"
                : "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.text;
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Dashboard
          </Link>
          <Link
            to="/contact"
            style={{
              textDecoration: "none",
              color: theme.text,
              fontWeight: "500",
              fontSize: fontSize.sm,
              transition: "all 0.2s ease",
              padding: `${spacing.xs} ${spacing.sm}`,
              borderRadius: "0.5rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#667eea";
              e.currentTarget.style.backgroundColor = darkMode
                ? "#1e293b"
                : "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.text;
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Contact
          </Link>
        </div>

        <div style={{ display: "flex", gap: spacing.sm, alignItems: "center" }}>
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: darkMode ? "2px solid #475569" : "2px solid #e5e7eb",
              backgroundColor: darkMode ? "#334155" : "#f3f4f6",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
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
            onFocus={(e) => {
              e.currentTarget.style.outline = "2px solid #667eea";
              e.currentTarget.style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg
                width="20"
                height="20"
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
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#475569"
                stroke="none"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <Link to="/login">
            <button
              style={{
                padding: `${spacing.sm} ${spacing.md}`,
                backgroundColor: "transparent",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: fontSize.sm,
                fontFamily: "'Roboto Mono', monospace",
                color: theme.text,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = darkMode
                  ? "#334155"
                  : "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = "2px solid #667eea";
                e.currentTarget.style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = "none";
              }}
              aria-label="Log in to your account"
            >
              Log in
            </button>
          </Link>
          <Link to="/register">
            <button
              style={{
                padding: `${spacing.sm} ${spacing.md}`,
                backgroundColor: darkMode ? "#667eea" : "#000",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: fontSize.sm,
                fontFamily: "'Roboto Mono', monospace",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 16px rgba(102, 126, 234, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = "2px solid #818cf8";
                e.currentTarget.style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = "none";
              }}
              aria-label="Sign up for free"
            >
              Sign up
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          padding: `6rem ${spacing.xxl} ${spacing.xxl}`,
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: spacing.xxl,
            alignItems: "center",
          }}
        >
          {/* Left Content */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: `${spacing.xs} ${spacing.md}`,
                backgroundColor: theme.badgeBg,
                borderRadius: "2rem",
                marginBottom: spacing.lg,
              }}
            >
              <span
                style={{
                  fontSize: fontSize.xs,
                  fontWeight: "600",
                  color: "#667eea",
                  letterSpacing: "0.02em",
                }}
              >
                AI-Powered Financial Intelligence
              </span>
            </div>

            <h1
              style={{
                fontSize: fontSize.hero,
                fontWeight: "800",
                lineHeight: "1.1",
                color: theme.text,
                marginBottom: spacing.lg,
                letterSpacing: "-0.02em",
              }}
            >
              Smart finance,
              <br />
              <span style={{ color: "#667eea" }}>total control</span>
            </h1>

            <p
              style={{
                fontSize: fontSize.md,
                color: theme.textSecondary,
                lineHeight: "1.7",
                marginBottom: spacing.xl,
                maxWidth: "540px",
              }}
            >
              Your financial needs evolve — and your AI advisor should too. From
              managing daily expenses to planning for life's biggest moments,
              Nexora adapts to support your goals at every stage.
            </p>

            <div
              style={{ display: "flex", alignItems: "center", gap: spacing.xl }}
            >
              <Link to="/register">
                <button
                  style={{
                    padding: `${spacing.md} ${spacing.xl}`,
                    backgroundColor: "#667eea",
                    color: "white",
                    border: "none",
                    borderRadius: "0.75rem",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: fontSize.sm,
                    fontFamily: "'Roboto Mono', monospace",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(102, 126, 234, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(102, 126, 234, 0.3)";
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "2px solid #818cf8";
                    e.currentTarget.style.outlineOffset = "2px";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "none";
                  }}
                  aria-label="Get started with Nexora"
                >
                  Get Started
                </button>
              </Link>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                <div style={{ display: "flex", marginLeft: "-0.5rem" }}>
                  <img
                    src="https://i.pravatar.cc/150?img=12"
                    alt="User avatar"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      border: darkMode
                        ? "3px solid #1e293b"
                        : "3px solid white",
                      boxShadow: darkMode
                        ? "0 2px 8px rgba(0,0,0,0.3)"
                        : "0 2px 4px rgba(0,0,0,0.1)",
                      objectFit: "cover",
                    }}
                  />
                  <img
                    src="https://i.pravatar.cc/150?img=32"
                    alt="User avatar"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      border: darkMode
                        ? "3px solid #1e293b"
                        : "3px solid white",
                      marginLeft: "-12px",
                      boxShadow: darkMode
                        ? "0 2px 8px rgba(0,0,0,0.3)"
                        : "0 2px 4px rgba(0,0,0,0.1)",
                      objectFit: "cover",
                    }}
                  />
                  <img
                    src="https://i.pravatar.cc/150?img=45"
                    alt="User avatar"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      border: darkMode
                        ? "3px solid #1e293b"
                        : "3px solid white",
                      marginLeft: "-12px",
                      boxShadow: darkMode
                        ? "0 2px 8px rgba(0,0,0,0.3)"
                        : "0 2px 4px rgba(0,0,0,0.1)",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: fontSize.sm,
                    fontWeight: "600",
                    color: theme.text,
                  }}
                >
                  50k+ Active Users
                </span>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: spacing.md,
            }}
          >
            {/* Mobile Banking Card */}
            <div
              style={{
                backgroundColor: theme.cardBg,
                borderRadius: "1.5rem",
                padding: spacing.xl,
                minHeight: "240px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                boxShadow: theme.shadow,
                transition: "all 0.3s ease",
                cursor: "pointer",
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
              <div>
                <div
                  style={{
                    fontSize: fontSize.lg,
                    fontWeight: "700",
                    color: theme.text,
                    marginBottom: spacing.xs,
                  }}
                >
                  24/7 AI Advisor
                </div>
                <div
                  style={{
                    fontSize: fontSize.sm,
                    color: theme.textSecondary,
                    lineHeight: "1.5",
                  }}
                >
                  At your fingertips
                </div>
              </div>
            </div>

            {/* AI Card */}
            <div
              style={{
                backgroundColor: "#667eea",
                borderRadius: "1.5rem",
                padding: spacing.xl,
                minHeight: "240px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(102, 126, 234, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(102, 126, 234, 0.3)";
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: fontSize.lg,
                    fontWeight: "bold",
                    color: "white",
                    marginBottom: spacing.xs,
                  }}
                >
                  AI
                </div>
                <div
                  style={{
                    fontSize: fontSize.xs,
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  Intelligent Predictions
                </div>
              </div>
              <div
                style={{
                  fontSize: "2.5rem",
                  color: "rgba(255,255,255,0.2)",
                  fontWeight: "bold",
                }}
              >
                ••••
              </div>
              <div>
                <div
                  style={{
                    fontSize: fontSize.xs,
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  Advanced Analytics
                </div>
                <div
                  style={{
                    fontSize: fontSize.sm,
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  Real-time
                </div>
              </div>
            </div>

            {/* Customer Support Card */}
            <div
              style={{
                backgroundColor: theme.cardBgDark,
                borderRadius: "1.5rem",
                padding: spacing.xl,
                minHeight: "240px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                boxShadow: theme.shadow,
                transition: "all 0.3s ease",
                cursor: "pointer",
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
              <div>
                <div
                  style={{
                    fontSize: fontSize.lg,
                    fontWeight: "700",
                    color: "white",
                    marginBottom: spacing.xs,
                  }}
                >
                  Smart Chatbot
                </div>
                <div
                  style={{
                    fontSize: fontSize.sm,
                    color: "rgba(255,255,255,0.8)",
                    lineHeight: "1.5",
                  }}
                >
                  Always available
                </div>
              </div>
            </div>

            {/* Custom Solutions Card */}
            <div
              style={{
                backgroundColor: "#f59e0b",
                borderRadius: "1.5rem",
                padding: spacing.xl,
                minHeight: "240px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(245, 158, 11, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(245, 158, 11, 0.3)";
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: fontSize.lg,
                    fontWeight: "700",
                    color: "white",
                    marginBottom: spacing.xs,
                  }}
                >
                  Custom Insights
                </div>
                <div
                  style={{
                    fontSize: fontSize.sm,
                    color: "rgba(255,255,255,0.95)",
                    lineHeight: "1.5",
                  }}
                >
                  Personalized for you
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted Partners Section */}
        <div
          style={{
            marginTop: "6rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: fontSize.xs,
              color: theme.textSecondary,
              marginBottom: "2rem",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Powered by cutting-edge AI technology
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "3.5rem",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: darkMode ? "#94a3b8" : "#9ca3af",
                opacity: 0.8,
              }}
            >
              TensorFlow
            </div>
            <div
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: darkMode ? "#94a3b8" : "#9ca3af",
                opacity: 0.8,
              }}
            >
              PyTorch
            </div>
            <div
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: darkMode ? "#94a3b8" : "#9ca3af",
                opacity: 0.8,
              }}
            >
              Scikit-learn
            </div>
            <div
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: darkMode ? "#94a3b8" : "#9ca3af",
                opacity: 0.8,
              }}
            >
              OpenAI
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: spacing.sm,
              marginTop: "3rem",
            }}
          >
            <div
              style={{
                fontSize: fontSize.xs,
                color: "#667eea",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>Scroll down to discover more</span>
              <span style={{ fontSize: "1.25rem" }}>↓</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents Features Section */}
      <section
        style={{
          padding: `6rem ${spacing.xxl}`,
          backgroundColor: theme.sectionBg,
          transition: "background-color 0.3s ease",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: spacing.xxl }}>
            <h2
              style={{
                fontSize: fontSize.xxl,
                fontWeight: "800",
                color: theme.text,
                marginBottom: spacing.md,
                letterSpacing: "-0.02em",
              }}
            >
              AI-Powered Financial Agents
            </h2>
            <p
              style={{
                fontSize: fontSize.md,
                color: theme.textSecondary,
                maxWidth: "640px",
                margin: "0 auto",
                lineHeight: "1.6",
              }}
            >
              Six specialized AI agents working together to provide
              comprehensive financial intelligence
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: spacing.lg,
            }}
          >
            {/* Stock Prediction Agent */}
            <div
              style={{
                backgroundColor: theme.cardBgWhite,
                borderRadius: "1.5rem",
                padding: spacing.xl,
                boxShadow: theme.shadow,
                transition: "all 0.3s ease",
                cursor: "pointer",
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
              <h3
                style={{
                  fontSize: fontSize.lg,
                  fontWeight: "700",
                  color: theme.text,
                  marginBottom: spacing.sm,
                }}
              >
                Stock Prediction
              </h3>
              <p
                style={{
                  fontSize: fontSize.sm,
                  color: theme.textSecondary,
                  lineHeight: "1.6",
                }}
              >
                Advanced LSTM models analyze market trends and predict stock
                movements with high accuracy.
              </p>
            </div>

            {/* Sentiment Analysis Agent */}
            <div
              style={{
                backgroundColor: theme.cardBgWhite,
                borderRadius: "1.5rem",
                padding: spacing.xl,
                boxShadow: theme.shadow,
                transition: "all 0.3s ease",
                cursor: "pointer",
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
              <h3
                style={{
                  fontSize: fontSize.lg,
                  fontWeight: "700",
                  color: theme.text,
                  marginBottom: spacing.sm,
                }}
              >
                Sentiment Analysis
              </h3>
              <p
                style={{
                  fontSize: fontSize.sm,
                  color: theme.textSecondary,
                  lineHeight: "1.6",
                }}
              >
                Real-time analysis of financial news and social media to gauge
                market sentiment and investor psychology.
              </p>
            </div>

            {/* Credit Risk Agent */}
            <div
              style={{
                backgroundColor: theme.cardBgWhite,
                borderRadius: "1.5rem",
                padding: spacing.xl,
                boxShadow: theme.shadow,
                transition: "all 0.3s ease",
                cursor: "pointer",
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
              <h3
                style={{
                  fontSize: fontSize.lg,
                  fontWeight: "700",
                  color: theme.text,
                  marginBottom: spacing.sm,
                }}
              >
                Credit Risk Assessment
              </h3>
              <p
                style={{
                  fontSize: fontSize.sm,
                  color: theme.textSecondary,
                  lineHeight: "1.6",
                }}
              >
                Evaluate creditworthiness and manage lending risks with
                intelligent machine learning algorithms.
              </p>
            </div>

            {/* Fraud Detection Agent */}
            <div
              style={{
                backgroundColor: theme.cardBgWhite,
                borderRadius: "1.5rem",
                padding: spacing.xl,
                boxShadow: theme.shadow,
                transition: "all 0.3s ease",
                cursor: "pointer",
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
              <h3
                style={{
                  fontSize: fontSize.lg,
                  fontWeight: "700",
                  color: theme.text,
                  marginBottom: spacing.sm,
                }}
              >
                Fraud Detection
              </h3>
              <p
                style={{
                  fontSize: fontSize.sm,
                  color: theme.textSecondary,
                  lineHeight: "1.6",
                }}
              >
                Advanced anomaly detection protects your transactions with
                real-time monitoring and alerts.
              </p>
            </div>

            {/* Financial Advisor Agent */}
            <div
              style={{
                backgroundColor: theme.cardBgWhite,
                borderRadius: "1.5rem",
                padding: spacing.xl,
                boxShadow: theme.shadow,
                transition: "all 0.3s ease",
                cursor: "pointer",
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
              <h3
                style={{
                  fontSize: fontSize.lg,
                  fontWeight: "700",
                  color: theme.text,
                  marginBottom: spacing.sm,
                }}
              >
                AI Financial Advisor
              </h3>
              <p
                style={{
                  fontSize: fontSize.sm,
                  color: theme.textSecondary,
                  lineHeight: "1.6",
                }}
              >
                Personalized financial advice powered by machine learning,
                available 24/7 through our intelligent chatbot.
              </p>
            </div>

            {/* Finance Chatbot Agent */}
            <div
              style={{
                backgroundColor: theme.cardBgWhite,
                borderRadius: "1.5rem",
                padding: spacing.xl,
                boxShadow: theme.shadow,
                transition: "all 0.3s ease",
                cursor: "pointer",
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
              <h3
                style={{
                  fontSize: fontSize.lg,
                  fontWeight: "700",
                  color: theme.text,
                  marginBottom: spacing.sm,
                }}
              >
                Smart Insights
              </h3>
              <p
                style={{
                  fontSize: fontSize.sm,
                  color: theme.textSecondary,
                  lineHeight: "1.6",
                }}
              >
                Get instant answers to your financial questions with natural
                language processing and comprehensive knowledge base.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        style={{
          padding: `6rem ${spacing.xxl}`,
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: spacing.xxl }}>
          <h2
            style={{
              fontSize: fontSize.xxl,
              fontWeight: "800",
              color: theme.text,
              marginBottom: spacing.md,
              letterSpacing: "-0.02em",
            }}
          >
            How It Works
          </h2>
          <p
            style={{
              fontSize: fontSize.md,
              color: theme.textSecondary,
              maxWidth: "640px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            Get started with Nexora in three simple steps
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: spacing.xl,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: theme.badgeBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: `0 auto ${spacing.md}`,
                transition: "background-color 0.3s ease",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24">
                <text
                  x="12"
                  y="18"
                  fontSize="18"
                  fontWeight="bold"
                  fill="#667eea"
                  textAnchor="middle"
                >
                  1
                </text>
              </svg>
            </div>
            <h3
              style={{
                fontSize: fontSize.lg,
                fontWeight: "700",
                color: theme.text,
                marginBottom: spacing.sm,
              }}
            >
              Create Account
            </h3>
            <p
              style={{
                fontSize: fontSize.sm,
                color: theme.textSecondary,
                lineHeight: "1.6",
              }}
            >
              Sign up in seconds and complete your financial profile to get
              personalized insights
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: theme.badgeBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: `0 auto ${spacing.md}`,
                transition: "background-color 0.3s ease",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24">
                <text
                  x="12"
                  y="18"
                  fontSize="18"
                  fontWeight="bold"
                  fill="#667eea"
                  textAnchor="middle"
                >
                  2
                </text>
              </svg>
            </div>
            <h3
              style={{
                fontSize: fontSize.lg,
                fontWeight: "700",
                color: theme.text,
                marginBottom: spacing.sm,
              }}
            >
              Connect Your Goals
            </h3>
            <p
              style={{
                fontSize: fontSize.sm,
                color: theme.textSecondary,
                lineHeight: "1.6",
              }}
            >
              Tell us about your financial goals and risk tolerance to customize
              your experience
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: theme.badgeBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: `0 auto ${spacing.md}`,
                transition: "background-color 0.3s ease",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24">
                <text
                  x="12"
                  y="18"
                  fontSize="18"
                  fontWeight="bold"
                  fill="#667eea"
                  textAnchor="middle"
                >
                  3
                </text>
              </svg>
            </div>
            <h3
              style={{
                fontSize: fontSize.lg,
                fontWeight: "700",
                color: theme.text,
                marginBottom: spacing.sm,
              }}
            >
              Get AI Insights
            </h3>
            <p
              style={{
                fontSize: fontSize.sm,
                color: theme.textSecondary,
                lineHeight: "1.6",
              }}
            >
              Receive intelligent recommendations and predictions powered by our
              AI agents
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: `6rem ${spacing.xxl}`,
          backgroundColor: "#667eea",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: fontSize.xxl,
            fontWeight: "800",
            color: "white",
            marginBottom: spacing.md,
            letterSpacing: "-0.02em",
          }}
        >
          Ready to transform your finances?
        </h2>
        <p
          style={{
            fontSize: fontSize.md,
            color: "rgba(255,255,255,0.95)",
            marginBottom: spacing.xl,
            maxWidth: "640px",
            margin: `0 auto ${spacing.xl}`,
            lineHeight: "1.6",
          }}
        >
          Join thousands of users who trust Nexora for their financial decisions
        </p>
        <Link to="/register">
          <button
            style={{
              padding: `${spacing.md} ${spacing.xl}`,
              backgroundColor: "white",
              color: "#667eea",
              border: "none",
              borderRadius: "0.75rem",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: fontSize.md,
              fontFamily: "'Roboto Mono', monospace",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = "2px solid #818cf8";
              e.currentTarget.style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
            aria-label="Get started with Nexora for free"
          >
            Get Started Free
          </button>
        </Link>
        <div
          style={{
            marginTop: spacing.sm,
            fontSize: fontSize.xs,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.01em",
          }}
        >
          No credit card required • Start in minutes
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: `${spacing.xxl} ${spacing.xxl} ${spacing.lg}`,
          backgroundColor: darkMode ? "#0f172a" : "#1f2937",
          color: "white",
          transition: "background-color 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: spacing.xxl,
            marginBottom: spacing.xxl,
          }}
        >
          <div>
            <div
              style={{
                fontSize: fontSize.lg,
                fontWeight: "bold",
                marginBottom: spacing.md,
                letterSpacing: "-0.02em",
                color: "#667eea",
              }}
            >
              Nexora
            </div>
            <p
              style={{
                color: "#d1d5db",
                fontSize: fontSize.sm,
                lineHeight: "1.7",
                marginBottom: spacing.lg,
                maxWidth: "320px",
              }}
            >
              AI-powered financial intelligence platform bringing
              institutional-grade analytics to everyone.
            </p>
            <div
              style={{
                fontSize: fontSize.xs,
                color: "#9ca3af",
                lineHeight: "1.6",
              }}
            >
              Built with Roboto Mono
              <br />
              Designed by Christian Robertson
            </div>
          </div>

          <div>
            <h4
              style={{
                marginBottom: spacing.md,
                fontSize: fontSize.sm,
                fontWeight: "600",
              }}
            >
              Product
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: spacing.sm,
              }}
            >
              <Link
                to="/features"
                style={{
                  color: "#d1d5db",
                  textDecoration: "none",
                  fontSize: fontSize.sm,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#667eea")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}
              >
                Features
              </Link>
              <Link
                to="/dashboard"
                style={{
                  color: "#d1d5db",
                  textDecoration: "none",
                  fontSize: fontSize.sm,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#667eea")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}
              >
                Dashboard
              </Link>
              <Link
                to="/chatbot"
                style={{
                  color: "#d1d5db",
                  textDecoration: "none",
                  fontSize: fontSize.sm,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#667eea")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}
              >
                AI Chatbot
              </Link>
            </div>
          </div>

          <div>
            <h4
              style={{
                marginBottom: spacing.md,
                fontSize: fontSize.sm,
                fontWeight: "600",
              }}
            >
              Company
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: spacing.sm,
              }}
            >
              <Link
                to="/about"
                style={{
                  color: "#d1d5db",
                  textDecoration: "none",
                  fontSize: fontSize.sm,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#667eea")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}
              >
                About
              </Link>
              <Link
                to="/contact"
                style={{
                  color: "#d1d5db",
                  textDecoration: "none",
                  fontSize: fontSize.sm,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#667eea")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}
              >
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4
              style={{
                marginBottom: spacing.md,
                fontSize: fontSize.sm,
                fontWeight: "600",
              }}
            >
              Legal
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: spacing.sm,
              }}
            >
              <a
                href="#"
                style={{
                  color: "#d1d5db",
                  textDecoration: "none",
                  fontSize: fontSize.sm,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#667eea")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                style={{
                  color: "#d1d5db",
                  textDecoration: "none",
                  fontSize: fontSize.sm,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#667eea")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #374151",
            paddingTop: spacing.lg,
            textAlign: "center",
            color: "#9ca3af",
            fontSize: fontSize.xs,
          }}
        >
          <p>© 2026 Nexora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
