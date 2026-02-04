# Financial AI Dashboard Frontend

A modern React + Vite frontend for a comprehensive financial AI system. Provides an intuitive user interface for accessing AI agents, managing financial profiles, and tracking financial insights.

## 🎯 Overview

This frontend provides a complete user interface for interacting with the Financial AI Agents backend. Users can register, manage their financial profiles, chat with AI agents, and get personalized financial insights.

### Core Features

- **User Authentication** - Secure login and registration
- **Financial Profile Management** - Input and track financial data
- **AI Agent Chat Interface** - Real-time interaction with 6 AI agents
- **Dashboard** - View financial overview and insights
- **Stock Widget** - Track watched stocks
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Theme Support** - Light and dark mode switching
- **State Management** - Redux for global state
- **Persistent Login** - Remember user session

## 🏗️ Tech Stack

- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Styling:** Tailwind CSS 4.1.18
- **State Management:** Redux Toolkit 2.11.2, Redux Persist
- **Routing:** React Router DOM 7.12.0
- **HTTP Client:** Axios 1.13.2
- **Charts:** Chart.js 4.5.1
- **Linting:** ESLint 9.39.1

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation & Running

1. **Install Dependencies**

```powershell
npm install
```

2. **Start Development Server**

```powershell
npm run dev
```

**Frontend runs at:** `http://localhost:5173` (Vite default)

3. **Build for Production**

```powershell
npm run build
```

4. **Preview Production Build**

```powershell
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/               # Reusable React components
│   │   ├── CTA.jsx              # Call-to-action sections
│   │   ├── Features.jsx          # Features showcase
│   │   ├── Footer.jsx            # Footer component
│   │   ├── Header.jsx            # Header component
│   │   ├── Hero.jsx              # Hero section
│   │   ├── HowItWorks.jsx        # How it works section
│   │   ├── Navbar.jsx            # Navigation bar
│   │   └── StockWidget.jsx       # Stock ticker widget
│   │
│   ├── pages/                    # Full-page components
│   │   ├── AboutPage.jsx         # About the project
│   │   ├── ChatbotPage.jsx       # AI chatbot interface
│   │   ├── ContactPage.jsx       # Contact/feedback form
│   │   ├── DashboardPage.jsx     # User dashboard
│   │   ├── FeaturesPage.jsx      # Features overview
│   │   ├── FinancialProfilePage.jsx # Financial data form
│   │   ├── HomePage.jsx          # Landing page
│   │   ├── LoginPage.jsx         # Login page
│   │   ├── RegisterPage.jsx      # Registration page
│   │   └── PAGES_README.md       # Page documentation
│   │
│   ├── store/                    # Redux state management
│   │   ├── store.js              # Redux store configuration
│   │   └── themeSlice.js         # Theme reducer
│   │
│   ├── assets/                   # Images, icons, static files
│   ├── App.jsx                   # Root component with routing
│   ├── index.css                 # Global styles
│   ├── main.jsx                  # React entry point
│   │
│   └── api/                      # API integration (optional)
│
├── public/                        # Static assets
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── eslint.config.js               # ESLint configuration
└── index.html                     # HTML entry point
```

## 🔌 API Integration

### Backend Connection

The frontend communicates with the Django backend at `http://localhost:8000/api/`

### Authentication Flow

1. User registers at `/register`
2. Credentials sent to `/api/users/register/`
3. Receive authentication token
4. Store token in Redux state and localStorage
5. Include token in all subsequent API requests
6. Token used as: `Authorization: Token YOUR_TOKEN`

### Key API Endpoints Used

- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login
- `GET /api/users/profile/` - Get user profile
- `PATCH /api/users/profile_update/` - Update profile
- `PATCH /api/users/financial_profile_update/` - Update financial data
- `POST /api/agents/finance_chatbot/` - Chat with AI
- `POST /api/agents/stock_prediction/` - Stock predictions
- `POST /api/agents/fraud_detection/` - Fraud detection
- `POST /api/agents/financial_advisor/` - Financial advice
- `POST /api/agents/sentiment_analysis/` - Sentiment analysis
- `POST /api/agents/credit_risk/` - Credit risk assessment

## 📄 Pages Documentation

### HomePage

- Landing page with value proposition
- Features overview
- How it works explanation
- Call-to-action buttons

### LoginPage

- Email/username and password input
- Error handling
- Remember me option
- Registration link

### RegisterPage

- Full registration form
- Email validation
- Password strength requirements
- Terms acceptance
- Duplicate account checking

### DashboardPage

- User overview
- Financial summary
- Recent activity
- Stock widget integration
- Quick access to agents

### FinancialProfilePage

- Income and expenses tracking
- Risk tolerance selection
- Financial goals
- Credit information
- Employment status
- Transaction data
- Stock watchlist
- News source preferences

