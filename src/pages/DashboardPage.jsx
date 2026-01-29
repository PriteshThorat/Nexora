import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profileComplete");
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "1rem",
            padding: "2rem",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: "0.5rem",
                }}
              >
                Welcome, {localStorage.getItem("username") || "User"}!
              </h1>
              <p style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                Your Financial Dashboard
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: "0.75rem 1.5rem",
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "1rem",
              padding: "1.5rem",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "white",
                marginBottom: "1rem",
              }}
            >
              Financial Overview
            </h3>
            <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Your financial data is being processed...
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "1rem",
              padding: "1.5rem",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "white",
                marginBottom: "1rem",
              }}
            >
              Portfolio
            </h3>
            <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              View your investment portfolio...
            </p>
          </div>

          <div
            onClick={() => navigate("/chatbot")}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "1rem",
              padding: "1.5rem",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px 0 rgba(31, 38, 135, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 32px 0 rgba(31, 38, 135, 0.37)";
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "white",
                marginBottom: "1rem",
              }}
            >
              AI Financial Advisor 💬
            </h3>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: "0.5rem",
              }}
            >
              Get personalized financial advice from our AI assistant
            </p>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontSize: "0.875rem",
              }}
            >
              Click to start chatting →
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
