import Header from "../components/Header";
import Features from "../components/Features";
import Footer from "../components/Footer";

const FeaturesPage = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Header />
      <div className="pt-20">
        <Features />
      </div>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
