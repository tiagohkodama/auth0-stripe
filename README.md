# Auth0 + Stripe Integration

A production-ready application demonstrating secure authentication with Auth0 and payment processing with Stripe.

## Prerequisites

- **Docker & Docker Compose** installed ([Get Docker](https://docs.docker.com/get-docker/))
- **Auth0 account** (free tier: [https://auth0.com/signup](https://auth0.com/signup))
- **Stripe account** (free test mode: [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register))

## Quick Start (Docker)

### 1. Get Your Auth0 Credentials

Go to [Auth0 Dashboard](https://manage.auth0.com/) and create:

**Create an API:**
1. Navigate to **Applications → APIs → Create API**
2. Name: `Stripe Auth0 API`
3. Identifier: `https://stripe-auth0-api` (save this - you'll need it)
4. Signing Algorithm: `RS256`
5. Click **Create**

**Create a Single Page Application:**
1. Navigate to **Applications → Applications → Create Application**
2. Name: `Stripe Auth0 Frontend`
3. Choose: **Single Page Web Applications**
4. Click **Create**
5. Go to **Settings** tab and note:
   - **Domain** (e.g., `dev-xxxxx.us.auth0.com`)
   - **Client ID** (e.g., `abcd1234...`)
6. Scroll down to **Application URIs** and add:
   - **Allowed Callback URLs**: `http://localhost:3000`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
7. Click **Save Changes**

**You should now have:**
- ✅ Domain (e.g., `dev-xxxxx.us.auth0.com`)
- ✅ Client ID (e.g., `abcd1234...`)
- ✅ API Identifier (e.g., `https://stripe-auth0-api`)

### 2. Get Your Stripe Credentials

Go to [Stripe Dashboard](https://dashboard.stripe.com/):

1. **Ensure you're in Test Mode** (toggle in top right should show "Test mode")
2. Navigate to **Developers → API keys**
3. Copy these two keys:
   - **Publishable key**: starts with `pk_test_...`
   - **Secret key**: Click "Reveal test key" and copy (starts with `sk_test_...`)

**You should now have:**
- ✅ Publishable Key (e.g., `pk_test_51...`)
- ✅ Secret Key (e.g., `sk_test_51...`)

### 3. Configure Environment Variables

Create your `.env` file from the example:

```bash
# In the stripe-auth0 directory
cp .env.example .env
```

**Edit `.env` with your credentials from Steps 1 & 2:**

```env
# Auth0 Configuration - From Step 1
AUTH0_DOMAIN=dev-xxxxx.us.auth0.com
AUTH0_AUDIENCE=https://stripe-auth0-api
REACT_APP_AUTH0_DOMAIN=dev-xxxxx.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=abcd1234...
REACT_APP_AUTH0_AUDIENCE=https://stripe-auth0-api

# Stripe Configuration - From Step 2
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Webhook Secret - Leave as placeholder for now
STRIPE_WEBHOOK_SECRET=whsec_placeholder
```

### 4. Start the Application

```bash
docker-compose up -d
```

This starts three services:
- **Backend** (http://localhost:5000)
- **Frontend** (http://localhost:3000)
- **Stripe CLI** (for webhook forwarding)

### 5. Get Webhook Secret from Stripe CLI

The Stripe CLI container automatically forwards webhooks, but you need to get the webhook secret:

```bash
# View the Stripe CLI logs
docker-compose logs stripe-cli
```

Look for output like:
```
Ready! Your webhook signing secret is whsec_abc123xyz...
```

**Copy the `whsec_...` value and update your `.env` file:**
```env
STRIPE_WEBHOOK_SECRET=whsec_abc123xyz...
```

**Restart the backend to apply the new secret:**
```bash
docker-compose restart backend
```

✅ All services are now running!

## Testing the Application

### Test the Complete Flow

1. **Open the app**: Navigate to http://localhost:3000
2. **Log in**: Click "Log In" and complete Auth0 authentication
3. **Make a test payment**: Click "Buy Now" and enter test card details:
   - **Card number**: `4242 4242 4242 4242` (successful payment)
   - **Expiry**: Any future date (e.g., `12/34`)
   - **CVC**: Any 3 digits (e.g., `123`)
   - **ZIP**: Any 5 digits (e.g., `12345`)
4. **Verify success**: You should be redirected to the success page

### Other Test Cards

- **Requires 3D authentication**: `4000 0027 6000 3184`
- **Payment declined**: `4000 0000 0000 0002`

### Verify Webhooks

Check the Stripe CLI container logs:
```bash
docker-compose logs -f stripe-cli
```

You should see:
```
→ POST http://backend:5000/api/webhooks/stripe [200]
```

Check the backend container logs:
```bash
docker-compose logs -f backend
```

You should see:
```
PaymentIntent pi_xxx succeeded
Payment successful for user auth0|xxx: 20.00 USD
```

## Useful Docker Commands

```bash
# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f stripe-cli

# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart backend

# Rebuild and restart after code changes
docker-compose up -d --build

# View running containers
docker-compose ps
```

## Project Structure

```
stripe-auth0/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── config/         # Auth0 & Stripe configuration
│   │   ├── middleware/     # JWT validation
│   │   ├── routes/         # API endpoints
│   │   └── services/       # Payment logic
│   └── .env               # Backend environment variables
│
└── frontend/               # React application
    ├── src/
    │   ├── components/    # UI components
    │   └── pages/        # Page components
    └── .env              # Frontend environment variables
```

## Key Features

- **Secure Authentication**: Auth0 JWT validation on all payment endpoints
- **Payment Processing**: Stripe Payment Intents with 3D Secure support
- **Webhook Handling**: Automated payment confirmation via Stripe webhooks
- **Security**: CORS, rate limiting, Helmet headers, webhook signature verification

## Common Issues

### "Invalid token" errors
- Verify `AUTH0_AUDIENCE` and `REACT_APP_AUTH0_AUDIENCE` match in `.env`
- Ensure Auth0 domain has no `https://` prefix
- Restart services: `docker-compose restart`

### "Webhook signature verification failed"
- Get the webhook secret from Stripe CLI logs: `docker-compose logs stripe-cli`
- Update `STRIPE_WEBHOOK_SECRET` in `.env`
- Restart backend: `docker-compose restart backend`

### Services not starting
- Check if ports 3000 or 5000 are already in use
- View logs: `docker-compose logs`
- Try rebuilding: `docker-compose down && docker-compose up -d --build`

### Payment form not loading
- Verify `REACT_APP_STRIPE_PUBLISHABLE_KEY` is set correctly in `.env`
- Check frontend logs: `docker-compose logs frontend`
- Check browser console for errors

### Stripe CLI not authenticated
- The stripe-cli container uses `STRIPE_SECRET_KEY` for authentication
- Verify your Stripe secret key is correct in `.env`
- Check stripe-cli logs: `docker-compose logs stripe-cli`

## What's Next?

- Add a database to store user-customer mappings (currently in-memory)
- Implement email notifications for payment confirmations
- Add order history page
- Support multiple products/pricing tiers

---

**Tech Stack:** Auth0 · Stripe · Node.js · Express · React · Docker
