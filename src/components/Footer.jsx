import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const darkMode = useSelector((state) => state.theme.darkMode);

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
    lg: "1.5rem",
  };

  return (
    <footer
      style={{
        padding: isMobile
          ? `${spacing.xl} ${spacing.md} ${spacing.md}`
          : `${spacing.xxl} ${spacing.xxl} ${spacing.lg}`,
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
          gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr",
          gap: isMobile ? spacing.lg : spacing.xxl,
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
          ></div>
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
  );
};

export default Footer;
