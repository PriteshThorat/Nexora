import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-1000 bg-gray-900/95 backdrop-blur-md border-b border-white/10 py-4">
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 no-underline text-2xl font-bold"
        >
          <span className="text-4xl">💰</span>
          <span className="gradient-text">Nexora</span>
        </Link>

        <ul className="flex gap-8 list-none">
          <li>
            <Link
              to="/"
              className="text-gray-300 no-underline font-medium transition-colors hover:text-primary-500"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/features"
              className="text-gray-300 no-underline font-medium transition-colors hover:text-primary-500"
            >
              Features
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-gray-300 no-underline font-medium transition-colors hover:text-primary-500"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="text-gray-300 no-underline font-medium transition-colors hover:text-primary-500"
            >
              Contact
            </Link>
          </li>
        </ul>

        <div className="flex gap-4 items-center">
          <Link
            to="/login"
            className="text-gray-300 no-underline px-4 py-2 transition-colors hover:text-primary-500"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-gradient-primary text-white no-underline px-6 py-2 rounded-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(102,126,234,0.5)]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
