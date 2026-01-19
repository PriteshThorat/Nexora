import Navbar from "../components/Navbar";
import Features from "../components/Features";
import Footer from "../components/Footer";

const FeaturesPage = () => {
  return (
    <div className="features-page">
      <Navbar />
      <div style={{ paddingTop: "80px" }}>
        <Features />
      </div>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
