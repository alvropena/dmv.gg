import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the subscription ID from the request body
    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return new NextResponse("Subscription ID is required", { status: 400 });
    }

    // Get the subscription from our database
    const subscription = await db.subscription.findUnique({
      where: {
        id: subscriptionId,
      },
      include: {
        user: true,
      },
    });

    if (!subscription) {
      return new NextResponse("Subscription not found", { status: 404 });
    }

    // Verify the subscription belongs to the authenticated user
    if (subscription.user.clerkId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Make sure there's a Stripe subscription ID
    if (!subscription.stripeSubscriptionId) {
      return new NextResponse("Not a recurring subscription", { status: 400 });
    }

    // Cancel the subscription in Stripe - this will cancel at period end
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update our database to reflect that this subscription will cancel at period end
    // The status remains 'active' until the period ends, but cancelAtPeriodEnd is set to true
    await db.subscription.update({
      where: {
        id: subscriptionId,
      },
      data: {
        cancelAtPeriodEnd: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription will be canceled at the end of the billing period",
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal server error",
      { status: 500 }
    );
  }
} 