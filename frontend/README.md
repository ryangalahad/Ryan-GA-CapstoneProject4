# Compliance Platform - Frontend

React frontend for the Compliance Platform with user registration and login functionality.

## Features

- **User Registration** - Create new compliance officer/manager accounts with gender selection
- **User Login** - Secure login with JWT token authentication
- **Dashboard** - Welcome screen with user profile and available features
- **Responsive Design** - Mobile-friendly UI with modern styling

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure API URL

Edit `.env`:

```
REACT_APP_API_URL=http://localhost:3000/api
```

### 3. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components (future use)
│   ├── pages/           # Page components (Login, Register, Dashboard)
│   ├── services/        # API services (authService)
│   ├── styles/          # CSS files
│   ├── App.jsx          # Main app component
│   ├── App.css          # App styling
│   ├── index.jsx        # Entry point
│   └── index.css        # Global styles
├── public/
│   └── index.html       # HTML template
├── package.json         # Dependencies
└── .env                 # Environment variables
```

## Available Routes

- `/` - Authentication page (Login/Register)
- `/(authenticated)` - Dashboard with user profile

## Components

### AuthPage

Toggles between Login and Register screens.

### Login

- Email validation
- Password validation
- JWT token storage in localStorage
- Error handling

### Register

- Name, email, password input
- Gender selection (Male, Female, Other)
- Role selection (Officer, Manager)
- Password confirmation
- Form validation

### App/Dashboard

- User profile display
- Logout functionality
- Feature placeholders

## Authentication Flow

1. User registers with name, email, password, gender, and role
2. Backend creates user (no tokens returned)
3. User logs in with email and password
4. Backend returns access and refresh tokens
5. Tokens stored in localStorage
6. User redirected to dashboard
7. On logout, tokens cleared from localStorage

## API Endpoints Used

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user and get tokens
- `GET /api/name-entities/search` - Search sanctioned entities (future)

## Build for Production

```bash
npm run build
```

Creates optimized build in `build/` directory.

## Technologies

- React 18.2.0
- React Router DOM 6.8.0
- Axios 1.3.0
- CSS3 (no external UI libraries)

## Notes

- Tokens are stored in localStorage (in production, use httpOnly cookies)
- Password is sent in plain text (in production, use HTTPS + hashing)
- Gender field added to user registration as requested
