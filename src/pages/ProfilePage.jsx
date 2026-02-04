import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setUserProfile,
  setLoading,
  setError,
  updateUserProfileField,
} from "../store/userSlice";
import Header from "../components/Header";

function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const userProfile = useSelector((state) => state.user.profile);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      dispatch(setLoading(true));

      try {
        const response = await fetch(
          "http://localhost:8000/api/users/profile/",
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
          dispatch(setUserProfile(data));
        } else {
          dispatch(setError("Failed to fetch profile"));
        }
      } catch (err) {
        dispatch(setError("Network error. Please try again."));
      }
    };

    // Only fetch if profile is not already in Redux
    if (!userProfile) {
      fetchUserProfile();
    }
  }, [navigate, dispatch, userProfile]);

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
    xxl: "3rem",
  };

  const theme = {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    text: darkMode ? "#f1f5f9" : "#1f2937",
    textSecondary: darkMode ? "#94a3b8" : "#6b7280",
    cardBg: darkMode ? "#1e293b40" : "#ffffff20",
    cardBgAlt: darkMode ? "#33415510" : "#f1f5f910",
    accent: darkMode ? "#818cf8" : "#6366f1",
    success: darkMode ? "#34d399" : "#10b981",
    warning: darkMode ? "#fbbf24" : "#f59e0b",
    danger: darkMode ? "#f87171" : "#ef4444",
    shadow: darkMode
      ? "0 4px 12px rgba(0,0,0,0.3)"
      : "0 4px 12px rgba(0,0,0,0.08)",
    border: darkMode ? "rgba(148, 163, 184, 0.1)" : "rgba(226, 232, 240, 0.8)",
  };

  const handleEditClick = (fieldName, currentValue) => {
    setEditingField(fieldName);
    setEditValue(currentValue || "");
  };

  const handleSaveField = async (fieldName) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const updateData = { ...userProfile, [fieldName]: editValue };

      const response = await fetch(
        "http://localhost:8000/api/users/financial_profile_update/",
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        },
      );

      if (response.ok) {
        const data = await response.json();
        dispatch(setUserProfile(data));
        setEditingField(null);
        setEditValue("");
      } else {
        dispatch(setError("Failed to update profile"));
      }
    } catch (err) {
      dispatch(setError("Network error. Please try again."));
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const getFieldOptions = (fieldName) => {
    const options = {
      employment_status: [
        { value: "employed", label: "Employed" },
        { value: "self-employed", label: "Self-Employed" },
        { value: "unemployed", label: "Unemployed" },
        { value: "student", label: "Student" },
        { value: "retired", label: "Retired" },
      ],
      risk_tolerance: [
        { value: "low", label: "Low - Conservative approach" },
        { value: "medium", label: "Medium - Balanced strategy" },
        { value: "high", label: "High - Aggressive growth" },
      ],
      credit_history: [
        { value: "excellent", label: "Excellent (750+)" },
        { value: "good", label: "Good (700-749)" },
        { value: "fair", label: "Fair (650-699)" },
        { value: "poor", label: "Poor (<650)" },
      ],
    };
    return options[fieldName] || null;
  };

  const InfoCard = ({
    label,
    value,
    icon,
    fieldName,
    editable = true,
    rawValue,
  }) => {
    const isEditing = editingField === fieldName;
    const fieldOptions = getFieldOptions(fieldName);

    return (
      <div
        style={{
          background: theme.cardBgAlt,
          borderRadius: "12px",
          padding: spacing.md,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: spacing.sm,
            marginBottom: spacing.xs,
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: spacing.sm }}
          >
            {icon && <span style={{ fontSize: "1.25rem" }}>{icon}</span>}
            <span
              style={{
                fontSize: fontSize.xs,
                color: theme.textSecondary,
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {label}
            </span>
          </div>
          {editable && !isEditing && (
            <button
              onClick={() =>
                handleEditClick(
                  fieldName,
                  rawValue !== undefined ? rawValue : value,
                )
              }
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: theme.textSecondary,
                padding: "4px",
                display: "flex",
                alignItems: "center",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.textSecondary;
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
        </div>
        {isEditing ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: spacing.xs,
              marginTop: spacing.xs,
            }}
          >
            {fieldOptions ? (
              <select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: fontSize.sm,
                  fontWeight: "500",
                  color: theme.text,
                  background: theme.cardBg,
                  border: `2px solid ${theme.accent}`,
                  borderRadius: "8px",
                  fontFamily: "'Roboto Mono', monospace",
                  outline: "none",
                  cursor: "pointer",
                  minHeight: "42px",
                }}
              >
                {fieldOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: fontSize.sm,
                  fontWeight: "600",
                  color: theme.text,
                  background: theme.cardBg,
                  border: `2px solid ${theme.accent}`,
                  borderRadius: "8px",
                  fontFamily: "'Roboto Mono', monospace",
                  outline: "none",
                  minHeight: "42px",
                }}
              />
            )}
            <div style={{ display: "flex", gap: spacing.xs }}>
              <button
                onClick={() => handleSaveField(fieldName)}
                style={{
                  padding: "8px 16px",
                  background: theme.success,
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: fontSize.xs,
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                style={{
                  padding: "8px 16px",
                  background: theme.danger,
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: fontSize.xs,
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              fontSize: fontSize.md,
              fontWeight: "600",
              color: theme.text,
              fontFamily: "'Roboto Mono', monospace",
            }}
          >
            {value || "Not set"}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <div
          style={{
            minHeight: "100vh",
            background: theme.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Roboto Mono', monospace",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: fontSize.xl,
                color: theme.text,
                marginBottom: spacing.md,
              }}
            >
              Loading profile...
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div
          style={{
            minHeight: "100vh",
            background: theme.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Roboto Mono', monospace",
          }}
        >
          <div
            style={{
              background: theme.cardBg,
              borderRadius: "16px",
              padding: spacing.xl,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: fontSize.xl,
                color: theme.danger,
                marginBottom: spacing.md,
              }}
            >
              {error}
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                background: theme.accent,
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: fontSize.sm,
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: "100vh",
          background: theme.bg,
          padding: spacing.lg,
          paddingTop: "6rem",
          fontFamily: "'Roboto Mono', monospace",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Bio Section */}
          {userProfile?.bio && (
            <div
              style={{
                background: theme.cardBg,
                borderRadius: "16px",
                padding: spacing.lg,
                marginBottom: spacing.lg,
                boxShadow: theme.shadow,
              }}
            >
              <h2
                style={{
                  fontSize: fontSize.lg,
                  fontWeight: "700",
                  color: theme.text,
                  marginBottom: spacing.md,
                }}
              >
                About
              </h2>
              <p
                style={{
                  fontSize: fontSize.sm,
                  color: theme.textSecondary,
                  lineHeight: "1.6",
                }}
              >
                {userProfile.bio}
              </p>
            </div>
          )}

          {/* Personal Information */}
          <div
            style={{
              background: theme.cardBg,
              borderRadius: "16px",
              padding: spacing.lg,
              marginBottom: spacing.lg,
              boxShadow: theme.shadow,
            }}
          >
            <h2
              style={{
                fontSize: fontSize.lg,
                fontWeight: "700",
                color: theme.text,
                marginBottom: spacing.md,
              }}
            >
              Personal Information
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: spacing.md,
              }}
            >
              <InfoCard
                label="Email"
                value={userProfile?.email}
                editable={false}
              />
              <InfoCard
                label="Employment Status"
                value={
                  userProfile?.employment_status
                    ? userProfile.employment_status.charAt(0).toUpperCase() +
                      userProfile.employment_status.slice(1)
                    : null
                }
                rawValue={userProfile?.employment_status}
                fieldName="employment_status"
              />
            </div>
          </div>

          {/* Financial Information */}
          <div
            style={{
              background: theme.cardBg,
              borderRadius: "16px",
              padding: spacing.lg,
              marginBottom: spacing.lg,
              boxShadow: theme.shadow,
            }}
          >
            <h2
              style={{
                fontSize: fontSize.lg,
                fontWeight: "700",
                color: theme.text,
                marginBottom: spacing.md,
              }}
            >
              Financial Profile
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: spacing.md,
              }}
            >
              <InfoCard
                label="Monthly Income"
                value={
                  userProfile?.monthly_income
                    ? `$${parseFloat(userProfile.monthly_income).toLocaleString()}`
                    : null
                }
                fieldName="monthly_income"
              />
              <InfoCard
                label="Monthly Expenses"
                value={
                  userProfile?.monthly_expenses
                    ? `$${parseFloat(userProfile.monthly_expenses).toLocaleString()}`
                    : null
                }
                fieldName="monthly_expenses"
              />
              <InfoCard
                label="Total Debt"
                value={
                  userProfile?.total_debt
                    ? `$${parseFloat(userProfile.total_debt).toLocaleString()}`
                    : null
                }
                fieldName="total_debt"
              />
              <InfoCard
                label="Risk Tolerance"
                value={
                  userProfile?.risk_tolerance
                    ? userProfile.risk_tolerance.charAt(0).toUpperCase() +
                      userProfile.risk_tolerance.slice(1)
                    : null
                }
                rawValue={userProfile?.risk_tolerance}
                fieldName="risk_tolerance"
              />
              <InfoCard
                label="Credit History"
                value={
                  userProfile?.credit_history
                    ? userProfile.credit_history.charAt(0).toUpperCase() +
                      userProfile.credit_history.slice(1)
                    : null
                }
                rawValue={userProfile?.credit_history}
                fieldName="credit_history"
              />
              <InfoCard
                label="Financial Goal"
                value={userProfile?.financial_goal}
                fieldName="financial_goal"
              />
            </div>
          </div>

          {/* Investment Preferences */}
          <div
            style={{
              background: theme.cardBg,
              borderRadius: "16px",
              padding: spacing.lg,
              marginBottom: spacing.lg,
              boxShadow: theme.shadow,
            }}
          >
            <h2
              style={{
                fontSize: fontSize.lg,
                fontWeight: "700",
                color: theme.text,
                marginBottom: spacing.md,
              }}
            >
              Investment & Preferences
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: spacing.md,
              }}
            >
              <InfoCard
                label="Watched Stocks"
                value={userProfile?.watched_stocks}
                fieldName="watched_stocks"
              />
              <InfoCard
                label="Preferred News Sources"
                value={userProfile?.preferred_news_sources}
                fieldName="preferred_news_sources"
              />
            </div>
          </div>

          {/* Transaction Statistics */}
          {(userProfile?.average_transaction_amount ||
            userProfile?.transaction_frequency) && (
            <div
              style={{
                background: theme.cardBg,
                borderRadius: "16px",
                padding: spacing.lg,
                marginBottom: spacing.lg,
                boxShadow: theme.shadow,
              }}
            >
              <h2
                style={{
                  fontSize: fontSize.lg,
                  fontWeight: "700",
                  color: theme.text,
                  marginBottom: spacing.md,
                }}
              >
                Transaction Statistics
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: spacing.md,
                }}
              >
                <InfoCard
                  label="Average Transaction"
                  value={
                    userProfile?.average_transaction_amount
                      ? `$${parseFloat(userProfile.average_transaction_amount).toLocaleString()}`
                      : null
                  }
                  fieldName="average_transaction_amount"
                />
                <InfoCard
                  label="Transaction Frequency"
                  value={userProfile?.transaction_frequency}
                  fieldName="transaction_frequency"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: spacing.md,
              justifyContent: "center",
              marginTop: spacing.xl,
            }}
          >
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                background: theme.accent,
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: fontSize.sm,
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(99, 102, 241, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
