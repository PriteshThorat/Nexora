import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const LoginPage = () => {
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
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "1rem",
              padding: "2rem",
            }}
          >
            <form>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    color: "white",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
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
                  placeholder="••••••••"
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
                style={{
                  width: "100%",
                  padding: "1rem",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginBottom: "1rem",
                }}
              >
                Sign In
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
