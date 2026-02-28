import { useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function BankConnectionForm({ onSuccess, darkMode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email_id: "",
    pin: "",
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
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/bank-accounts/connect`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            email_id: formData.email_id,
            pin: formData.pin,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setFormData({ email_id: "", pin: "" });
        onSuccess(data);
      } else {
        setError(data.message || "Failed to connect bank account");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl border transition-colors ${
        darkMode
          ? "bg-slate-800 border-slate-700"
          : "bg-gray-50 border-slate-200"
      }`}
    >
      {error && (
        <div
          className={`border p-4 rounded-lg mb-8 ${
            darkMode
              ? "bg-red-900/20 border-red-800/30 text-red-400"
              : "bg-red-50 border-red-200 text-red-600"
          }`}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Email ID */}
          <div>
            <label
              htmlFor="email_id"
              className={`block font-medium text-sm mb-2 ${darkMode ? "text-slate-100" : "text-gray-800"}`}
            >
              Email ID *
            </label>
            <input
              type="email"
              id="email_id"
              name="email_id"
              value={formData.email_id}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className={`w-full p-3 rounded-lg border ${darkMode ? "border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500" : "border-slate-300 bg-white text-gray-800 placeholder-slate-400"} transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20`}
            />
          </div>

          {/* PIN */}
          <div>
            <label
              htmlFor="pin"
              className={`block font-medium text-sm mb-2 ${darkMode ? "text-slate-100" : "text-gray-800"}`}
            >
              PIN *
            </label>
            <input
              type="password"
              id="pin"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              placeholder="••••••"
              required
              maxLength="6"
              pattern="[0-9]*"
              className={`w-full p-3 rounded-lg border ${darkMode ? "border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500" : "border-slate-300 bg-white text-gray-800 placeholder-slate-400"} transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20`}
            />
            <p
              className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              Enter your 4-6 digit PIN
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-8 px-8 py-3 text-white font-semibold rounded-lg transition-all ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/50"
          }`}
          style={{
            backgroundColor: loading ? "#94a3b8" : "rgb(102, 126, 234)",
          }}
        >
          {loading ? "Connecting..." : "Connect Bank Account"}
        </button>
      </form>
    </div>
  );
}

export default BankConnectionForm;
