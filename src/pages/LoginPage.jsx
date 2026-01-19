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

      // Store the token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect to dashboard (or home for now)
      navigate("/");
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
    <div className="login-page">
      <Navbar />
      <section
        style={{
          padding: "8rem 2rem 6rem",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: "450px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              color: "white",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            Welcome Back
          </h1>
          {error && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "0.5rem",
                padding: "1rem",
                marginBottom: "1.5rem",
                color: "#FCA5A5",
              }}
            >
              {error}
            </div>
          )}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "1rem",
              padding: "2rem",
            }}
          >
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    color: "white",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="john_doe"
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
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    color: "white",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
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
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  marginBottom: "1rem",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
              <p style={{ textAlign: "center", color: "#9ca3af" }}>
                Don't have an account?{" "}
                <Link to="/register" style={{ color: "#667eea" }}>
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
