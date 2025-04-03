import { stripe } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const PRICE_IDS = {
  weekly: process.env.STRIPE_PRICE_ID_WEEKLY,
  monthly: process.env.STRIPE_PRICE_ID_MONTHLY,
  lifetime: process.env.STRIPE_PRICE_ID_LIFETIME,
} as const;

type PlanType = keyof typeof PRICE_IDS;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { plan } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!plan || !(plan in PRICE_IDS)) {
      return new NextResponse('Invalid plan type. Must be one of: weekly, monthly, lifetime', { status: 400 });
    }

    const priceId = PRICE_IDS[plan as PlanType];

    if (!priceId) {
      return new NextResponse(`Price ID not found for plan: ${plan}`, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error('NEXT_PUBLIC_APP_URL is not set');
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: plan === 'lifetime' ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=false`,
      metadata: {
        userId,
      },
      subscription_data: plan !== 'lifetime' ? {
        metadata: {
          userId,
        },
      } : undefined,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 