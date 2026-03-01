import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "../store/themeSlice";
import Header from "../components/Header";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function TransactionPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [transactions, setTransactions] = useState([]);
  const [paymentProfile, setPaymentProfile] = useState(null);
  const [filterType, setFilterType] = useState("all"); // all, sent, received
  const [sortBy, setSortBy] = useState("date-desc"); // date-desc, date-asc, amount-desc, amount-asc
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Theme configuration
  const spacing = {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
  };

  const fontSize = {
    xs: "0.875rem",
    sm: "1rem",
    md: "1.125rem",
    lg: "1.5rem",
    xl: "2rem",
  };

  const theme = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    text: darkMode ? "#f1f5f9" : "#1f2937",
    textSecondary: darkMode ? "#94a3b8" : "#6b7280",
    cardBg: darkMode ? "#1e293b" : "white",
    cardBorder: darkMode
      ? "rgba(148, 163, 184, 0.1)"
      : "rgba(226, 232, 240, 0.8)",
    accent: darkMode ? "#818cf8" : "#6366f1",
    accentHover: darkMode ? "#a5b4fc" : "#4f46e5",
    success: "#10b981",
    danger: "#ef4444",
    shadow: darkMode
      ? "0 4px 12px rgba(0,0,0,0.3)"
      : "0 4px 12px rgba(0,0,0,0.08)",
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchUserProfile();
    fetchPaymentProfile();
    fetchTransactions();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
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
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchPaymentProfile = async () => {
    try {
      const token = localStorage.getItem("token");
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
        setPaymentProfile(data.data);
      }
    } catch (error) {
      console.error("Error fetching payment profile:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/v1/transactions/connected-bank`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        // Handle paginated response
        const txns = data.results || data.data || data || [];
        setTransactions(Array.isArray(txns) ? txns : []);
        setError(null);
      } else {
        setError("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Error loading transactions");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort transactions
  const getFilteredTransactions = () => {
    let filtered = transactions;

    // Filter by type
    if (filterType === "sent") {
      filtered = filtered.filter((t) => t.type === "sent");
    } else if (filterType === "received") {
      filtered = filtered.filter((t) => t.type === "received");
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.sender_name?.toLowerCase().includes(query) ||
          t.receiver_name?.toLowerCase().includes(query) ||
          t.sender_upi_id?.toLowerCase().includes(query) ||
          t.receiver_upi_id?.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query),
      );
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case "date-desc":
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "date-asc":
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "amount-desc":
        sorted.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
        break;
      case "amount-asc":
        sorted.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
        break;
      default:
        break;
    }

    return sorted;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const filteredTransactions = getFilteredTransactions();
  const totalAmount = filteredTransactions.reduce(
    (sum, t) => sum + parseFloat(t.amount),
    0,
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        fontFamily: "'Roboto Mono', monospace",
      }}
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: spacing.lg,
          paddingBottom: "5rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: spacing.xl,
          }}
        >
          <h1
            style={{
              fontSize: fontSize.xl,
              fontWeight: "700",
              color: theme.text,
              marginBottom: spacing.sm,
            }}
          >
            Transactions
          </h1>
          <p
            style={{
              color: theme.textSecondary,
              fontSize: fontSize.sm,
            }}
          >
            {paymentProfile ? (
              <>
                All transactions for <strong>{paymentProfile.fullName}</strong>
              </>
            ) : (
              "Transaction history from all your connected accounts"
            )}
          </p>
        </div>

        {/* Transactions List */}
        <div
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <div
              style={{
                padding: spacing.xl,
                textAlign: "center",
                color: theme.textSecondary,
              }}
            >
              Loading transactions...
            </div>
          ) : error ? (
            <div
              style={{
                padding: spacing.xl,
                textAlign: "center",
                color: theme.danger,
              }}
            >
              {error}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div
              style={{
                padding: spacing.xl,
                textAlign: "center",
                color: theme.textSecondary,
              }}
            >
              No transactions found
            </div>
          ) : isMobile ? (
            // Mobile Card View
            <div style={{ padding: spacing.md }}>
              {filteredTransactions.map((txn, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: spacing.md,
                    padding: spacing.md,
                    background: theme.bg,
                    borderRadius: "8px",
                    border: `1px solid ${theme.cardBorder}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: spacing.sm,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: "600",
                          color: theme.text,
                          marginBottom: spacing.xs,
                        }}
                      >
                        {txn.type === "sent" ? "To:" : "From:"}
                      </div>
                      <div
                        style={{
                          color: theme.text,
                          fontSize: fontSize.sm,
                          marginBottom: spacing.xs,
                        }}
                      >
                        {txn.type === "sent"
                          ? txn.receiver_name
                          : txn.sender_name}
                      </div>
                      <div
                        style={{
                          color: theme.textSecondary,
                          fontSize: fontSize.xs,
                        }}
                      >
                        <span style={{ fontWeight: "500", marginRight: "4px" }}>
                          UPI ID:
                        </span>
                        {txn.type === "sent"
                          ? txn.receiver_upi_id
                          : txn.sender_upi_id}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: fontSize.md,
                          fontWeight: "700",
                          color:
                            txn.type === "sent" ? theme.danger : theme.success,
                          marginBottom: spacing.xs,
                        }}
                      >
                        {txn.type === "sent" ? "-" : "+"}$
                        {formatAmount(txn.amount)}
                      </div>
                      <div
                        style={{
                          color: theme.textSecondary,
                          fontSize: fontSize.xs,
                        }}
                      >
                        {formatDate(txn.date)}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: fontSize.xs,
                      color: theme.textSecondary,
                      marginBottom: spacing.sm,
                    }}
                  >
                    {txn.description && (
                      <>
                        <strong>Note:</strong> {txn.description}
                      </>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: spacing.sm,
                      fontSize: fontSize.xs,
                      color: theme.textSecondary,
                    }}
                  >
                    <span>
                      Status:{" "}
                      <strong
                        style={{
                          color:
                            txn.status === "success"
                              ? theme.success
                              : txn.status === "pending"
                                ? "#f59e0b"
                                : theme.danger,
                        }}
                      >
                        {txn.status}
                      </strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Desktop Table View
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: fontSize.sm,
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: theme.bg,
                      borderBottom: `2px solid ${theme.cardBorder}`,
                    }}
                  >
                    <th
                      style={{
                        padding: spacing.md,
                        textAlign: "left",
                        color: theme.textSecondary,
                        fontWeight: "600",
                      }}
                    >
                      Type
                    </th>
                    <th
                      style={{
                        padding: spacing.md,
                        textAlign: "left",
                        color: theme.textSecondary,
                        fontWeight: "600",
                      }}
                    >
                      {" "}
                      From / To
                    </th>
                    <th
                      style={{
                        padding: spacing.md,
                        textAlign: "left",
                        color: theme.textSecondary,
                        fontWeight: "600",
                      }}
                    >
                      Sender UPI ID
                    </th>
                    <th
                      style={{
                        padding: spacing.md,
                        textAlign: "left",
                        color: theme.textSecondary,
                        fontWeight: "600",
                      }}
                    >
                      Receiver UPI ID
                    </th>
                    <th
                      style={{
                        padding: spacing.md,
                        textAlign: "right",
                        color: theme.textSecondary,
                        fontWeight: "600",
                      }}
                    >
                      Amount
                    </th>
                    <th
                      style={{
                        padding: spacing.md,
                        textAlign: "left",
                        color: theme.textSecondary,
                        fontWeight: "600",
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: spacing.md,
                        textAlign: "left",
                        color: theme.textSecondary,
                        fontWeight: "600",
                      }}
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((txn, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: `1px solid ${theme.cardBorder}`,
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = theme.bg;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <td
                        style={{
                          padding: spacing.md,
                          color: theme.text,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: `${spacing.xs} ${spacing.sm}`,
                            borderRadius: "4px",
                            backgroundColor:
                              txn.type === "sent"
                                ? "rgba(239, 68, 68, 0.1)"
                                : "rgba(16, 185, 129, 0.1)",
                            color:
                              txn.type === "sent"
                                ? theme.danger
                                : theme.success,
                            fontWeight: "600",
                            fontSize: fontSize.xs,
                            textTransform: "uppercase",
                          }}
                        >
                          {txn.type}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: spacing.md,
                          color: theme.text,
                        }}
                      >
                        {txn.type === "sent"
                          ? txn.receiver_name
                          : txn.sender_name}
                      </td>
                      <td
                        style={{
                          padding: spacing.md,
                          color: theme.textSecondary,
                          fontFamily: "monospace",
                          fontSize: fontSize.xs,
                        }}
                      >
                        {txn.sender_upi_id}
                      </td>
                      <td
                        style={{
                          padding: spacing.md,
                          color: theme.textSecondary,
                          fontFamily: "monospace",
                          fontSize: fontSize.xs,
                        }}
                      >
                        {txn.receiver_upi_id}
                      </td>
                      <td
                        style={{
                          padding: spacing.md,
                          textAlign: "right",
                          color:
                            txn.type === "sent" ? theme.danger : theme.success,
                          fontWeight: "600",
                        }}
                      >
                        {txn.type === "sent" ? "-" : "+"}$
                        {formatAmount(txn.amount)}
                      </td>
                      <td
                        style={{
                          padding: spacing.md,
                          color:
                            txn.status === "success"
                              ? theme.success
                              : txn.status === "pending"
                                ? "#f59e0b"
                                : theme.danger,
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        {txn.status}
                      </td>
                      <td
                        style={{
                          padding: spacing.md,
                          color: theme.textSecondary,
                        }}
                      >
                        {formatDate(txn.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionPage;
