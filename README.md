# DMV.gg

A modern, interactive DMV practice test application built with Next.js and Tailwind CSS.

## Getting Started

1. Clone the repository `git clone https://github.com/alvropena/dmv.gg.git`
2. Install dependencies: `npm install`
3. Create `.env` file from `.env.example` and configure:
   - Clerk authentication keys from your Clerk dashboard
   - Stripe API keys and product IDs from your Stripe dashboard
   - Database connection string

## Complete Setup

### 1. Database Setup

```bash
# Reset database and apply migrations
npx prisma migrate reset --force
```

Suggestion: Use TablePlus for visualization.

### 2. Stripe Setup

```bash
# Install Stripe CLI (if not already installed)
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Start webhook listener (in a separate terminal)
stripe listen --forward-to localhost:3000/api/webhooks
```

### 4. Start the Application

```bash
npm run dev
```
