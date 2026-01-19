import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactPage = () => {
  return (
    <div className="contact-page">
      <Navbar />
      <section
        style={{
          padding: "8rem 2rem 6rem",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          minHeight: "60vh",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "800",
              color: "white",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            Contact Us
          </h1>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "1rem",
              padding: "2rem",
              color: "#d1d5db",
            }}
          >
            <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
              Have questions? We'd love to hear from you!
            </p>
            <div style={{ marginBottom: "1rem" }}>
              <strong style={{ color: "white" }}>Email:</strong>{" "}
              support@financeai.com
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <strong style={{ color: "white" }}>Phone:</strong> +1 (555)
              123-4567
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <strong style={{ color: "white" }}>Address:</strong> 123 Finance
              Street, Tech City, TC 12345
            </div>
            <div style={{ marginTop: "2rem" }}>
              <strong style={{ color: "white" }}>Business Hours:</strong>
              <br />
              Monday - Friday: 9:00 AM - 6:00 PM EST
              <br />
              Saturday: 10:00 AM - 4:00 PM EST
              <br />
              Sunday: Closed
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactPage;
