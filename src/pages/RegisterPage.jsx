import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signup");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/register/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // Registration successful
      console.log("Registration successful:", response.data);

      // Redirect to login page
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data) {
        // Format error messages from backend
        const errorMessages = Object.entries(err.response.data)
          .map(
            ([key, value]) =>
              `${key}: ${Array.isArray(value) ? value.join(", ") : value}`,
          )
          .join(" | ");
        setError(errorMessages);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen bg-gray-50"
      style={{ fontFamily: "'Roboto Mono', monospace" }}
    >
      {/* Left Side - Register Form */}
      <div className="flex-1 flex items-start justify-center p-8 pt-16 bg-white">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="mb-12">
            <div className="mb-8">
              <span className="text-3xl font-bold" style={{ color: "#667eea" }}>
                Nexora
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Create Your Account
            </h1>
            <p className="text-gray-600 text-center">
              Start your financial journey with Nexora today.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200 justify-center">
            <button
              onClick={() => {
                setActiveTab("signin");
                navigate("/login");
              }}
              className="pb-3 px-1 font-medium transition-colors relative"
              style={{
                color: activeTab === "signin" ? "#667eea" : "#6b7280",
              }}
              onMouseEnter={(e) =>
                activeTab !== "signin" &&
                (e.currentTarget.style.color = "#667eea")
              }
              onMouseLeave={(e) =>
                activeTab !== "signin" &&
                (e.currentTarget.style.color = "#6b7280")
              }
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className="pb-3 px-1 font-medium transition-colors relative"
              style={{
                color: activeTab === "signup" ? "#667eea" : "#6b7280",
              }}
            >
              Sign Up
              {activeTab === "signup" && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: "#667eea" }}
                ></div>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="rounded-lg p-4 mb-6 text-sm leading-relaxed"
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FCA5A5",
                color: "#991B1B",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label
                htmlFor="register-username"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z"
                      fill="#9CA3AF"
                    />
                    <path
                      d="M10 12.5C5.16667 12.5 1.25 14.4583 1.25 16.875V20H18.75V16.875C18.75 14.4583 14.8333 12.5 10 12.5Z"
                      fill="#9CA3AF"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="register-username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent text-gray-900 placeholder-gray-400 text-base"
                  style={{
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "2px solid #667eea";
                    e.currentTarget.style.borderColor = "#667eea";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "none";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 6.66669L9.0755 11.0504C9.63533 11.4236 10.3647 11.4236 10.9245 11.0504L17.5 6.66669M4.16667 15.8334H15.8333C16.7538 15.8334 17.5 15.0872 17.5 14.1667V5.83335C17.5 4.91288 16.7538 4.16669 15.8333 4.16669H4.16667C3.24619 4.16669 2.5 4.91288 2.5 5.83335V14.1667C2.5 15.0872 3.24619 15.8334 4.16667 15.8334Z"
                      stroke="#9CA3AF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent text-gray-900 placeholder-gray-400 text-base"
                  style={{
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "2px solid #667eea";
                    e.currentTarget.style.borderColor = "#667eea";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "none";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                />
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  autoComplete="given-name"
                  required
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent text-gray-900 placeholder-gray-400 text-base"
                  style={{
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "2px solid #667eea";
                    e.currentTarget.style.borderColor = "#667eea";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "none";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  autoComplete="family-name"
                  required
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent text-gray-900 placeholder-gray-400 text-base"
                  style={{
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "2px solid #667eea";
                    e.currentTarget.style.borderColor = "#667eea";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "none";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="register-password"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.83333 9.16669V6.66669C5.83333 4.36548 7.69881 2.50002 10 2.50002C12.3012 2.50002 14.1667 4.36548 14.1667 6.66669V9.16669M10 11.6667V13.3334M6.5 17.5H13.5C14.4205 17.5 15.1667 16.7538 15.1667 15.8334V10.8334C15.1667 9.91288 14.4205 9.16669 13.5 9.16669H6.5C5.57953 9.16669 4.83333 9.91288 4.83333 10.8334V15.8334C4.83333 16.7538 5.57953 17.5 6.5 17.5Z"
                      stroke="#9CA3AF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  id="register-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent text-gray-900 placeholder-gray-400 text-base"
                  style={{
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "2px solid #667eea";
                    e.currentTarget.style.borderColor = "#667eea";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "none";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="password_confirm"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.83333 9.16669V6.66669C5.83333 4.36548 7.69881 2.50002 10 2.50002C12.3012 2.50002 14.1667 4.36548 14.1667 6.66669V9.16669M10 11.6667V13.3334M6.5 17.5H13.5C14.4205 17.5 15.1667 16.7538 15.1667 15.8334V10.8334C15.1667 9.91288 14.4205 9.16669 13.5 9.16669H6.5C5.57953 9.16669 4.83333 9.91288 4.83333 10.8334V15.8334C4.83333 16.7538 5.57953 17.5 6.5 17.5Z"
                      stroke="#9CA3AF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password_confirm"
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent text-gray-900 placeholder-gray-400 text-base"
                  style={{
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "2px solid #667eea";
                    e.currentTarget.style.borderColor = "#667eea";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "none";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                />
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-white rounded-lg font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              style={{
                backgroundColor: "#667eea",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#5568d3";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(102, 126, 234, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#667eea";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                }
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500 leading-relaxed">
              © 2026 Nexora. All rights reserved.{" "}
              <Link
                to="/terms"
                style={{ color: "#667eea" }}
                className="hover:underline font-medium"
              >
                Terms
              </Link>{" "}
              ·{" "}
              <Link
                to="/privacy"
                style={{ color: "#667eea" }}
                className="hover:underline font-medium"
              >
                Privacy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Promotional Content */}
      <div
        className="hidden lg:flex flex-1 p-12 pt-16 items-start justify-center"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="max-w-lg">
          {/* Dashboard Preview Cards */}
          <div className="mb-12 space-y-6">
            {/* Financial Plan Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white/70 text-sm mb-1">Financial Plan</p>
                  <p className="text-3xl font-bold text-white">$2,005.45</p>
                  <p className="text-white/60 text-xs">Available</p>
                </div>
                <div className="w-24 h-24">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset="62.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>• Budgeted Expenses</span>
                  <span>75%</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>• Additional Spending</span>
                  <span>15%</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>• In Stock</span>
                  <span>10%</span>
                </div>
              </div>
            </div>

            {/* Digital Allocation & Future Funs Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <p className="text-white/70 text-xs mb-2">Digital Allocation</p>
                <p className="text-2xl font-bold text-white mb-2">$17,366.00</p>
                <div className="space-y-1.5 text-xs text-white/70">
                  <div className="flex justify-between">
                    <span>iPhone 15 Pro Max</span>
                    <span className="text-white">$1200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gray Air Conditioner</span>
                    <span className="text-white">$700</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TCL Apache RTR Bike</span>
                    <span className="text-white">$1,600</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <p className="text-white/70 text-xs mb-2">Future Funs</p>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-white/70">Bucket List Trip</span>
                      <span className="text-white">$9000</span>
                    </div>
                    <div className="flex justify-between text-white/60 text-[10px]">
                      <span>Due Date: Jun 20 2025</span>
                      <span>$12,000 | 75%</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-white/70">IT Plan</span>
                      <span className="text-white">$200</span>
                    </div>
                    <div className="flex justify-between text-white/60 text-[10px]">
                      <span>Due Date: May 20 2025</span>
                      <span>$2,000 | 10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Icon and Tagline */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-3">
              A Unified Hub for Smarter Financial Decision-Making
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Nexora empowers you with a unified financial command
              center—delivering deep insights and a 360° view of your entire
              economic world.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
