import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

// Default price IDs from environment variables
const DEFAULT_PRICE_IDS = [
  process.env.STRIPE_PRICE_ID_WEEKLY,
  process.env.STRIPE_PRICE_ID_MONTHLY,
  process.env.STRIPE_PRICE_ID_LIFETIME,
].filter(Boolean) as string[];

export async function GET() {
  try {
    const [products, prices] = await Promise.all([
      stripe.products.list({ active: true }),
      stripe.prices.list({ active: true }),
    ]);

    // Create a map of product IDs to their details
    const productMap = new Map(products.data
      // Filter only DMV.gg products
      .filter(product =>
        // Filter by product name containing "DMV.gg"
        product.name.includes('DMV.gg') ||
        // OR filter by a specific metadata flag if you have one set up
        product.metadata.project === 'dmv'
      )
      .map(product => [product.id, product])
    );

    // Group prices by product and format the response
    const formattedPrices = prices.data
      // Only include prices that are in our default price IDs list
      .filter(price => DEFAULT_PRICE_IDS.includes(price.id) && productMap.has(price.product as string))
      .map(price => {
        const product = productMap.get(price.product as string) || {
          name: '',
          description: '',
          metadata: { features: '' }
        };

        // Parse features from metadata if available
        let features: string[] = [];
        try {
          if (product.metadata.features) {
            features = JSON.parse(product.metadata.features);
          }
        } catch (e) {
          console.error('Error parsing features:', e);
          // If features can't be parsed, try to use a comma-separated list
          features = product.metadata.features ? product.metadata.features.split(',').map((f: string) => f.trim()) : [];
        }

        return {
          id: price.id,
          name: product.name.replace('DMV.gg ', ''),
          description: product.description,
          unitAmount: price.unit_amount,
          currency: price.currency,
          type: price.type,
          interval: price.recurring?.interval,
          features: features,
          metadata: product.metadata,
        };
      })
      .sort((a, b) => {
        // Sort by price type (subscription first) and amount
        if (a.type === 'recurring' && b.type !== 'recurring') return -1;
        if (a.type !== 'recurring' && b.type === 'recurring') return 1;
        return (a.unitAmount || 0) - (b.unitAmount || 0);
      });

    return NextResponse.json(formattedPrices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    return new NextResponse('Error fetching prices', { status: 500 });
  }
} 