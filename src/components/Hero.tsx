import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-gradient-hero py-24 px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(102,126,234,0.2)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(118,75,162,0.2)_0%,transparent_50%)]"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div>
          <h1 className="text-[3.5rem] font-extrabold leading-tight mb-6 text-white">
            AI-Powered Financial Intelligence
            <span className="gradient-text"> at Your Fingertips</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Experience the future of finance with our suite of AI agents. Get
            real-time stock predictions, fraud detection, financial advice, and
            more—all powered by cutting-edge machine learning.
          </p>
          <div className="flex gap-4 mb-12">
            <Link
              to="/register"
              className="bg-gradient-primary text-white no-underline px-8 py-4 rounded-lg font-semibold text-lg inline-block transition-all hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(102,126,234,0.5)]"
            >
              Start Free Trial
            </Link>
            <Link
              to="/features"
              className="bg-transparent text-white no-underline px-8 py-4 rounded-lg font-semibold text-lg border-2 border-white inline-block transition-all hover:bg-white/10 hover:-translate-y-1"
            >
              Explore Features
            </Link>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col">
              <span className="text-5xl font-extrabold text-primary-500">
                6
              </span>
              <span className="text-gray-400 text-sm">AI Agents</span>
            </div>
            <div className="flex flex-col">
              <span className="text-5xl font-extrabold text-primary-500">
                99.9%
              </span>
              <span className="text-gray-400 text-sm">Accuracy</span>
            </div>
            <div className="flex flex-col">
              <span className="text-5xl font-extrabold text-primary-500">
                24/7
              </span>
              <span className="text-gray-400 text-sm">Support</span>
            </div>
          </div>
        </div>

        <div className="relative h-125 hidden lg:block">
          <div className="absolute top-[10%] left-[10%] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center gap-4 animate-float">
            <span className="text-4xl">📈</span>
            <span className="text-white font-semibold">Stock Predictions</span>
          </div>
          <div className="absolute top-[40%] right-[10%] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center gap-4 animate-float [animation-delay:1s]">
            <span className="text-4xl">🛡️</span>
            <span className="text-white font-semibold">Fraud Detection</span>
          </div>
          <div className="absolute bottom-[20%] left-[20%] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center gap-4 animate-float [animation-delay:2s]">
            <span className="text-4xl">💡</span>
            <span className="text-white font-semibold">Smart Advice</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
