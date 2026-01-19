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
    <section className="how-it-works">
      <div className="how-it-works-container">
        <h2 className="section-title">How It Works</h2>
        <p className="section-description">
          Get started with FinanceAI in four simple steps
        </p>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
