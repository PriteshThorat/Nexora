# FinanceAI - Frontend

Modern, responsive landing page for the FinanceAI platform - an AI-powered financial services application.

## 🎨 Features

### Home Page Components

1. **Navbar** - Sticky navigation with branding and auth buttons
2. **Hero Section** - Eye-catching banner with animated floating cards showcasing key features
3. **Features Grid** - 6 AI agent cards with hover effects:
   - 💬 Finance Chatbot
   - 📊 Stock Prediction
   - 🔍 Fraud Detection
   - 🎯 Financial Advisor
   - 📰 Sentiment Analysis
   - ⚖️ Credit Risk Assessment

4. **How It Works** - 4-step process guide
5. **CTA Section** - Call-to-action with gradient background
6. **Footer** - Comprehensive links and information

## 🚀 Running the Frontend

```bash
cd frontend
bun install
bun run dev
```

The app will be available at `http://localhost:5173`

## 🛠️ Tech Stack

- **React 19.2** - UI library
- **Vite 7.2** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Custom CSS** - Modern, gradient-based design system

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx       # Main navigation
│   ├── Hero.jsx         # Hero banner with animations
│   ├── Features.jsx     # AI agents feature cards
│   ├── HowItWorks.jsx   # Process steps
│   ├── CTA.jsx          # Call to action
│   └── Footer.jsx       # Footer with links
├── pages/
│   └── HomePage.jsx     # Main landing page
├── App.jsx              # App router
├── App.css              # Component styles
├── index.css            # Global styles
└── main.jsx             # App entry point
```

## 🎨 Design System

### Color Palette

- Primary Gradient: `#667eea → #764ba2` (Purple to violet)
- Background Dark: `#111827` (Dark gray)
- Background Accent: `#1e1b4b` (Dark purple)
- Text Primary: `#ffffff` (White)
- Text Secondary: `#9ca3af` (Light gray)

### Key Features

- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Gradient backgrounds and accents
- Glass morphism effects
- Custom scrollbar styling
- Hover effects on interactive elements

## 🔗 Integration with Backend

The frontend is configured to work with the Django REST API backend at `http://localhost:8000/api/`

### API Endpoints (Coming Soon)

- `/api/users/register/` - User registration
- `/api/users/login/` - User authentication
- `/api/agents/*` - AI agent endpoints

## 📱 Responsive Breakpoints

- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 768px

## 🚧 Future Enhancements

- [ ] Add authentication pages (Login/Register)
- [ ] Create dashboard for logged-in users
- [ ] Add individual agent pages with detailed information
- [ ] Implement dark/light mode toggle
- [ ] Add pricing page
- [ ] Create API documentation page
- [ ] Add testimonials section
- [ ] Implement contact form
