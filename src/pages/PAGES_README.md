# Frontend Pages Documentation

**Typography**: Roboto Mono - Designed by Christian Robertson

---

## Overview

This directory contains all the page components for the FinanceAI application. Each page serves a specific purpose in the user journey, from initial landing to authenticated financial management experiences.

---

## Pages

### 1. HomePage.jsx

**Purpose**: Landing page and main entry point for the application

**Description**:
The HomePage serves as the primary landing page for visitors to the FinanceAI platform. It provides a comprehensive introduction to the application and its capabilities through a series of well-structured sections.

**Components Used**:

- **Navbar**: Top navigation bar for site-wide navigation
- **Hero**: Main hero section with compelling headline and call-to-action
- **Features**: Showcase of key platform features and AI agents
- **HowItWorks**: Step-by-step guide on how to use the platform
- **CTA**: Call-to-action section encouraging user sign-up
- **Footer**: Site footer with additional links and information

**User Flow**:

- First touchpoint for new users
- Provides overview of platform capabilities
- Guides users towards registration/login

**Styling**: Clean, modern layout with gradient backgrounds and glassmorphic effects

---

### 2. LoginPage.jsx

**Purpose**: User authentication and secure access to the platform

**Description**:
The LoginPage handles user authentication with a secure login form. It manages the authentication flow, including token storage, session management, and intelligent routing based on user profile completion status.

**Key Features**:

- **Form Fields**: Username and password inputs
- **Authentication**: Connects to backend API at `http://localhost:8000/api/users/login/`
- **Token Management**: Stores authentication token and user data in localStorage
- **Error Handling**: Displays meaningful error messages for failed login attempts
- **Loading States**: Shows loading indicator during authentication process
- **Smart Routing**:
  - Redirects to financial profile page for first-time users
  - Redirects to dashboard for returning users with complete profiles

**State Management**:

- Form data (username, password)
- Error messages
- Loading states

**Security Features**:

- Token-based authentication
- Secure credential transmission
- Session persistence via localStorage

**User Experience**:

- Responsive design with centered form layout
- Gradient purple background for visual appeal
- Clear error feedback
- Link to registration page for new users

---

### 3. RegisterPage.jsx

**Purpose**: New user account creation and onboarding

**Description**:
The RegisterPage facilitates new user registration with comprehensive form validation and error handling. It collects essential user information and creates new accounts through the backend API.

**Form Fields**:

- **username**: Unique identifier for the user
- **email**: User's email address
- **password**: Secure password
- **password_confirm**: Password confirmation for validation
- **first_name**: User's first name
- **last_name**: User's last name

**Key Features**:

- **Comprehensive Validation**: Frontend and backend validation for all fields
- **Password Matching**: Ensures password and confirmation match
- **API Integration**: Posts to `http://localhost:8000/api/users/register/`
- **Error Messaging**: Detailed error feedback with field-specific messages
- **Loading States**: Visual feedback during registration process
- **Automatic Redirect**: Navigates to login page upon successful registration

**User Experience**:

- Clean, intuitive form layout
- Matching visual style with LoginPage for consistency
- Real-time error feedback
- Success confirmation and smooth transition to login
- Link back to login page for existing users

**Error Handling**:

- Backend validation errors displayed with field context
- Network error handling
- User-friendly error messages

---

### 4. DashboardPage.jsx

**Purpose**: Main user dashboard and command center after authentication

**Description**:
The DashboardPage is the central hub for authenticated users, providing access to all platform features and displaying personalized information. It includes navigation to various AI agents and tools.

**Key Features**:

- **Authentication Guard**: Automatically redirects to login if user is not authenticated
- **Personalized Welcome**: Displays user's username from localStorage
- **Session Management**: Logout functionality that clears all user data
- **Grid Layout**: Responsive card-based layout for feature access

**Dashboard Sections**:

