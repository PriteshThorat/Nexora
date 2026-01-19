import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="cta">
      <div className="cta-container">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Financial Future?</h2>
          <p className="cta-description">
            Join thousands of users who trust FinanceAI for smarter financial decisions
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-cta-primary">
              Get Started Free
            </Link>
            <Link to="/contact" className="btn-cta-secondary">
              Schedule a Demo
            </Link>
          </div>
        </div>
        <div className="cta-features">
          <div className="cta-feature">
            <span className="check-icon">✓</span>
            <span>No credit card required</span>
          </div>
          <div className="cta-feature">
            <span className="check-icon">✓</span>
            <span>14-day free trial</span>
          </div>
          <div className="cta-feature">
            <span className="check-icon">✓</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
