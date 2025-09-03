# PromptCraft Pro

A comprehensive AI prompt optimization tool with 4 modes: LLM Prompt, Agentic Workflow, Image Creation, and Video Generation.

## Setup

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Firestore Database
4. Go to Project Settings > Service Accounts
5. Generate a new private key (JSON file)
6. Save the JSON file as `serviceAccountKey.json` in your backend directory

### 2. Environment Variables
Create `.env` file in backend directory:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# OR use environment variable approach:
# FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

# JWT & Stripe
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FRONTEND_URL=http://localhost:80
```

### 3. Stripe Setup
1. Replace placeholder Stripe price IDs in `backend/controllers/paymentController.js`
2. Replace publishable key in `frontend/src/pages/Pricing.tsx`

## Run locally
- Backend: `cd backend && npm start`
- Frontend: `cd frontend && npm run dev`

## Deployment
Use `docker-compose up` (MongoDB service has been removed - now uses Firebase)

## Features
- **LLM Prompt**: Optimize prompts for text-based AI models
- **Agentic Workflow**: Create complex multi-agent AI systems
- **Image Creation**: Generate optimized prompts for AI image models
- **Video Generation**: Text-to-video and image-to-video prompt optimization
- **Subscription Management**: Pay-per-use and monthly plans via Stripe
- **Usage Tracking**: Monthly limits with automatic resets 