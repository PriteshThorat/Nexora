import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserProfile } from "../store/userSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("signin");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
        "http://localhost:8000/api/users/login/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // Login successful
      console.log("Login successful:", response.data);

      // Store the token and user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Store user profile in Redux
      dispatch(setUserProfile(response.data.user));

      // Check if user has completed their financial profile
      const hasFinancialProfile =
        response.data.user.has_financial_profile || false;

      if (!hasFinancialProfile) {
        // First time login - redirect to financial profile
        navigate("/financial-profile");
      } else {
        // Profile already complete - go to dashboard
        localStorage.setItem("profileComplete", "true");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.data) {
        const errorMessages = Object.entries(err.response.data)
          .map(
            ([key, value]) =>
              `${Array.isArray(value) ? value.join(", ") : value}`,
          )
          .join(" ");
        setError(errorMessages || "Invalid credentials");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen bg-gray-50 dark:bg-slate-900"
      style={{ fontFamily: "'Roboto Mono', monospace" }}
    >
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-start justify-center p-8 pt-16 bg-white dark:bg-slate-800">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-12">
            <div className="mb-8">
              <span className="text-3xl font-bold" style={{ color: "#667eea" }}>
                Nexora
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2 text-center">
              Welcome to Nexora
            </h1>
            <p className="text-gray-600 dark:text-slate-300 text-center">
              Start your experience with Nexora by signing in or signing up.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-slate-600 justify-center">
            <button
              onClick={() => setActiveTab("signin")}
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
              {activeTab === "signin" && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: "#667eea" }}
                ></div>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("signup");
                navigate("/register");
              }}
              className="pb-3 px-1 font-medium transition-colors relative"
              style={{
                color: activeTab === "signup" ? "#667eea" : "#6b7280",
              }}
              onMouseEnter={(e) =>
                activeTab !== "signup" &&
                (e.currentTarget.style.color = "#667eea")
              }
              onMouseLeave={(e) =>
                activeTab !== "signup" &&
                (e.currentTarget.style.color = "#6b7280")
              }
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email/Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 10C12.0711 10 13.75 8.32107 13.75 6.25C13.75 4.17893 12.0711 2.5 10 2.5C7.92893 2.5 6.25 4.17893 6.25 6.25C6.25 8.32107 7.92893 10 10 10Z"
                      stroke="#9CA3AF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.5 17.5C17.5 14.7386 14.1421 12.5 10 12.5C5.85786 12.5 2.5 14.7386 2.5 17.5"
                      stroke="#9CA3AF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent text-gray-900 placeholder-gray-400"
                  style={{
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.outline = "2px solid #667eea")
                  }
                  onBlur={(e) => (e.currentTarget.style.outline = "none")}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    width="20"
                    height="20"
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
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent text-gray-900 placeholder-gray-400"
                  style={{
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.outline = "2px solid #667eea")
                  }
                  onBlur={(e) => (e.currentTarget.style.outline = "none")}
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white rounded-lg font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#667eea",
              }}
              onMouseEnter={(e) =>
                !loading && (e.currentTarget.style.backgroundColor = "#5568d3")
              }
              onMouseLeave={(e) =>
                !loading && (e.currentTarget.style.backgroundColor = "#667eea")
              }
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-gray-200 dark:border-slate-600">
            <p className="text-center text-sm text-gray-600 dark:text-slate-400">
              Copyright · Nexora. All Right Reserved{" "}
              <Link
                to="/terms"
                style={{ color: "#667eea" }}
                className="hover:underline"
              >
                Term & Condition
              </Link>{" "}
              |{" "}
              <Link
                to="/privacy"
                style={{ color: "#667eea" }}
                className="hover:underline"
              >
                Privacy & Policy
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

export default LoginPage;
