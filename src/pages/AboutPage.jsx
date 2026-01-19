import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AboutPage = () => {
  return (
    <div className="about-page">
      <Navbar />
      <section
        style={{
          padding: "8rem 2rem 6rem",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          minHeight: "60vh",
        }}
      >
        <div
          style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}
        >
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "800",
              color: "white",
              marginBottom: "2rem",
            }}
          >
            About FinanceAI
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "#d1d5db",
              lineHeight: "1.8",
              marginBottom: "2rem",
            }}
          >
            FinanceAI is a cutting-edge platform that leverages artificial
            intelligence to revolutionize financial decision-making. Our suite
            of specialized AI agents provides real-time insights, predictions,
            and recommendations to help you make smarter financial choices.
          </p>
          <p
            style={{
              fontSize: "1.25rem",
              color: "#d1d5db",
              lineHeight: "1.8",
            }}
          >
            Built with state-of-the-art machine learning algorithms and powered
            by comprehensive financial data, FinanceAI brings
            institutional-grade financial intelligence to everyone.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AboutPage;
