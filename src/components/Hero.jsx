import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            AI-Powered Financial Intelligence
            <span className="gradient-text"> at Your Fingertips</span>
          </h1>
          <p className="hero-description">
            Experience the future of finance with our suite of AI agents. Get
            real-time stock predictions, fraud detection, financial advice, and
            more—all powered by cutting-edge machine learning.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-hero-primary">
              Start Free Trial
            </Link>
            <Link to="/features" className="btn-hero-secondary">
              Explore Features
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">6</span>
              <span className="stat-label">AI Agents</span>
            </div>
            <div className="stat">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card-1">
            <span className="card-icon">📈</span>
            <span className="card-text">Stock Predictions</span>
          </div>
          <div className="floating-card card-2">
            <span className="card-icon">🛡️</span>
            <span className="card-text">Fraud Detection</span>
          </div>
          <div className="floating-card card-3">
            <span className="card-icon">💡</span>
            <span className="card-text">Smart Advice</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
