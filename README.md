# DMV.gg

A modern, interactive DMV practice test application built with Next.js and Tailwind CSS.

## Getting Started

1. Clone the repository `git clone https://github.com/alvropena/dmv.gg.git`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## Complete Setup

### 1. Database Setup

```bash
# Reset database and apply migrations
npx prisma migrate reset --force

# Insert questions into database
npx prisma db execute --file insert_questions.sql
```

### 2. Stripe Setup

```bash
# Install Stripe CLI (if not already installed)
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Start webhook listener (in a separate terminal)
stripe listen --forward-to localhost:3000/api/webhooks
```

### 3. Environment Variables

Make sure your `.env` file includes:

```bash
DATABASE_URL="postgresql://..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."  # Copy from stripe listen command output
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 4. Start the Application

```bash
npm run dev
```

## Stripe

### Local Webhook Setup

1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Login to Stripe: `stripe login`
3. Forward webhooks to localhost: `stripe listen --forward-to localhost:3000/api/webhooks`
4. Copy the webhook signing secret and add it to your .env file:

   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx...
   ```

## Database

```
npx prisma migrate reset --force
```

Insert questions into the Question table.

npx prisma db execute --file insert_questions.sql
