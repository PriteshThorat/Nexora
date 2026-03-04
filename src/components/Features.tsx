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
    <section className="py-24 px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-white mb-4">
            Powerful AI Agents
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Six specialized AI agents working together to revolutionize your
            financial decision-making
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-linear-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl p-8 transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden group"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 transition-transform scale-x-0 group-hover:scale-x-100"
                style={{ background: feature.color }}
              ></div>
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                {feature.description}
              </p>
              <button
                className="bg-transparent border-none font-semibold cursor-pointer text-base transition-transform hover:translate-x-1"
                style={{ color: feature.color }}
              >
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
