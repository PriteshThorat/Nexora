import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-24 px-8 bg-gray-900">
      <div className="max-w-4xl mx-auto text-center bg-gradient-primary rounded-3xl p-16 relative overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>

        <div className="relative z-10">
          <h2 className="text-5xl font-extrabold text-white mb-4">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users who trust FinanceAI for smarter financial
            decisions
          </p>
          <div className="flex gap-4 justify-center mb-8">
            <Link
              to="/register"
              className="bg-white text-primary-500 no-underline px-8 py-4 rounded-lg font-semibold text-lg inline-block transition-all hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.2)]"
            >
              Get Started Free
            </Link>
            <Link
              to="/contact"
              className="bg-transparent text-white no-underline px-8 py-4 rounded-lg font-semibold text-lg border-2 border-white inline-block transition-all hover:bg-white/10 hover:-translate-y-1"
            >
              Schedule a Demo
            </Link>
          </div>
        </div>

        <div className="flex gap-8 justify-center relative z-10">
          <div className="flex items-center gap-2 text-white font-medium">
            <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center">
              ✓
            </span>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2 text-white font-medium">
            <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center">
              ✓
            </span>
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center gap-2 text-white font-medium">
            <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center">
              ✓
            </span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
