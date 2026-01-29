import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutPage = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Header />
      <section className="py-32 px-8 bg-gradient-hero min-h-[60vh]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-white mb-8">
            About FinanceAI
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            FinanceAI is a cutting-edge platform that leverages artificial
            intelligence to revolutionize financial decision-making. Our suite
            of specialized AI agents provides real-time insights, predictions,
            and recommendations to help you make smarter financial choices.
          </p>
          <p className="text-xl text-gray-300 leading-relaxed">
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