### ChatbotPage

- AI chatbot interface
- Message history
- Agent selection dropdown
- Real-time responses
- Query examples

### FeaturesPage

- Complete feature list
- Agent descriptions
- Benefit highlights
- Use case examples

### AboutPage

- Project overview
- Team information
- Vision and mission
- Contact information

### ContactPage

- Contact form
- Message submission
- Email notification
- Feedback capture

## 🎨 Components

### Navbar

- Logo
- Navigation links
- Theme toggle (light/dark)
- User menu (login/logout)
- Mobile responsive menu

### Hero

- Eye-catching headline
- Tagline
- CTA buttons
- Background imagery

### Features

- Feature grid layout
- Feature cards with icons
- Descriptions
- Benefits list

### HowItWorks

- Step-by-step process
- Visual indicators
- Timeline view
- Description text

### CTA

- Call-to-action section
- Primary button
- Secondary option
- Email capture (optional)

### Footer

- Links grouped by category
- Social media links
- Copyright notice
- Responsive layout

### StockWidget

- Real-time stock ticker
- Price and percentage change
- Color-coded gains/losses
- Refresh button
- Configurable stock symbols

## 🌐 Routing Structure

```
/                    → HomePage
/register            → RegisterPage
/login               → LoginPage
/dashboard           → DashboardPage (protected)
/profile             → FinancialProfilePage (protected)
/chatbot             → ChatbotPage (protected)
/features            → FeaturesPage
/about               → AboutPage
/contact             → ContactPage
```

## 🔐 Authentication & Protected Routes

**Protected Routes** (require login):

- `/dashboard`
- `/profile`
- `/chatbot`

**Public Routes:**

- All other routes

**Implementation:**

```javascript
// ProtectedRoute component checks if user is authenticated
// Redirects to /login if token not present
// Token stored in Redux and localStorage
```

## 🎨 Styling

### Tailwind CSS

- Utility-first CSS framework
- Configured in `tailwind.config.js`
- Used for all component styling
- Dark mode support

### Global Styles (`index.css`)

- Reset styles
- Custom font definitions
- Root CSS variables
- Animation definitions

### Theme Support

- Light/dark mode toggle
- Redux slice for theme state
- Stored in localStorage
- Applied to root element class

## 📊 State Management (Redux)

### Store Structure

```
store/
├── themeSlice
│   ├── theme: 'light' | 'dark'
│   └── toggleTheme()
│
└── authSlice (recommended to add)
    ├── user: {id, email, name, ...}
    ├── token: string
    ├── isAuthenticated: boolean
    └── login(), logout(), updateProfile()
```

### Redux Persist

- Automatically saves state to localStorage
- Rehydrates on app reload
- Persists across browser sessions
- Configuration in `store.js`

## 🎯 Key Features

### User Authentication

- Secure registration with validation
- Token-based login
- Session persistence
- Automatic logout on token expiration
- Password strength requirements

### Financial Profile Management

- Input financial data
- Update information anytime
- Validation and error handling
- Visual feedback
- Field descriptions and help text

### AI Agent Chat

- Multiple agent selection
- Real-time responses
- Message history
- Loading states
- Error handling
- Response formatting

### Dashboard

- Financial overview
- Recent transactions
- Stock performance
- Agent activity log
- Trends and insights

### Stock Widget

- Real-time stock data
- Multiple stock symbols
- Price change indicators
- Color-coded performance
- Responsive layout

## 🛠️ Development Guide

### Adding a New Page

1. Create new file in `src/pages/YourPage.jsx`
2. Add route in `App.jsx`
3. Import page component
4. Add navigation link in Navbar

```javascript
// src/pages/YourPage.jsx
export default function YourPage() {
  return (
    <div className="container mx-auto px-4 py-8">{/* Your content */}</div>
  );
}

// src/App.jsx
import YourPage from "./pages/YourPage";

// In Routes
<Route path="/yourpage" element={<YourPage />} />;
```

### Adding a New Component

1. Create file in `src/components/YourComponent.jsx`
2. Import and use in pages/other components
3. Pass props for data and callbacks

```javascript
// src/components/YourComponent.jsx
export default function YourComponent({ title, data, onAction }) {
  return (
    <div>
      <h2>{title}</h2>
      {/* Your component */}
    </div>
  );
}
```

### API Integration Pattern

