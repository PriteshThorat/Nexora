const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description:
        "Create your free account in seconds and complete your financial profile.",
      icon: "👤",
    },
    {
      number: "02",
      title: "Choose Your Agent",
      description:
        "Select from our suite of 6 specialized AI agents based on your needs.",
      icon: "🤖",
    },
    {
      number: "03",
      title: "Get Insights",
      description:
        "Receive real-time AI-powered insights and actionable recommendations.",
      icon: "💡",
    },
    {
      number: "04",
      title: "Make Decisions",
      description:
        "Make confident financial decisions backed by data and AI analysis.",
      icon: "✅",
    },
  ];

  return (
    <section className="py-24 px-8 bg-gradient-hero">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-5xl font-extrabold text-white mb-4">
          How It Works
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Get started with FinanceAI in four simple steps
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 relative transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(102,126,234,0.3)]"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-xl">
                {step.number}
              </div>
              <div className="text-5xl my-8">{step.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {step.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
