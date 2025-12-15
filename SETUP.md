# Setup Guide - Web3 Message Signer & Verifier

This guide will help you set up and run the full-stack Web3 Message Signer application.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Dynamic.xyz account and Environment ID

## 🔑 Getting Dynamic.xyz Credentials

1. Go to [Dynamic.xyz](https://www.dynamic.xyz/) and sign up for a free account
2. Create a new project
3. Navigate to your project dashboard
4. Copy your **Environment ID** (you'll need this for the frontend `.env` file)
5. Make sure to enable **Email Authentication** in your Dynamic.xyz dashboard settings

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone git@github.com:arpit2438735/legacy-fe-candidate-assignment.git
cd legacy-fe-candidate-assignment
```

### 2. Backend Setup

```bash
# Navigate to backend directory (from project root)
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# The .env file should contain:
# PORT=3001

# Build the TypeScript code (optional for development)
npm run build
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd ../frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file and add your Dynamic.xyz Environment ID:
# VITE_DYNAMIC_ENVIRONMENT_ID=your_actual_environment_id_here
# VITE_API_URL=http://localhost:3001
```

**Important:** Replace `your_actual_environment_id_here` with your actual Dynamic.xyz Environment ID.

## 🏃 Running the Application

You'll need to run both the backend and frontend servers in separate terminals.

### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3001`

You should see: `🚀 Backend server running on port 3001`

### Terminal 2 - Frontend Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

## 🎯 Using the Application

### Starting the App

1. **Start the backend server** in Terminal 1 (`cd backend && npm run dev`)
2. **Start the frontend server** in Terminal 2 (`cd frontend && npm run dev`)
3. Open your browser and navigate to `http://localhost:5173`
4. You'll see the authentication page
5. Click "Connect Wallet" to trigger Dynamic.xyz authentication flow
6. Follow the Dynamic.xyz authentication steps (email verification)
7. Once authenticated, you'll see your connected wallet address

### Testing the Backend API

You can test the backend API independently using curl or Postman:

```bash
# Health check
curl http://localhost:3001/health

# Test signature verification (example)
curl -X POST http://localhost:3001/verify-signature \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello Web3",
    "signature": {
      "signature": "0x...",
      "address": "0x..."
    }
  }'
```

## 📝 Current Features

### Frontend
- ✅ Dynamic.xyz headless embedded wallet integration
- ✅ Email-based authentication flow
- ✅ Connected wallet address display
- ✅ Clean, modern UI with gradient design
- ✅ Disconnect wallet functionality

### Backend
- ✅ Express server with TypeScript
- ✅ POST /verify-signature endpoint for signature verification
- ✅ GET /health endpoint for health checks
- ✅ Signature verification using viem library
- ✅ CORS enabled for frontend communication
- ✅ Error handling and validation

## 🐛 Troubleshooting

### Dynamic.xyz Environment ID Error

If you see "VITE_DYNAMIC_ENVIRONMENT_ID is not set", make sure:
- You created the `.env` file in the `frontend` directory
- The environment ID is correctly copied from your Dynamic.xyz dashboard
- You restarted the frontend dev server after creating/editing the `.env` file

### Backend Connection Issues

If the frontend can't connect to the backend:
- Ensure the backend server is running on port 3001
- Check that `VITE_API_URL` in frontend `.env` matches the backend URL
- Verify no firewall is blocking port 3001

### CORS Issues

The backend is configured to accept requests from any origin during development. If you encounter CORS issues in production, you'll need to configure the allowed origins in `backend/src/index.ts`.

## 🧪 Testing

### Backend Tests (Jest)

The backend includes comprehensive Jest tests with proper mocking of external dependencies.

```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Frontend Tests (Jest + React Testing Library)

The frontend uses Jest with React Testing Library for component and integration testing.

```bash
cd frontend
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## 🚀 Deployment

Deployment configuration for Vercel will be added in a future PR.

## 📄 License

MIT