- **Header Card**: Welcome message and logout button
- **Feature Cards**: Access points to various platform capabilities including:
  - AI Financial Advisor
  - Stock predictions
  - Risk assessment tools
  - Fraud detection
  - Sentiment analysis
  - Credit risk evaluation

**Visual Design**:

- Gradient background (purple to violet)
- Glassmorphic card designs with backdrop blur
- Responsive grid layout adapting to screen sizes
- Modern, clean aesthetic with high visual appeal

**Navigation**:

- React Router integration for seamless page transitions
- Programmatic navigation for auth checks
- Clean logout flow

**Security**:

- Token validation on page load
- Automatic redirect for unauthenticated access
- Complete session cleanup on logout

---

### 5. ChatbotPage.jsx

**Purpose**: Interactive AI chatbot for financial advice and queries

**Description**:
The ChatbotPage provides a real-time conversational interface with an AI Financial Advisor. Users can ask questions and receive intelligent responses about financial planning, investments, and money management.

**Core Functionality**:

- **Real-time Chat Interface**: Message-based conversation with AI
- **Message History**: Maintains full conversation context
- **Auto-scroll**: Automatically scrolls to latest messages
- **API Integration**: Connects to `http://localhost:8000/api/agents/finance_chatbot/`

**Features**:

- **Authentication Required**: Protected route requiring valid token
- **Message Types**:
  - User messages (right-aligned, blue styling)
  - Bot messages (left-aligned, purple styling)
- **Timestamps**: Each message includes timestamp
- **Loading States**: Visual feedback while waiting for AI response
- **Error Handling**: Graceful error messages for network or API failures

**State Management**:

- Messages array maintaining conversation history
- Input message state for form control
- Loading state for UX feedback
- Refs for auto-scrolling behavior

**API Communication**:

- POST requests with user query
- Token-based authentication
- Response parsing with multiple fallback paths
- Network error recovery

**User Experience**:

- Chat bubble design for familiar messaging experience
- Visual distinction between user and bot messages
- Smooth scrolling to new messages
- Disabled input during loading
- Professional gradient background

**Initial State**:

- Starts with friendly greeting from AI advisor
- Clear call-to-action for user engagement

---

### 6. FinancialProfilePage.jsx

**Purpose**: User financial information collection and profile completion

**Description**:
The FinancialProfilePage is a critical onboarding step that collects comprehensive financial information from users. This data personalizes the AI recommendations and predictions throughout the platform.

**Form Fields**:

**Financial Metrics**:

- **monthly_income**: User's monthly income (numeric)
- **monthly_expenses**: Monthly expenses (numeric)
- **total_debt**: Total outstanding debt (numeric)

**Risk & Goals**:

- **risk_tolerance**: Investment risk tolerance (low/medium/high)
- **financial_goal**: User's primary financial objectives (text)

**Employment & Credit**:

- **employment_status**: Current employment situation (employed/unemployed/self-employed/retired)
- **credit_history**: Credit score range (excellent/good/fair/poor)

**Preferences**:

- **watched_stocks**: Stock symbols user wants to track
- **preferred_news_sources**: Financial news sources of interest

**Key Features**:

- **PATCH Request**: Updates existing user profile via `http://localhost:8000/api/users/financial_profile_update/`
- **Token Authentication**: Requires valid authentication token
- **Data Validation**: Converts string inputs to appropriate numeric types
- **Completion Tracking**: Sets 'profileComplete' flag in localStorage
- **Smart Navigation**: Redirects to dashboard upon successful completion

**User Experience**:

- Two-column grid layout for efficient space usage
- Responsive design adapting to screen sizes
- Clear labels and input types
- Dropdown selectors for categorical data
- Text areas for detailed inputs
- Loading states during submission
- Error feedback for failed submissions

**Visual Design**:

- Gradient background matching app theme
- Glassmorphic card design
- Clear visual hierarchy
- Centered layout for focus

**Data Flow**:

