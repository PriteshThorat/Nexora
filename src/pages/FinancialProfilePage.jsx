import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";

function FinancialProfilePage() {
  const navigate = useNavigate();
  const darkMode = useSelector((state) => state.theme.darkMode);
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
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-slate-900 pt-8 pb-16 font-['Roboto_Mono',monospace] transition-colors">
        <div className="max-w-4xl mx-auto px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-block bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🚀 02 Financial Profile Setup
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-slate-100 mb-3 tracking-tight">
              Let's Set Up Your Financial Profile
            </h1>
            <p className="text-gray-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              You don't need to finish everything at once, so you can pick up
              right where you left off next time.
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-10 shadow-xl border border-slate-200 dark:border-slate-700 transition-colors">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-8">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Financial Overview Section */}
              <div className="mb-10">
                <h2 className="text-indigo-600 dark:text-indigo-400 text-xl font-semibold mb-6">
                  Financial Overview
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  {/* Monthly Income */}
                  <div>
                    <label
                      htmlFor="monthly_income"
                      className="block text-gray-800 dark:text-slate-100 mb-2 font-medium text-sm"
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
                      className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  {/* Monthly Expenses */}
                  <div>
                    <label
                      htmlFor="monthly_expenses"
                      className="block text-gray-800 dark:text-slate-100 mb-2 font-medium text-sm"
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
                      className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  {/* Total Debt */}
                  <div>
                    <label
                      htmlFor="total_debt"
                      className="block text-gray-800 dark:text-slate-100 mb-2 font-medium text-sm"
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
                      className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  {/* Risk Tolerance */}
                  <div>
                    <label
                      htmlFor="risk_tolerance"
                      className="block text-gray-800 dark:text-slate-100 mb-2 font-medium text-sm"
                    >
                      Risk Tolerance *
                    </label>
                    <select
                      id="risk_tolerance"
                      name="risk_tolerance"
                      value={formData.risk_tolerance}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 cursor-pointer transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="low">Low - Conservative approach</option>
                      <option value="medium">Medium - Balanced strategy</option>
                      <option value="high">High - Aggressive growth</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="mb-10">
                <h2 className="text-indigo-600 dark:text-indigo-400 text-xl font-semibold mb-6">
                  Personal Information
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  {/* Credit History */}
                  <div>
                    <label
                      htmlFor="credit_history"
                      className="block text-gray-800 dark:text-slate-100 mb-2 font-medium text-sm"
                    >
                      Credit History *
                    </label>
                    <select
                      id="credit_history"
                      name="credit_history"
                      value={formData.credit_history}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 cursor-pointer transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="excellent">Excellent (750+)</option>
                      <option value="good">Good (700-749)</option>
                      <option value="fair">Fair (650-699)</option>
                      <option value="poor">Poor (&lt;650)</option>
                    </select>
                  </div>

                  {/* Employment Status */}
                  <div>
                    <label
                      htmlFor="employment_status"
                      className="block text-gray-800 dark:text-slate-100 mb-2 font-medium text-sm"
                    >
                      Employment Status *
                    </label>
                    <select
                      id="employment_status"
                      name="employment_status"
                      value={formData.employment_status}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 cursor-pointer transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="employed">Employed</option>
                      <option value="self-employed">Self-Employed</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="student">Student</option>
                      <option value="retired">Retired</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Goals & Preferences Section */}
              <div className="mb-10">
                <h2 className="text-indigo-600 dark:text-indigo-400 text-xl font-semibold mb-6">
                  Goals & Preferences
                </h2>

                {/* Financial Goal */}
                <div className="mb-6">
                  <label
                    htmlFor="financial_goal"
                    className="block text-gray-800 dark:text-slate-100 mb-2 font-medium text-sm"
                  >
                    Financial Goal *
                  </label>
                  <input
                    type="text"
                    id="financial_goal"
                    name="financial_goal"
                    value={formData.financial_goal}
                    onChange={handleChange}
                    placeholder="E.g., Retirement planning, Buying a house, Building emergency fund"
                    required
                    className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Watched Stocks */}
                <div className="mb-6">
                  <label
                    htmlFor="watched_stocks"
                    className="block text-gray-800 dark:text-slate-100 mb-2 font-medium text-sm"
                  >
                    Watched Stocks
                    <span className="text-slate-500 dark:text-slate-400 text-xs ml-2">
                      (comma-separated symbols)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="watched_stocks"
                    name="watched_stocks"
                    value={formData.watched_stocks}
                    onChange={handleChange}
                    placeholder="AAPL, GOOGL, MSFT, TSLA"
                    className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Preferred News Sources */}
                <div>
                  <label
                    htmlFor="preferred_news_sources"
                    className="block text-gray-800 dark:text-slate-100 mb-2 font-medium text-sm"
                  >
                    Preferred News Sources
                    <span className="text-slate-500 dark:text-slate-400 text-xs ml-2">
                      (comma-separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="preferred_news_sources"
                    name="preferred_news_sources"
                    value={formData.preferred_news_sources}
                    onChange={handleChange}
                    placeholder="Reuters, Bloomberg, CNBC, Financial Times"
                    className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end pt-6 border-t border-slate-300 dark:border-slate-600">
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? "#94a3b8" : "rgb(102, 126, 234)",
                  }}
                  className={`px-8 py-3 text-white rounded-lg font-semibold transition-all ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/50"
                  }`}
                >
                  {loading
                    ? "Saving Profile..."
                    : "Complete Profile & Continue"}
                </button>
              </div>
            </form>
          </div>

          {/* Info Card */}
          <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-xl flex items-start gap-4">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
                Why do we need this information?
              </h3>
              <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">
                Your financial profile helps our AI provide personalized
                recommendations, accurate predictions, and tailored insights
                specific to your financial situation and goals. All data is
                encrypted and kept secure.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default FinancialProfilePage;
