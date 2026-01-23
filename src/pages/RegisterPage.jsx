import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const RegisterPage = () => {
  const navigate = useNavigate();
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
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <section className="py-32 px-8 bg-gradient-hero min-h-screen">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
            Get Started
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
                  htmlFor="register-username"
                  className="block text-white mb-2 font-semibold"
                >
                  Username *
                </label>
                <input
                  type="text"
                  id="register-username"
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
                  htmlFor="email"
                  className="block text-white mb-2 font-semibold"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-white mb-2 font-semibold"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="John"
                    autoComplete="given-name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-white mb-2 font-semibold"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                    autoComplete="family-name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="register-password"
                  className="block text-white mb-2 font-semibold"
                >
                  Password *
                </label>
                <input
                  type="password"
                  id="register-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="SecurePass123"
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password_confirm"
                  className="block text-white mb-2 font-semibold"
                >
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="password_confirm"
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  placeholder="SecurePass123"
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-primary text-white border-none rounded-lg text-lg font-semibold cursor-pointer mb-4 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
              <p className="text-center text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary-500 hover:text-primary-400"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;
