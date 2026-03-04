import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAppSelector } from "../store/store.ts";

const FeaturesPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Design system - consistent spacing and typography
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
    hero: "3.5rem",
  };

  // Theme colors
  const theme = {
    bg: darkMode ? "#0f172a" : "#ffffff",
    bgGradient: darkMode
      ? "linear-gradient(to bottom, #0f172a 0%, #1e293b 100%)"
      : "linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)",
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

  const features = [
    {
      number: "01.",
      title: "AI Financial Advisor",
      description:
        "Receive personalized financial advice based on your profile, goals, and risk tolerance. Our AI analyzes your financial situation to provide tailored recommendations.",
      color: "#667eea",
    },
    {
      number: "02.",
      title: "Stock Prediction",
      description:
        "Leverage advanced ML algorithms to predict stock market trends and make informed investment decisions with real-time data analysis.",
      color: "#10B981",
    },
    {
      number: "03.",
      title: "Fraud Detection",
      description:
        "Protect your transactions with real-time fraud detection using sophisticated anomaly detection algorithms that monitor suspicious activities.",
      color: "#EF4444",
    },
    {
      number: "04.",
      title: "Sentiment Analysis",
      description:
        "Analyze market sentiment from news and social media to gauge investor confidence and make data-driven decisions.",
      color: "#8B5CF6",
    },
    {
      number: "05.",
      title: "Credit Risk Assessment",
      description:
        "Evaluate creditworthiness and assess loan risks with AI-powered credit scoring models trained on comprehensive financial data.",
      color: "#06B6D4",
    },
    {
      number: "06.",
      title: "Finance Chatbot",
      description:
        "Get instant answers to your financial questions with our intelligent chatbot powered by advanced natural language processing.",
      color: "#F59E0B",
    },
  ];

  return (
    <div
      style={{
        fontFamily: "'Roboto Mono', monospace",
        minHeight: "100vh",
        background: theme.bgGradient,
        transition: "background 0.3s ease",
      }}
    >
      <Header />

      {/* Hero Section */}
      <section
        style={{
          padding: isMobile
            ? `${spacing.xxl} ${spacing.md}`
            : `6rem ${spacing.xxl} ${spacing.xxl}`,
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? spacing.xl : spacing.xxl,
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
                Features
              </span>
            </div>

            <h1
              style={{
                fontSize: isMobile ? fontSize.xl : fontSize.hero,
                fontWeight: "800",
                lineHeight: "1.2",
                color: theme.text,
                marginBottom: spacing.lg,
                letterSpacing: "-0.02em",
              }}
            >
              Powerful AI agents
              <br />
              <span style={{ color: "#667eea" }}>for smarter decisions</span>
            </h1>

            <p
              style={{
                fontSize: fontSize.md,
                color: theme.textSecondary,
                lineHeight: "1.8",
                marginBottom: spacing.xl,
                maxWidth: "540px",
              }}
            >
              Our set of features is designed to redefine the way you work,
              bringing efficiency, innovation, and ease to your daily tasks. We
              provide comprehensive insights and real-world use cases.
            </p>

            <Link to="/register">
              <button
                style={{
                  padding: `${spacing.md} ${spacing.xl}`,
                  backgroundColor: "#F59E0B",
                  color: "white",
                  border: "none",
                  borderRadius: "0.75rem",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: fontSize.sm,
                  fontFamily: "'Roboto Mono', monospace",
                  boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(245, 158, 11, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(245, 158, 11, 0.3)";
                }}
              >
                GET STARTED →
              </button>
            </Link>
          </div>

          {/* Right Content - Visual Cards */}
          <div
            style={{
              position: "relative",
              minHeight: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                backgroundColor: theme.cardBgDark,
                borderRadius: "2rem",
                padding: spacing.xxl,
                boxShadow: theme.shadowHover,
                minHeight: "400px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: fontSize.xl,
                  fontWeight: "700",
                  color: darkMode ? "white" : "#f1f5f9",
                  marginBottom: spacing.md,
                  textAlign: "center",
                }}
              >
                AI-Powered Intelligence
              </div>
              <div
                style={{
                  fontSize: fontSize.md,
                  color: darkMode ? "#94a3b8" : "#cbd5e1",
                  textAlign: "center",
                  maxWidth: "300px",
                }}
              >
                Six specialized agents working in harmony to revolutionize your
                financial decisions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section
        style={{
          padding: isMobile
            ? `${spacing.xxl} ${spacing.md}`
            : `${spacing.xxl} ${spacing.xxl}`,
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: spacing.lg,
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                backgroundColor: theme.cardBgWhite,
                borderRadius: "1.25rem",
                padding: spacing.xl,
                boxShadow: theme.shadow,
                transition: "all 0.3s ease",
                cursor: "pointer",
                borderTop: `3px solid ${feature.color}`,
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
              <div
                style={{
                  fontSize: fontSize.sm,
                  fontWeight: "600",
                  color: feature.color,
                  marginBottom: spacing.sm,
                  fontFamily: "'Roboto Mono', monospace",
                }}
              >
                {feature.number}
              </div>
              <h3
                style={{
                  fontSize: fontSize.lg,
                  fontWeight: "700",
                  color: theme.text,
                  marginBottom: spacing.md,
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: fontSize.sm,
                  color: theme.textSecondary,
                  lineHeight: "1.7",
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section
        style={{
          padding: isMobile
            ? `${spacing.xxl} ${spacing.md}`
            : `${spacing.xxl} ${spacing.xxl}`,
          maxWidth: "1400px",
          margin: "0 auto",
          backgroundColor: theme.sectionBg,
          borderRadius: "2rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: spacing.xxl }}>
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
              WHY CHOOSE US
            </span>
          </div>

          <h2
            style={{
              fontSize: isMobile ? fontSize.xl : fontSize.xxl,
              fontWeight: "700",
              lineHeight: "1.2",
              color: theme.text,
              marginBottom: spacing.lg,
            }}
          >
            Built for{" "}
            <span style={{ color: "#667eea" }}>modern financial needs</span>
          </h2>

          <p
            style={{
              fontSize: fontSize.md,
              color: theme.textSecondary,
              lineHeight: "1.8",
              maxWidth: "700px",
              margin: `0 auto ${spacing.xl}`,
            }}
          >
            Experience the perfect blend of cutting-edge technology and
            user-friendly design, delivering results that matter.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: spacing.lg,
          }}
        >
          {[
            {
              title: "Real-Time Processing",
              description:
                "Get instant insights with our high-performance infrastructure",
            },
            {
              title: "Bank-Level Security",
              description:
                "Your data is protected with enterprise-grade encryption",
            },
            {
              title: "24/7 Availability",
              description:
                "Access your AI agents anytime, anywhere, on any device",
            },
            {
              title: "Easy Integration",
              description:
                "Seamless setup process that takes minutes, not hours",
            },
            {
              title: "Personalized Experience",
              description:
                "Tailored recommendations based on your unique financial profile",
            },
            {
              title: "Continuous Learning",
              description:
                "Our AI models improve over time, adapting to market changes",
            },
          ].map((benefit, index) => (
            <div
              key={index}
              style={{
                backgroundColor: theme.cardBgWhite,
                borderRadius: "1rem",
                padding: spacing.lg,
                boxShadow: theme.shadow,
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "0.75rem",
                  backgroundColor: theme.badgeBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: spacing.md,
                }}
              >
                <span style={{ fontSize: "1.5rem", color: "#667eea" }}>✓</span>
              </div>
              <h3
                style={{
                  fontSize: fontSize.md,
                  fontWeight: "600",
                  color: theme.text,
                  marginBottom: spacing.sm,
                }}
              >
                {benefit.title}
              </h3>
              <p
                style={{
                  fontSize: fontSize.sm,
                  color: theme.textSecondary,
                  lineHeight: "1.6",
                }}
              >
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: isMobile
            ? `${spacing.xxl} ${spacing.md}`
            : `${spacing.xxl} ${spacing.xxl}`,
          maxWidth: "1400px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#667eea",
            borderRadius: "2rem",
            padding: isMobile ? spacing.xxl : `${spacing.xxl} ${spacing.xxl}`,
            boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? fontSize.xl : fontSize.xxl,
              fontWeight: "700",
              color: "white",
              marginBottom: spacing.lg,
            }}
          >
            Ready to experience the future of finance?
          </h2>
          <p
            style={{
              fontSize: fontSize.md,
              color: "rgba(255,255,255,0.9)",
              lineHeight: "1.8",
              marginBottom: spacing.xl,
              maxWidth: "600px",
              margin: `0 auto ${spacing.xl}`,
            }}
          >
            Join thousands of users who are already making smarter financial
            decisions with our AI-powered platform.
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
                fontWeight: "600",
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
            >
              Start Your Free Trial
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
