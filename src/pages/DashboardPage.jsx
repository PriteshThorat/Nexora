import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "../store/themeSlice";
import StockWidget from "../components/StockWidget";
import NewsSentimentWidget from "../components/NewsSentimentWidget";
import SentimentNewsHeading from "../components/SentimentNewsHeading";
import FraudDetectionWidget from "../components/FraudDetectionWidget";
import CreditRiskWidget from "../components/CreditRiskWidget";
import FinancialAdvisorWidget from "../components/FinancialAdvisorWidget";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const WS_BASE_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000";

function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  const [showCreditRisk, setShowCreditRisk] = useState(false);
  const [showFinancialAdvisor, setShowFinancialAdvisor] = useState(false);
  const [financialAdvice, setFinancialAdvice] = useState(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [adviceError, setAdviceError] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [paymentUserProfile, setPaymentUserProfile] = useState(null);
  const [paymentIncomeExpenses, setPaymentIncomeExpenses] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // WebSocket connection & state
    let walletSocket = null;
    let wsRetryCount = 0;
    const maxRetries = 3;
    let setupAttempted = false;

    // Setup WebSocket for real-time wallet updates
    const setupWebSocket = (upiId) => {
      if (!upiId || setupAttempted) {
        console.log(
          "Skipping WebSocket setup - upiId:",
          upiId,
          "setupAttempted:",
          setupAttempted,
        );
        return;
      }

      setupAttempted = true;
      const wsUrl = `${WS_BASE_URL}/ws/transactions?upiId=${encodeURIComponent(upiId)}`;
      console.log("🔌 Setting up WebSocket connection for UPI ID:", upiId);
      console.log("🔌 WebSocket URL:", wsUrl);

      try {
        walletSocket = new WebSocket(wsUrl);

        walletSocket.onopen = () => {
          console.log("✅ WebSocket connected successfully");
          wsRetryCount = 0;

          // Send heartbeat every 30 seconds
          const pingInterval = setInterval(() => {
            if (walletSocket?.readyState === WebSocket.OPEN) {
              walletSocket.send("ping");
            } else {
              clearInterval(pingInterval);
            }
          }, 30000);
        };

        walletSocket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log("📨 WebSocket message received:", message);

            if (
              message.event === "transaction:incoming" &&
              message.transaction
            ) {
              console.log("💰 Got transaction update:", message.transaction);
              // Refresh the payment income/expenses
              fetchPaymentIncomeExpenses();

              // Add new transaction to recent transactions list (avoid duplicates)
              setRecentTransactions((prevTransactions) => {
                // Check if transaction already exists by transaction_id
                const transactionExists = prevTransactions.some(
                  (txn) =>
                    txn.transaction_id === message.transaction.transaction_id,
                );

                if (transactionExists) {
                  console.log(
                    "📊 Transaction already exists, skipping duplicate:",
                    message.transaction.transaction_id,
                  );
                  return prevTransactions;
                }

                // Add new transaction and deduplicate entire list
                const allTransactions = [
                  message.transaction,
                  ...prevTransactions,
                ];

                // Remove duplicates by transaction_id
                const seenIds = new Set();
                const uniqueTransactions = allTransactions.filter((txn) => {
                  if (seenIds.has(txn.transaction_id)) {
                    return false;
                  }
                  seenIds.add(txn.transaction_id);
                  return true;
                });

                // Keep only latest 5
                const limitedTransactions = uniqueTransactions.slice(0, 5);
                console.log(
                  "📊 Updated recent transactions:",
                  limitedTransactions,
                );
                return limitedTransactions;
              });
            } else if (
              message.event === "wallet:update" &&
              message.transaction
            ) {
              console.log("💰 Got wallet update:", message.transaction);
              setPaymentIncomeExpenses(message.transaction);
            }
          } catch (error) {
            if (event.data !== "pong") {
              console.error("Error parsing WebSocket message:", error);
            }
          }
        };

        walletSocket.onerror = (error) => {
          console.error("❌ WebSocket error:", error);
        };

        walletSocket.onclose = (event) => {
          console.log("🔌 WebSocket disconnected:", {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
          });

          // Attempt to reconnect
          if (!event.wasClean && wsRetryCount < maxRetries) {
            wsRetryCount++;
            console.log(`⚡ Reconnecting... (${wsRetryCount}/${maxRetries})`);
            setTimeout(() => {
              setupAttempted = false;
              setupWebSocket(upiId);
            }, 2000 * wsRetryCount);
          }
        };
      } catch (error) {
        console.error("Error creating WebSocket:", error);
      }
    };

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
      }
    };

    // Fetch payment user profile
    const fetchPaymentUserProfile = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/payment-user-profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();

        if (response.ok && data.success && data.data) {
          setPaymentUserProfile(data.data);
          console.log("Payment user profile:", data.data);

          // Setup WebSocket with the payment user's UPI ID
          if (data.data.upiId) {
            setTimeout(() => {
              setupWebSocket(data.data.upiId);
            }, 100);
          }
        } else {
          console.log("Payment user profile not available:", data.error);
        }
      } catch (error) {
        console.error("Error fetching payment user profile:", error);
      }
    };

    // Fetch payment income and expenses
    const fetchPaymentIncomeExpenses = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/payment-income-expenses`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();

        if (response.ok && data.success && data.data) {
          setPaymentIncomeExpenses(data.data);
          console.log("Payment income/expenses:", data.data);

          // Update financial profile with latest income/expenses from payment app
          try {
            const updateResponse = await fetch(
              `${API_BASE_URL}/api/users/financial_profile_update/`,
              {
                method: "PATCH",
                headers: {
                  Authorization: `Token ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  monthly_income: data.data.income,
                  monthly_expenses: data.data.expenses,
                }),
              },
            );

            if (updateResponse.ok) {
              console.log("Financial profile updated with payment app data");
            } else {
              console.error("Failed to update financial profile");
            }
          } catch (updateError) {
            console.error("Error updating financial profile:", updateError);
          }
        } else {
          console.log("Payment income/expenses not available");
        }
      } catch (error) {
        console.error("Error fetching payment income/expenses:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    // Fetch recent transactions
    const fetchRecentTransactions = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/transactions/payment-recent?limit=5`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();
        console.log("📊 Transactions API Response:", data);
        console.log("📊 Response Status:", response.status, response.ok);

        if (response.ok && data.results) {
          // Deduplicate transactions by transaction_id
          const uniqueTransactions = [];
          const seenIds = new Set();
          for (const txn of data.results) {
            if (!seenIds.has(txn.transaction_id)) {
              uniqueTransactions.push(txn);
              seenIds.add(txn.transaction_id);
            }
          }
          setRecentTransactions(uniqueTransactions);
          console.log("✅ Recent transactions set:", uniqueTransactions);
        } else {
          console.log(
            "❌ Failed to fetch recent transactions - Response not ok or no results",
          );
          console.log("Response:", data);
        }
      } catch (error) {
        console.error("❌ Error fetching recent transactions:", error);
      }
    };

    // Kick off all fetches
    fetchUserProfile();
    fetchPaymentUserProfile();
    fetchPaymentIncomeExpenses();
    fetchRecentTransactions();

    // Resize handler
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (walletSocket) {
        walletSocket.close();
      }
    };
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

  const quickActions = [];

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
      {/* Floating Fraud Detection Widget */}
      {recentTransactions && recentTransactions.length > 0 && (
        <FraudDetectionWidget
          transactions={recentTransactions}
          userProfile={userProfile}
          onNewTransaction={(callback) => {
            // Listen for new transactions via websocket
            return () => {}; // Unsubscribe function
          }}
        />
      )}

      {/* Credit Risk Assessment Widget */}
      <CreditRiskWidget
        isVisible={showCreditRisk}
        onClose={() => setShowCreditRisk(false)}
      />

      {/* Financial Advisor Widget */}
      <FinancialAdvisorWidget
        isVisible={showFinancialAdvisor}
        onClose={() => setShowFinancialAdvisor(false)}
      />

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
              <div
                onClick={() => navigate("/transactions")}
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
                  Transactions
                </span>
              </div>
              <div
                onClick={() => navigate("/bank-accounts")}
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
                  Bank Accounts
                </span>
              </div>
              <div
                onClick={() => setShowFinancialAdvisor(true)}
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
                  Financial Advisor
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
            overflowY: "auto",
            maxHeight: "100vh",
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
              {/* Ticker - Left Side */}
              {!isMobile && <SentimentNewsHeading />}

              <div
                style={{
                  display: "flex",
                  gap: spacing.sm,
                  alignItems: "center",
                  justifyContent: isMobile ? "space-between" : "flex-end",
                  flexWrap: isMobile ? "wrap" : "nowrap",
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
              {/* Wallet View Card */}
              <div
                onMouseEnter={(e) => {
                  setShowCreditRisk(true);
                  e.currentTarget.style.border = `1px solid ${theme.accent}`;
                }}
                onMouseLeave={(e) => {
                  setShowCreditRisk(false);
                  e.currentTarget.style.border = `1px solid ${theme.border}`;
                }}
                style={{
                  background: theme.cardBg,
                  borderRadius: "16px",
                  padding: spacing.lg,
                  border: `1px solid ${theme.border}`,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
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
                  <div
                    style={{
                      flex: 1,
                    }}
                  >
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
                      {paymentUserProfile
                        ? "Your payment app balance"
                        : "A brief of your situation"}
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
                    {paymentUserProfile ? "Active" : "New"}
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
                    {paymentUserProfile
                      ? parseFloat(paymentUserProfile.balance).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )
                      : userProfile?.monthly_income
                        ? parseFloat(
                            userProfile.monthly_income,
                          ).toLocaleString()
                        : "0"}
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
                      $
                      {paymentIncomeExpenses
                        ? parseFloat(
                            paymentIncomeExpenses.income,
                          ).toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })
                        : userProfile?.monthly_income
                          ? parseFloat(
                              userProfile.monthly_income,
                            ).toLocaleString("en-US", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })
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
                      $
                      {paymentIncomeExpenses
                        ? parseFloat(
                            paymentIncomeExpenses.expenses,
                          ).toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })
                        : userProfile?.monthly_expenses
                          ? parseFloat(
                              userProfile.monthly_expenses,
                            ).toLocaleString("en-US", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })
                          : "0"}
                    </span>
                    <span
                      style={{ color: theme.textSecondary, marginLeft: "4px" }}
                    >
                      Expenses
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Transactions Card */}
              <div
                style={{
                  background: theme.cardBg,
                  borderRadius: "16px",
                  padding: spacing.lg,
                  border: `1px solid ${theme.border}`,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontSize: fontSize.sm,
                    fontWeight: "600",
                    color: theme.text,
                    marginBottom: spacing.md,
                  }}
                >
                  Recent Transactions
                </div>

                <div style={{ flex: 1, overflowY: "auto", maxHeight: "300px" }}>
                  {recentTransactions && recentTransactions.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: spacing.sm,
                      }}
                    >
                      {recentTransactions.map((transaction, index) => {
                        const isSent = transaction.type === "sent";

                        return (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: spacing.sm,
                              borderBottom: `1px solid ${theme.border}`,
                              paddingBottom: spacing.sm,
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontSize: fontSize.xs,
                                  color: theme.text,
                                  fontWeight: "500",
                                  marginBottom: "2px",
                                }}
                              >
                                {isSent
                                  ? `To ${transaction.receiver_name || "Unknown"}`
                                  : `From ${transaction.sender_name || "Unknown"}`}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.7rem",
                                  color: theme.textSecondary,
                                }}
                              >
                                {new Date(
                                  transaction.date,
                                ).toLocaleDateString()}
                              </div>
                            </div>
                            <div
                              style={{
                                fontSize: fontSize.xs,
                                fontWeight: "700",
                                color: isSent ? "#ef4444" : "#10b981",
                              }}
                            >
                              {isSent ? "-" : "+"} $
                              {parseFloat(transaction.amount).toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        color: theme.textSecondary,
                        fontSize: fontSize.sm,
                        padding: spacing.md,
                      }}
                    >
                      No transactions yet
                    </div>
                  )}
                </div>
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