1. User fills out comprehensive form
2. Data validated and formatted
3. API request with authenticated token
4. Success: Redirect to dashboard
5. Failure: Display error message

**Purpose in User Journey**:

- First-time user onboarding
- Profile customization
- AI personalization foundation
- Data collection for intelligent recommendations

---

### 7. AboutPage.jsx

**Purpose**: Information about the FinanceAI platform and its mission

**Description**:
The AboutPage provides visitors and users with detailed information about the FinanceAI platform, its technology, capabilities, and value proposition. It serves as an informational resource explaining what makes the platform unique.

**Content Sections**:

- **Platform Overview**: Introduction to FinanceAI's AI-powered approach
- **Technology Description**: Explanation of machine learning algorithms and data sources
- **Value Proposition**: How the platform democratizes institutional-grade financial intelligence

**Key Features**:

- **Informational Content**: Text-based content explaining platform benefits
- **Professional Layout**: Centered, readable text layout
- **Consistent Branding**: Maintains visual consistency with other pages

**Components Used**:

- **Navbar**: Site-wide navigation
- **Footer**: Additional links and information

**Visual Design**:

- Deep purple gradient background
- Centered content with maximum width constraint
- Large, bold heading
- Easy-to-read typography with generous line spacing
- Light text on dark background for readability

**Purpose**:

- Build trust with potential users
- Explain technology and methodology
- Differentiate from competitors
- Establish credibility

**User Journey Context**:

- Accessible to both authenticated and unauthenticated users
- Supports conversion funnel by building confidence
- Provides transparency about platform capabilities

---

### 8. ContactPage.jsx

**Purpose**: Contact information and communication channels

**Description**:
The ContactPage provides all necessary contact information for users to reach out to the FinanceAI support team. It displays multiple communication channels and business hours for user convenience.

**Contact Information Displayed**:

- **Email**: support@financeai.com
- **Phone**: +1 (555) 123-4567
- **Physical Address**: 123 Finance Street, Tech City, TC 12345
- **Business Hours**:
  - Monday - Friday: 9:00 AM - 6:00 PM EST
  - Saturday: 10:00 AM - 4:00 PM EST
  - Sunday: Closed

**Key Features**:

- **Multiple Contact Channels**: Email, phone, and physical address
- **Business Hours**: Clear availability information
- **Professional Presentation**: Well-organized information card

**Components Used**:

- **Navbar**: Site navigation
- **Footer**: Additional site information

**Visual Design**:

- Consistent gradient background matching site theme
- Glassmorphic information card with subtle backdrop blur
- Centered layout with maximum width constraint
- Clear typography hierarchy
- High contrast for readability

**User Experience**:

- Easy-to-find contact information
- Copy-friendly format for email and phone
- Professional business hours display
- Accessible to all users (authenticated or not)

**Purpose**:

- Customer support access
- Build trust through transparency
- Provide multiple communication options
- Set expectations for response times

---

### 9. FeaturesPage.jsx

**Purpose**: Detailed showcase of platform features and capabilities

**Description**:
The FeaturesPage is a dedicated page that highlights all the key features and AI agents available on the FinanceAI platform. It provides an in-depth look at the various tools and capabilities users can access.

**Structure**:

- **Navbar**: Site-wide navigation at the top
- **Features Component**: Main content showcasing all platform features
- **Footer**: Site footer with additional links

**Key Features**:

- **Reusable Component**: Leverages the Features component from the home page
- **Padding Adjustment**: Adds top padding to account for fixed navbar
- **Consistent Layout**: Maintains visual consistency with homepage

**Content** (from Features component):
Likely includes information about:

- AI Financial Advisor capabilities
- Stock prediction algorithms
- Fraud detection systems
- Sentiment analysis tools
- Credit risk assessment
- Real-time market insights
- Personalized recommendations

**Visual Design**:

