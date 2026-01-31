import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const darkMode = useSelector((state) => state.theme.darkMode);

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
      <Header />

      {/* Hero Section */}
      <section
        style={{
          padding: isMobile
            ? `${spacing.xxl} ${spacing.md}`
            : `6rem ${spacing.xxl} ${spacing.xxl}`,
          maxWidth: "1400px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
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
            ABOUT US
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
          Transforming the way finance is
          <br />
          <span style={{ color: "#667eea" }}>delivered & experienced.</span>
        </h1>

        <p
          style={{
            fontSize: fontSize.md,
            color: theme.textSecondary,
            lineHeight: "1.8",
            marginBottom: spacing.xl,
            maxWidth: "800px",
            margin: `0 auto ${spacing.xl}`,
          }}
        >
          At Nexora, we unlock capital for financial intelligence and create
          the AI infrastructure this industry has been missing.
        </p>
      </section>

      {/* Mission Section */}
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
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: spacing.xxl,
            alignItems: "center",
          }}
        >
          {/* Left - Illustration/Visual */}
          <div
            style={{
              backgroundImage: "url('/AI Background.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              borderRadius: "1.5rem",
              padding: spacing.xxl,
              minHeight: "400px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: darkMode
                  ? "rgba(15, 23, 42, 0.7)"
                  : "rgba(0, 0, 0, 0.3)",
                borderRadius: "1.5rem",
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: fontSize.xxl,
                  fontWeight: "700",
                  color: "white",
                  marginBottom: spacing.md,
                }}
              >
                50k+
              </div>
              <div
                style={{
                  fontSize: fontSize.md,
                  color: "rgba(255, 255, 255, 0.9)",
                }}
              >
                Active Users Trust Us
              </div>
            </div>
          </div>

          {/* Right - Content */}
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
                WHO WE ARE
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
              We sit at the intersection of{" "}
              <span style={{ color: "#667eea" }}>finance and AI.</span>
            </h2>

            <p
              style={{
                fontSize: fontSize.md,
                color: theme.textSecondary,
                lineHeight: "1.8",
                marginBottom: spacing.lg,
              }}
            >
              Our team blends experience from two worlds. This dual perspective
              means our solutions are both institutionally rigorous and
              practically effective.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: spacing.lg,
              }}
            >
              <div
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: "1rem",
                  padding: spacing.lg,
                  boxShadow: theme.shadow,
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
                  Institutional-Grade Intelligence
                </h3>
                <p
                  style={{
                    fontSize: fontSize.sm,
                    color: theme.textSecondary,
                    lineHeight: "1.6",
                  }}
                >
                  We operate at the nexus of some of the most demanding
                  financial environments, bringing enterprise-level insights to
                  everyone.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: "1rem",
                  padding: spacing.lg,
                  boxShadow: theme.shadow,
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
                  AI-Powered Operations
                </h3>
                <p
                  style={{
                    fontSize: fontSize.sm,
                    color: theme.textSecondary,
                    lineHeight: "1.6",
                  }}
                >
                  Running intelligent algorithms at the ground level. We adapt
                  and learn from every interaction to serve you better.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
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
              OUR TECHNOLOGY
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
            Built with{" "}
            <span style={{ color: "#667eea" }}>
              state-of-the-art algorithms
            </span>
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
            Powered by comprehensive financial data and advanced machine
            learning, Nexora brings institutional-grade financial
            intelligence to everyone.
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
              title: "AI Agents",
              description:
                "Specialized agents for predictions, fraud detection, and sentiment analysis",
            },
            {
              title: "Real-Time Data",
              description:
                "Live market data and instant insights for informed decision-making",
            },
            {
              title: "Secure & Private",
              description:
                "Bank-level security with end-to-end encryption for your data",
            },
            {
              title: "Smart Insights",
              description:
                "Personalized recommendations based on your financial profile",
            },
            {
              title: "Predictive Analytics",
              description:
                "Advanced forecasting for stocks, risks, and market trends",
            },
            {
              title: "Goal Tracking",
              description:
                "Set and achieve financial goals with AI-powered guidance",
            },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                backgroundColor: theme.cardBgWhite,
                borderRadius: "1.25rem",
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
                  fontWeight: "600",
                  color: theme.text,
                  marginBottom: spacing.sm,
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: fontSize.sm,
                  color: theme.textSecondary,
                  lineHeight: "1.6",
                }}
              >
                {feature.description}
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
            Ready to transform your financial future?
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
            Join thousands of users who trust Nexora to make smarter
            financial decisions every day.
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
              Get Started Today
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
