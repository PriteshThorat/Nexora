import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const LoginPage = () => {
  const navigate = useNavigate();
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
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <section className="py-32 px-8 bg-gradient-hero min-h-screen">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
            Welcome Back
          </h1>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-red-300">
              {error}
            </div>
          )}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="username"
                  className="block text-white mb-2 font-semibold"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="john_doe"
                  autoComplete="username"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-white mb-2 font-semibold"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-primary text-white border-none rounded-lg text-lg font-semibold cursor-pointer mb-4 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
              <p className="text-center text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary-500 hover:text-primary-400"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
