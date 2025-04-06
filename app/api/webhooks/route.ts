import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import crypto from 'crypto';

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
  } catch (error) {
    console.error('Error constructing event:', error);
    return new NextResponse('Webhook error', { status: 400 });
  }

  try {
    console.log(`Processing webhook event: ${event.type}`);
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Session data:', JSON.stringify({
          id: session.id,
          mode: session.mode,
          metadata: session.metadata,
          customer: session.customer,
          subscription: session.subscription
        }, null, 2));
        
        const clerkId = session.metadata?.userId;
        const priceId = session.metadata?.priceId;

        console.log(`ClerkId: ${clerkId}, PriceId: ${priceId}`);

        if (!clerkId) {
          throw new Error('No userId in session metadata');
        }

        if (!priceId) {
          throw new Error('No priceId in session metadata');
        }

        // Find the user by their clerkId
        console.log(`Looking for user with clerkId: ${clerkId}`);
        const user = await db.user.findUnique({
          where: { clerkId }
        });

        console.log('User found?', !!user);
        
        if (!user) {
          throw new Error(`User with clerkId ${clerkId} not found`);
        }

        console.log('User details:', JSON.stringify({
          id: user.id,
          email: user.email,
          clerkId: user.clerkId
        }, null, 2));

        // For one-time payments (lifetime plan)
        if (session.mode === 'payment') {
          console.log('Processing one-time payment (lifetime plan)');
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
          console.log('Created lifetime subscription successfully');
        } 
        // For subscriptions (monthly/weekly plans)
        else if (session.mode === 'subscription' && session.subscription) {
          console.log('Processing subscription payment (weekly/monthly plan)');
          console.log(`Fetching subscription details for: ${session.subscription}`);
          // Fetch the subscription to get the current period dates
          const subscriptionData = await stripe.subscriptions.retrieve(session.subscription as string);
          const subscription = subscriptionData as unknown as StripeSubscriptionWithTimestamps;
          console.log('Subscription status:', subscription.status);
          
          // Log the timestamp values to debug
          console.log('Raw timestamps:', {
            current_period_start: subscription.current_period_start,
            current_period_end: subscription.current_period_end,
          });
          
          // Safely convert Unix timestamps to Date objects
          const startDate = subscription.current_period_start 
            ? new Date(subscription.current_period_start * 1000) 
            : new Date();
            
          const endDate = subscription.current_period_end 
            ? new Date(subscription.current_period_end * 1000) 
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default to 30 days in the future
          
          console.log('Converted dates:', {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          });
          
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
          console.log('Created recurring subscription successfully');
        } else {
          console.log('Session mode or subscription missing', { mode: session.mode, subscription: session.subscription });
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
        
        console.log(`Updating subscription ${subscription.id} to status: ${subscription.status}`);
        
        try {
          const result = await db.subscription.updateMany({
            where: {
              stripeSubscriptionId: subscription.id,
            },
            data: {
              status: subscription.status,
              currentPeriodStart: startDate,
              currentPeriodEnd: endDate,
            },
          });
          
          console.log(`Updated ${result.count} subscription records`);
          
          if (result.count === 0) {
            console.warn(`No subscription found with stripeSubscriptionId: ${subscription.id}`);
          }
        } catch (error) {
          console.error('Error updating subscription:', error);
          throw error;
        }
        break;
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    console.error('Error details:', error instanceof Error ? error.stack : 'Unknown error');
    return new NextResponse(`Webhook handler failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 400 });
  }
} 