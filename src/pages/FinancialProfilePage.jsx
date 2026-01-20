import { useState } from "react";
import { useNavigate } from "react-router-dom";

function FinancialProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    monthly_income: "",
    monthly_expenses: "",
    risk_tolerance: "medium",
    financial_goal: "",
    total_debt: "",
    credit_history: "good",
    employment_status: "employed",
    watched_stocks: "",
    preferred_news_sources: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required. Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/users/financial_profile_update/",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            monthly_income: parseFloat(formData.monthly_income) || 0,
            monthly_expenses: parseFloat(formData.monthly_expenses) || 0,
            risk_tolerance: formData.risk_tolerance,
            financial_goal: formData.financial_goal,
            total_debt: parseFloat(formData.total_debt) || 0,
            credit_history: formData.credit_history,
            employment_status: formData.employment_status,
            watched_stocks: formData.watched_stocks,
            preferred_news_sources: formData.preferred_news_sources,
          }),
        },
      );

      if (response.ok) {
        // Mark profile as complete
        localStorage.setItem("profileComplete", "true");
        navigate("/dashboard");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update financial profile");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "white",
              marginBottom: "0.5rem",
            }}
          >
            Complete Your Financial Profile
          </h1>
          <p style={{ color: "rgba(255, 255, 255, 0.8)" }}>
            Help us personalize your experience
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.5)",
              color: "#fca5a5",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            {/* Monthly Income */}
            <div>
              <label
                htmlFor="monthly_income"
                style={{
                  display: "block",
                  color: "white",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Monthly Income ($) *
              </label>
              <input
                type="number"
                id="monthly_income"
                name="monthly_income"
                value={formData.monthly_income}
                onChange={handleChange}
                placeholder="5000"
                min="0"
                step="0.01"
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  fontSize: "1rem",
                }}
              />
            </div>

            {/* Monthly Expenses */}
            <div>
              <label
                htmlFor="monthly_expenses"
                style={{
                  display: "block",
                  color: "white",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Monthly Expenses ($) *
              </label>
              <input
                type="number"
                id="monthly_expenses"
                name="monthly_expenses"
                value={formData.monthly_expenses}
                onChange={handleChange}
                placeholder="2000"
                min="0"
                step="0.01"
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  fontSize: "1rem",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            {/* Risk Tolerance */}
            <div>
              <label
                htmlFor="risk_tolerance"
                style={{
                  display: "block",
                  color: "white",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Risk Tolerance *
              </label>
              <select
                id="risk_tolerance"
                name="risk_tolerance"
                value={formData.risk_tolerance}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  fontSize: "1rem",
                }}
              >
                <option
                  value="low"
                  style={{ background: "#4a5568", color: "white" }}
                >
                  Low
                </option>
                <option
                  value="medium"
                  style={{ background: "#4a5568", color: "white" }}
                >
                  Medium
                </option>
                <option
                  value="high"
                  style={{ background: "#4a5568", color: "white" }}
                >
                  High
                </option>
              </select>
            </div>

            {/* Total Debt */}
            <div>
              <label
                htmlFor="total_debt"
                style={{
                  display: "block",
                  color: "white",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Total Debt ($)
              </label>
              <input
                type="number"
                id="total_debt"
                name="total_debt"
                value={formData.total_debt}
                onChange={handleChange}
                placeholder="10000"
                min="0"
                step="0.01"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  fontSize: "1rem",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            {/* Credit History */}
            <div>
              <label
                htmlFor="credit_history"
                style={{
                  display: "block",
                  color: "white",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Credit History *
              </label>
              <select
                id="credit_history"
                name="credit_history"
                value={formData.credit_history}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  fontSize: "1rem",
                }}
              >
                <option
                  value="excellent"
                  style={{ background: "#4a5568", color: "white" }}
                >
                  Excellent
                </option>
                <option
                  value="good"
                  style={{ background: "#4a5568", color: "white" }}
                >
                  Good
                </option>
                <option
                  value="fair"
                  style={{ background: "#4a5568", color: "white" }}
                >
                  Fair
                </option>
                <option
                  value="poor"
                  style={{ background: "#4a5568", color: "white" }}
                >
                  Poor
                </option>
              </select>
            </div>

            {/* Employment Status */}
            <div>
              <label
                htmlFor="employment_status"
                style={{
                  display: "block",
                  color: "white",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Employment Status *
              </label>
              <select
                id="employment_status"
                name="employment_status"
                value={formData.employment_status}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  fontSize: "1rem",
                }}
              >
                <option
                  value="employed"
                  style={{ background: "#4a5568", color: "white" }}
                >
                  Employed
                </option>
                <option
                  value="self-employed"
                  style={{ background: "#4a5568", color: "white" }}
                >
                  Self-Employed
                </option>
                <option
                  value="unemployed"
                  style={{ background: "#4a5568", color: "white" }}
                >
                  Unemployed
                </option>
                <option
                  value="student"
                  style={{ background: "#4a5568", color: "white" }}
                >
                  Student
                </option>
                <option
                  value="retired"
                  style={{ background: "#4a5568", color: "white" }}
                >
                  Retired
                </option>
              </select>
            </div>
          </div>

          {/* Financial Goal */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="financial_goal"
              style={{
                display: "block",
                color: "white",
                marginBottom: "0.5rem",
                fontWeight: "600",
              }}
            >
              Financial Goal *
            </label>
            <input
              type="text"
              id="financial_goal"
              name="financial_goal"
              value={formData.financial_goal}
              onChange={handleChange}
              placeholder="Retirement planning, Buying a house, etc."
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                fontSize: "1rem",
              }}
            />
          </div>

          {/* Watched Stocks */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="watched_stocks"
              style={{
                display: "block",
                color: "white",
                marginBottom: "0.5rem",
                fontWeight: "600",
              }}
            >
              Watched Stocks (comma-separated)
            </label>
            <input
              type="text"
              id="watched_stocks"
              name="watched_stocks"
              value={formData.watched_stocks}
              onChange={handleChange}
              placeholder="AAPL,GOOGL,MSFT"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                fontSize: "1rem",
              }}
            />
          </div>

          {/* Preferred News Sources */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="preferred_news_sources"
              style={{
                display: "block",
                color: "white",
                marginBottom: "0.5rem",
                fontWeight: "600",
              }}
            >
              Preferred News Sources (comma-separated)
            </label>
            <input
              type="text"
              id="preferred_news_sources"
              name="preferred_news_sources"
              value={formData.preferred_news_sources}
              onChange={handleChange}
              placeholder="Reuters,Bloomberg,CNBC"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                fontSize: "1rem",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "1rem",
              background: loading
                ? "#6b7280"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "transform 0.2s",
            }}
          >
            {loading ? "Saving..." : "Complete Profile & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FinancialProfilePage;
