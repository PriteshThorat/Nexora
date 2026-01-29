import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "../store/themeSlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

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
  };

  // Theme colors
  const theme = {
    navBg: darkMode ? "#1e293b" : "white",
    text: darkMode ? "#f1f5f9" : "#1f2937",
    shadow: darkMode
      ? "0 4px 12px rgba(0,0,0,0.3)"
      : "0 4px 12px rgba(0,0,0,0.08)",
  };

  return (
    <>
      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile
            ? `${spacing.sm} ${spacing.md}`
            : `${spacing.md} ${spacing.xxl}`,
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
              fontSize: isMobile ? fontSize.md : fontSize.lg,
              fontWeight: "bold",
              color: "#667eea",
              letterSpacing: "-0.02em",
            }}
          >
            Nexora
          </div>
        </div>

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: spacing.xs,
              color: theme.text,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {isMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        )}

        {/* Desktop Navigation */}
        {!isMobile && (
          <>
            <div
              style={{ display: "flex", gap: spacing.lg, alignItems: "center" }}
            >
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

            <div
              style={{ display: "flex", gap: spacing.sm, alignItems: "center" }}
            >
              {/* Dark Mode Toggle */}
              <button
                onClick={handleToggleDarkMode}
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
          </>
        )}
      </nav>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            backgroundColor: theme.navBg,
            boxShadow: theme.shadow,
            padding: spacing.md,
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            gap: spacing.sm,
          }}
        >
          <Link
            to="/about"
            style={{
              textDecoration: "none",
              color: theme.text,
              fontWeight: "500",
              fontSize: fontSize.sm,
              padding: spacing.sm,
              borderRadius: "0.5rem",
            }}
            onClick={() => setIsMenuOpen(false)}
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
              padding: spacing.sm,
              borderRadius: "0.5rem",
            }}
            onClick={() => setIsMenuOpen(false)}
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
              padding: spacing.sm,
              borderRadius: "0.5rem",
            }}
            onClick={() => setIsMenuOpen(false)}
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
              padding: spacing.sm,
              borderRadius: "0.5rem",
            }}
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <div
            style={{ display: "flex", gap: spacing.sm, marginTop: spacing.sm }}
          >
            <button
              onClick={handleToggleDarkMode}
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
            <Link to="/login" style={{ flex: 1 }}>
              <button
                style={{
                  width: "100%",
                  padding: spacing.sm,
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: fontSize.sm,
                  fontFamily: "'Roboto Mono', monospace",
                  color: theme.text,
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </button>
            </Link>
            <Link to="/register" style={{ flex: 1 }}>
              <button
                style={{
                  width: "100%",
                  padding: spacing.sm,
                  backgroundColor: darkMode ? "#667eea" : "#000",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: fontSize.sm,
                  fontFamily: "'Roboto Mono', monospace",
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
