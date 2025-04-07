import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { db } from '@/lib/db';
import crypto from 'node:crypto';

// Define a more specific type for Subscription with timestamps
interface StripeSubscriptionWithTimestamps extends Stripe.Subscription {
  current_period_start: number;
  current_period_end: number;
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse('Webhook signature or secret missing', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return new NextResponse('Webhook error', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const clerkId = session.metadata?.userId;
        const priceId = session.metadata?.priceId;

        if (!clerkId) {
          throw new Error('No userId in session metadata');
        }

        if (!priceId) {
          throw new Error('No priceId in session metadata');
        }

        // Find the user by their clerkId
        const user = await db.user.findUnique({
          where: { clerkId }
        });

        if (!user) {
          throw new Error(`User with clerkId ${clerkId} not found`);
        }

        // For one-time payments (lifetime plan)
        if (session.mode === 'payment') {
          await db.subscription.create({
            data: {
              id: crypto.randomUUID(), // Generate UUID to match the schema
              userId: user.id, // Use the numeric ID from our database
              stripeCustomerId: session.customer as string,
              stripePriceId: priceId,
              status: 'active',
              // For lifetime plans, set a far future end date
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date('2099-12-31'),
            },
          });
        }
        // For subscriptions (monthly/weekly plans)
        else if (session.mode === 'subscription' && session.subscription) {
          // Fetch the subscription to get the current period dates
          const subscriptionData = await stripe.subscriptions.retrieve(session.subscription as string);
          const subscription = subscriptionData as unknown as StripeSubscriptionWithTimestamps;

          // Safely convert Unix timestamps to Date objects
          const startDate = subscription.current_period_start
            ? new Date(subscription.current_period_start * 1000)
            : new Date();

          const endDate = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default to 30 days in the future

          await db.subscription.create({
            data: {
              id: crypto.randomUUID(), // Generate UUID to match the schema
              userId: user.id, // Use the numeric ID from our database
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              stripePriceId: priceId,
              status: subscription.status,
              currentPeriodStart: startDate,
              currentPeriodEnd: endDate,
            },
          });
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscriptionObject = event.data.object as Stripe.Subscription;
        const subscription = subscriptionObject as unknown as StripeSubscriptionWithTimestamps;

        // Safely convert Unix timestamps to Date objects
        const startDate = subscription.current_period_start
          ? new Date(subscription.current_period_start * 1000)
          : new Date();

        const endDate = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await db.subscription.updateMany({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            status: subscription.status,
            currentPeriodStart: startDate,
            currentPeriodEnd: endDate,
          },
        });
        break;
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse(`Webhook handler failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 400 });
  }
} 