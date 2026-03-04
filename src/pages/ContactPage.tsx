import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store.ts";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ContactPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

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
    inputBg: darkMode ? "#0f172a" : "#f9fafb",
    inputBorder: darkMode ? "#334155" : "#e2e8f0",
    shadow: darkMode
      ? "0 4px 12px rgba(0,0,0,0.3)"
      : "0 4px 12px rgba(0,0,0,0.08)",
    shadowHover: darkMode
      ? "0 8px 24px rgba(0,0,0,0.4)"
      : "0 8px 24px rgba(0,0,0,0.12)",
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage(
        "Thank you for contacting us! We'll get back to you soon.",
      );
      setIsSubmitting(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitMessage(""), 5000);
    }, 1000);
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

      {/* Contact Section */}
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
            alignItems: "start",
          }}
        >
          {/* Left Content */}
          <div>
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
              Get in touch
              <br />
              <span style={{ color: "#667eea" }}>with us</span>
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
              We're here to help! Whether you have a question about our
              services, need assistance with your account, or want to provide
              feedback, our team is ready to assist you.
            </p>

            {/* Contact Information Cards */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: spacing.lg,
              }}
            >
              {/* Email Card */}
              <div
                style={{
                  backgroundColor: theme.cardBgWhite,
                  borderRadius: "1rem",
                  padding: spacing.lg,
                  boxShadow: theme.shadow,
                }}
              >
                <div
                  style={{
                    fontSize: fontSize.sm,
                    fontWeight: "600",
                    color: theme.text,
                    marginBottom: spacing.xs,
                  }}
                >
                  Email:
                </div>
                <div
                  style={{
                    fontSize: fontSize.lg,
                    fontWeight: "700",
                    color: "#667eea",
                  }}
                >
                  support@nexora.com
                </div>
              </div>

              {/* Phone Card */}
              <div
                style={{
                  backgroundColor: theme.cardBgWhite,
                  borderRadius: "1rem",
                  padding: spacing.lg,
                  boxShadow: theme.shadow,
                }}
              >
                <div
                  style={{
                    fontSize: fontSize.sm,
                    fontWeight: "600",
                    color: theme.text,
                    marginBottom: spacing.xs,
                  }}
                >
                  Phone:
                </div>
                <div
                  style={{
                    fontSize: fontSize.lg,
                    fontWeight: "700",
                    color: "#667eea",
                  }}
                >
                  +1 (555) 123-4567
                </div>
                <div
                  style={{
                    fontSize: fontSize.xs,
                    color: theme.textSecondary,
                    marginTop: spacing.xs,
                  }}
                >
                  Available Monday to Friday, 9 AM - 6 PM GMT
                </div>
              </div>

              {/* Address Card */}
              <div
                style={{
                  backgroundColor: theme.cardBgWhite,
                  borderRadius: "1rem",
                  padding: spacing.lg,
                  boxShadow: theme.shadow,
                }}
              >
                <div
                  style={{
                    fontSize: fontSize.sm,
                    fontWeight: "600",
                    color: theme.text,
                    marginBottom: spacing.xs,
                  }}
                >
                  Address:
                </div>
                <div
                  style={{
                    fontSize: fontSize.md,
                    color: theme.textSecondary,
                    lineHeight: "1.6",
                  }}
                >
                  123 Finance Street
                  <br />
                  Tech City, TC 12345
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Contact Form */}
          <div
            style={{
              backgroundColor: theme.cardBgWhite,
              borderRadius: "1.5rem",
              padding: isMobile ? spacing.lg : spacing.xl,
              boxShadow: theme.shadowHover,
            }}
          >
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: spacing.md,
                  marginBottom: spacing.md,
                }}
              >
                {/* First Name */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: fontSize.sm,
                      fontWeight: "600",
                      color: theme.text,
                      marginBottom: spacing.xs,
                    }}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name..."
                    required
                    style={{
                      width: "100%",
                      padding: spacing.md,
                      backgroundColor: theme.inputBg,
                      border: `1px solid ${theme.inputBorder}`,
                      borderRadius: "0.5rem",
                      fontSize: fontSize.sm,
                      color: theme.text,
                      fontFamily: "'Roboto Mono', monospace",
                      transition: "border 0.3s ease",
                    }}
                    onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                      e.currentTarget.style.borderColor = "#667eea";
                      e.currentTarget.style.outline = "none";
                    }}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      e.currentTarget.style.borderColor = theme.inputBorder;
                    }}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: fontSize.sm,
                      fontWeight: "600",
                      color: theme.text,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name..."
                    required
                    style={{
                      width: "100%",
                      padding: spacing.md,
                      backgroundColor: theme.inputBg,
                      border: `1px solid ${theme.inputBorder}`,
                      borderRadius: "0.5rem",
                      fontSize: fontSize.sm,
                      color: theme.text,
                      fontFamily: "'Roboto Mono', monospace",
                      transition: "border 0.3s ease",
                    }}
                    onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                      e.currentTarget.style.borderColor = "#667eea";
                      e.currentTarget.style.outline = "none";
                    }}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      e.currentTarget.style.borderColor = theme.inputBorder;
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: spacing.md }}>
                <label
                  style={{
                    display: "block",
                    fontSize: fontSize.sm,
                    fontWeight: "600",
                    color: theme.text,
                    marginBottom: spacing.xs,
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address..."
                  required
                  style={{
                    width: "100%",
                    padding: spacing.md,
                    backgroundColor: theme.inputBg,
                    border: `1px solid ${theme.inputBorder}`,
                    borderRadius: "0.5rem",
                    fontSize: fontSize.sm,
                    color: theme.text,
                    fontFamily: "'Roboto Mono', monospace",
                    transition: "border 0.3s ease",
                  }}
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                    e.currentTarget.style.borderColor = "#667eea";
                    e.currentTarget.style.outline = "none";
                  }}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    e.currentTarget.style.borderColor = theme.inputBorder;
                  }}
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: spacing.lg }}>
                <label
                  style={{
                    display: "block",
                    fontSize: fontSize.sm,
                    fontWeight: "600",
                    color: theme.text,
                    marginBottom: spacing.xs,
                  }}
                >
                  How can we help you?
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Enter your message..."
                  required
                  rows={6}
                  style={{
                    width: "100%",
                    padding: spacing.md,
                    backgroundColor: theme.inputBg,
                    border: `1px solid ${theme.inputBorder}`,
                    borderRadius: "0.5rem",
                    fontSize: fontSize.sm,
                    color: theme.text,
                    fontFamily: "'Roboto Mono', monospace",
                    transition: "border 0.3s ease",
                    resize: "vertical",
                  }}
                  onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                    e.currentTarget.style.borderColor = "#667eea";
                    e.currentTarget.style.outline = "none";
                  }}
                  onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                    e.currentTarget.style.borderColor = theme.inputBorder;
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: `${spacing.md} ${spacing.lg}`,
                  backgroundColor: isSubmitting
                    ? theme.textSecondary
                    : "#000000",
                  color: "white",
                  border: "none",
                  borderRadius: "0.75rem",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  fontSize: fontSize.md,
                  fontFamily: "'Roboto Mono', monospace",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: spacing.sm,
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(0,0,0,0.3)";
                  }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.2)";
                }}
              >
                {isSubmitting ? "Sending..." : "Send Message →"}
              </button>

              {/* Success Message */}
              {submitMessage && (
                <div
                  style={{
                    marginTop: spacing.md,
                    padding: spacing.md,
                    backgroundColor: "#10B981",
                    color: "white",
                    borderRadius: "0.5rem",
                    fontSize: fontSize.sm,
                    textAlign: "center",
                  }}
                >
                  {submitMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Business Hours Section */}
      <section
        style={{
          padding: isMobile
            ? `${spacing.xl} ${spacing.md}`
            : `${spacing.xl} ${spacing.xxl}`,
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            backgroundColor: theme.sectionBg,
            borderRadius: "1.5rem",
            padding: isMobile ? spacing.lg : spacing.xl,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: fontSize.xl,
              fontWeight: "700",
              color: theme.text,
              marginBottom: spacing.lg,
            }}
          >
            Business Hours
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: spacing.lg,
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: fontSize.sm,
                  fontWeight: "600",
                  color: theme.text,
                  marginBottom: spacing.xs,
                }}
              >
                Monday - Friday
              </div>
              <div
                style={{
                  fontSize: fontSize.md,
                  color: theme.textSecondary,
                }}
              >
                9:00 AM - 6:00 PM EST
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: fontSize.sm,
                  fontWeight: "600",
                  color: theme.text,
                  marginBottom: spacing.xs,
                }}
              >
                Saturday
              </div>
              <div
                style={{
                  fontSize: fontSize.md,
                  color: theme.textSecondary,
                }}
              >
                10:00 AM - 4:00 PM EST
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: fontSize.sm,
                  fontWeight: "600",
                  color: theme.text,
                  marginBottom: spacing.xs,
                }}
              >
                Sunday
              </div>
              <div
                style={{
                  fontSize: fontSize.md,
                  color: theme.textSecondary,
                }}
              >
                Closed
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
