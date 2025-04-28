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
        console.log('Processing checkout.session.completed:', {
          sessionId: session.id,
          mode: session.mode,
          metadata: session.metadata,
          customer: session.customer,
          subscription: session.subscription
        });

        const clerkId = session.metadata?.userId;
        const priceId = session.metadata?.priceId;

        if (!clerkId) {
          console.error('No userId in session metadata:', session.metadata);
          throw new Error('No userId in session metadata');
        }

        if (!priceId) {
          console.error('No priceId in session metadata:', session.metadata);
          throw new Error('No priceId in session metadata');
        }

        // Find the user by their clerkId
        const user = await db.user.findUnique({
          where: { clerkId }
        });

        if (!user) {
          console.error(`User with clerkId ${clerkId} not found`);
          throw new Error(`User with clerkId ${clerkId} not found`);
        }

        try {
          // For one-time payments (lifetime plan)
          if (session.mode === 'payment') {
            const now = new Date();
            await db.subscription.create({
              data: {
                id: crypto.randomUUID(),
                userId: user.id,
                stripeCustomerId: session.customer as string,
                stripePriceId: priceId,
                status: 'active',
                currentPeriodStart: now,
                // Use a far future date for lifetime plans (Year 2099)
                currentPeriodEnd: new Date('2099-12-31T23:59:59.999Z'),
              },
            });
            console.log('Created lifetime subscription for user:', user.id);
          }
          // For subscriptions (monthly/weekly plans)
          else if (session.mode === 'subscription' && session.subscription) {
            // Fetch the subscription to get the current period dates
            const subscriptionData = await stripe.subscriptions.retrieve(session.subscription as string);
            const subscription = subscriptionData as unknown as StripeSubscriptionWithTimestamps;

            // Ensure we have valid timestamps
            if (!subscription.current_period_start || !subscription.current_period_end) {
              throw new Error('Invalid subscription period dates');
            }

            // Convert Unix timestamps to Date objects
            const startDate = new Date(subscription.current_period_start * 1000);
            const endDate = new Date(subscription.current_period_end * 1000);

            // Validate the dates
            if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
              throw new Error('Invalid date conversion from Stripe timestamps');
            }

            await db.subscription.create({
              data: {
                id: crypto.randomUUID(),
                userId: user.id,
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                stripePriceId: priceId,
                status: subscription.status,
                currentPeriodStart: startDate,
                currentPeriodEnd: endDate,
              },
            });
            console.log('Created recurring subscription for user:', user.id);
          } else {
            console.error('Invalid session mode or missing subscription:', {
              mode: session.mode,
              subscription: session.subscription
            });
            throw new Error('Invalid session mode or missing subscription');
          }
        } catch (error) {
          console.error('Error creating subscription:', error);
          throw error;
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscriptionObject = event.data.object as Stripe.Subscription;
        const subscription = subscriptionObject as unknown as StripeSubscriptionWithTimestamps;

        // Get the start and end dates from the subscription
        const startDate = new Date(subscription.current_period_start * 1000);
        const endDate = new Date(subscription.current_period_end * 1000);

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