# DMV.gg

A modern, interactive DMV practice test application built with Next.js and Tailwind CSS.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## Stripe

### Local Webhook Setup
1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Login to Stripe: `stripe login`
3. Forward webhooks to localhost: `stripe listen --forward-to localhost:3000/api/webhooks`
4. Copy the webhook signing secret and add it to your .env file:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx...
   ``` 