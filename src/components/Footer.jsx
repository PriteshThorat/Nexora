import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] py-16 px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="flex items-center gap-2 text-2xl font-bold mb-4">
              <span className="text-3xl">💰</span>
              <span className="gradient-text">FinanceAI</span>
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Empowering financial decisions with cutting-edge AI technology.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 no-underline transition-colors hover:text-primary-500"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-gray-400 no-underline transition-colors hover:text-primary-500"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-gray-400 no-underline transition-colors hover:text-primary-500"
              >
                GitHub
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white text-lg font-bold mb-4">Product</h4>
            <ul className="list-none space-y-2">
              <li>
                <Link
                  to="/features"
                  className="text-gray-400 no-underline transition-colors hover:text-primary-500"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-gray-400 no-underline transition-colors hover:text-primary-500"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/agents"
                  className="text-gray-400 no-underline transition-colors hover:text-primary-500"
                >
                  AI Agents
                </Link>
              </li>
              <li>
                <Link
                  to="/api"
                  className="text-gray-400 no-underline transition-colors hover:text-primary-500"
                >
                  API Docs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg font-bold mb-4">Company</h4>
            <ul className="list-none space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 no-underline transition-colors hover:text-primary-500"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-400 no-underline transition-colors hover:text-primary-500"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-gray-400 no-underline transition-colors hover:text-primary-500"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 no-underline transition-colors hover:text-primary-500"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg font-bold mb-4">Legal</h4>
            <ul className="list-none space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 no-underline transition-colors hover:text-primary-500"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 no-underline transition-colors hover:text-primary-500"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/security"
                  className="text-gray-400 no-underline transition-colors hover:text-primary-500"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  to="/compliance"
                  className="text-gray-400 no-underline transition-colors hover:text-primary-500"
                >
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-white/10 text-gray-500">
          <p>&copy; 2026 FinanceAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