```javascript
import axios from "axios";

const API_BASE = "http://localhost:8000/api";

// Get token from Redux or localStorage
const getToken = () => {
  return localStorage.getItem("authToken");
};

// Make authenticated request
const fetchUserProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE}/users/profile/`, {
      headers: {
        Authorization: `Token ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
```

### Form Handling Pattern

```javascript
const [formData, setFormData] = useState({
  field1: "",
  field2: "",
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Submit data to API
    await submitForm(formData);
  } catch (error) {
    // Handle error
  }
};
```

## 🚀 Build & Deployment

### Build for Production

```powershell
npm run build
```

Generates optimized build in `dist/` folder

### Deployment Options

**1. Vercel (Recommended)**

```powershell
npm install -g vercel
vercel
```

**2. Netlify**

- Connect GitHub repo
- Set build command: `npm run build`
- Set publish directory: `dist`

**3. Traditional Server**

- Build with `npm run build`
- Deploy `dist/` folder to web server
- Configure backend API URL

### Environment Variables

Create `.env` file:

```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Financial AI
```

Use in code:

```javascript
const API_BASE = import.meta.env.VITE_API_BASE_URL;
```

## 🧪 Testing

### ESLint

```powershell
npm run lint
```

Checks code style and potential issues

### Manual Testing

1. Start backend: `python manage.py runserver`
2. Start frontend: `npm run dev`
3. Test user flows:
   - Register → Login → Update Profile → Use Agents
   - Check console for errors
   - Verify API calls in Network tab

## 📱 Responsive Design

- **Mobile (< 768px)** - Single column, full-width
- **Tablet (768px - 1024px)** - Two columns
- **Desktop (> 1024px)** - Three+ columns

Tailwind breakpoints used:

- `sm` - 640px
- `md` - 768px
- `lg` - 1024px
- `xl` - 1280px
- `2xl` - 1536px

## 🎯 Performance Optimization

- **Code Splitting** - Routes are lazy-loaded
- **Image Optimization** - Use modern formats
- **CSS Purging** - Tailwind removes unused styles
- **Minification** - Vite automatically minifies
- **Caching** - Redux Persist caches state

## 🔗 Integration with Backend

### Running Both Together

**Terminal 1: Backend**

```powershell
cd backend
python manage.py runserver
# Backend at http://localhost:8000
```

**Terminal 2: Frontend**

```powershell
cd frontend
npm run dev
# Frontend at http://localhost:5173
```

### CORS Configuration

Backend already has CORS configured to accept requests from frontend. If issues occur:

1. Check `backend/backend/settings.py`
2. Verify CORS_ALLOWED_ORIGINS includes frontend URL
3. Ensure Authorization header is passed correctly

## 📚 Documentation

- **For Pages Details:** See [src/pages/PAGES_README.md](src/pages/PAGES_README.md)
- **For Stock Widget:** See [STOCK_WIDGET_README.md](STOCK_WIDGET_README.md)
- **Backend Integration:** See [../backend/README.md](../backend/README.md)

## 🆘 Common Issues

### API Requests Fail with CORS Error

- Ensure backend is running on http://localhost:8000
- Check CORS_ALLOWED_ORIGINS in Django settings
- Verify frontend URL in CORS configuration

### Authentication Token Not Working

- Check token is being saved correctly
- Verify token format in Authorization header
- Try logging in again to get fresh token
- Check browser localStorage for token

### Styles Not Loading

- Clear browser cache
- Run `npm install` to ensure Tailwind is installed
- Restart dev server
- Check `tailwind.config.js` for correct content paths

### Build Fails

- Clear node_modules: `rm -r node_modules && npm install`
- Check for TypeScript errors if using TS
- Verify all imports are correct
- Check Vite config for correct entry point

## 🐛 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📦 Dependencies

| Package          | Version | Purpose             |
| ---------------- | ------- | ------------------- |
| react            | 19.2.0  | UI library          |
| react-dom        | 19.2.0  | React DOM rendering |
| react-router-dom | 7.12.0  | Routing             |
| @reduxjs/toolkit | 2.11.2  | State management    |
| redux-persist    | 6.0.0   | State persistence   |
| axios            | 1.13.2  | HTTP client         |
| tailwindcss      | 4.1.18  | Styling             |
| chart.js         | 4.5.1   | Charts              |
| vite             | 7.2.4   | Build tool          |
| eslint           | 9.39.1  | Linting             |

## 🚦 Development Scripts

```powershell
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📈 What's Next?

1. ✅ Complete frontend with all pages
2. ✅ Authentication and protected routes
3. ✅ Redux state management
4. ✅ Tailwind styling and responsive design
5. 🚧 Advanced chatbot features
6. 🚧 Analytics and reporting dashboard
7. 🚧 Real-time notifications
8. 🚧 Mobile app version

## 📞 Support

For issues or questions:

1. Check console for error messages
2. Review Network tab for API issues
3. Check backend logs
4. See [../backend/README.md](../backend/README.md) for backend issues

## 📄 License

This project is part of a capstone project.

---

**Last Updated:** February 2026
**Status:** ✅ Complete and Ready for Integration