- Clean, organized layout
- Matching site-wide design system
- Easy navigation between features
- Professional presentation

**User Journey Context**:

- Helps users understand platform capabilities before registration
- Supports decision-making for potential customers
- Serves as reference for existing users
- Accessible to both authenticated and unauthenticated users

**Purpose**:

- Feature education
- Value demonstration
- Conversion support
- User onboarding aid

---

## Common Patterns Across Pages

### Authentication Flow

1. **Public Pages**: HomePage, AboutPage, ContactPage, FeaturesPage
2. **Auth Pages**: LoginPage, RegisterPage
3. **Protected Pages**: DashboardPage, ChatbotPage, FinancialProfilePage (require authentication)

### Navigation Structure

- React Router for client-side routing
- Programmatic navigation using `useNavigate` hook
- Protected routes with authentication checks

### State Management

- React hooks (useState, useEffect, useRef)
- localStorage for session persistence
- Form state management for user inputs

### API Integration

- Backend API base URL: `http://localhost:8000/api/`
- Token-based authentication
- RESTful API patterns
- Error handling for network requests

### Visual Design System

- Gradient backgrounds (purple to violet spectrum)
- Glassmorphic UI elements with backdrop blur
- Consistent color palette
- Responsive layouts
- Modern, clean aesthetic

### User Experience Patterns

- Loading states for async operations
- Error feedback for failed operations
- Form validation
- Responsive design
- Smooth transitions

---

## Technical Stack

**Framework**: React with JSX
**Routing**: React Router DOM
**HTTP Client**: Axios and native Fetch API
**Styling**: Inline styles with CSS-in-JS approach
**State Management**: React Hooks
**Authentication**: Token-based with localStorage

---

## Development Notes

### File Organization

All page components are located in `frontend/src/pages/`

### Component Naming Convention

- PascalCase for component names
- Descriptive names ending with "Page"
- Default exports for all pages

### Routing Setup

Pages are configured in the main app router with paths like:

- `/` → HomePage
- `/login` → LoginPage
- `/register` → RegisterPage
- `/dashboard` → DashboardPage
- `/chatbot` → ChatbotPage
- `/financial-profile` → FinancialProfilePage
- `/about` → AboutPage
- `/contact` → ContactPage
- `/features` → FeaturesPage

### Authentication Pattern

Protected pages check for token in localStorage:

```javascript
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
  }
}, [navigate]);
```

### API Error Handling

Consistent error handling pattern across pages:

- Try-catch blocks for network requests
- User-friendly error messages
- Graceful degradation
- Network error fallbacks

---

## Future Enhancements

### Potential Improvements

- Form validation libraries (e.g., Formik, React Hook Form)
- Global state management (Redux, Zustand)
- Component-level styling (CSS Modules, Styled Components)
- Progressive Web App features
- Offline support
- Enhanced accessibility (ARIA labels, keyboard navigation)
- Internationalization (i18n)
- Dark/light theme toggle
- Advanced chat features (file uploads, voice input)
- Profile editing capabilities
- Dashboard customization

---

## Maintenance Guidelines

### Adding New Pages

1. Create new component in `src/pages/`
2. Follow existing naming conventions
3. Include Navbar component for consistency
4. Add route in main App router
5. Update this documentation

### Updating Existing Pages

1. Test authentication flows
2. Verify API endpoints
3. Check responsive design
4. Update error handling
5. Document changes

### Testing Checklist

- [ ] Authentication flows work correctly
- [ ] API integration successful
- [ ] Error states display properly
- [ ] Loading states show feedback
- [ ] Responsive on mobile/tablet/desktop
- [ ] Navigation links function
- [ ] Form validations work
- [ ] localStorage operations succeed
- [ ] Logout clears all data
- [ ] Protected routes redirect properly

---

**Last Updated**: January 22, 2026  
**Version**: 1.0  
**Typography**: Roboto Mono - Designed by Christian Robertson
