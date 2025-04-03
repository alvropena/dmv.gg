import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

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
      .filter(price => productMap.has(price.product as string))
      .map(price => {
        const product = productMap.get(price.product as string)!;
        return {
          id: price.id,
          name: product.name,
          description: product.description,
          unitAmount: price.unit_amount,
          currency: price.currency,
          type: price.type,
          interval: price.recurring?.interval,
          features: product.metadata.features ? JSON.parse(product.metadata.features) : [],
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