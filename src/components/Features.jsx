const Features = () => {
  const features = [
    {
      icon: "💬",
      title: "Finance Chatbot",
      description:
        "Get instant answers to your financial questions with our intelligent chatbot powered by advanced NLP.",
      color: "#4F46E5",
    },
    {
      icon: "📊",
      title: "Stock Prediction",
      description:
        "Leverage ML algorithms to predict stock market trends and make informed investment decisions.",
      color: "#10B981",
    },
    {
      icon: "🔍",
      title: "Fraud Detection",
      description:
        "Protect your transactions with real-time fraud detection using anomaly detection algorithms.",
      color: "#EF4444",
    },
    {
      icon: "🎯",
      title: "Financial Advisor",
      description:
        "Receive personalized financial advice based on your profile, goals, and risk tolerance.",
      color: "#F59E0B",
    },
    {
      icon: "📰",
      title: "Sentiment Analysis",
      description:
        "Analyze market sentiment from news and social media to gauge investor confidence.",
      color: "#8B5CF6",
    },
    {
      icon: "⚖️",
      title: "Credit Risk Assessment",
      description:
        "Evaluate creditworthiness and assess loan risks with AI-powered credit scoring.",
      color: "#06B6D4",
    },
  ];

  return (
    <section className="features">
      <div className="features-container">
        <div className="features-header">
          <h2 className="section-title">Powerful AI Agents</h2>
          <p className="section-description">
            Six specialized AI agents working together to revolutionize your
            financial decision-making
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              style={{ "--card-color": feature.color }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <button className="feature-button">Learn More →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
