import { GrowthBook } from '@growthbook/growthbook';

interface PriceVariation {
  priceId: string;
  multiplier: number;
  userId: string | null;
}

// Create a singleton instance of GrowthBook
const growthbook = new GrowthBook({
  apiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST || 'https://cdn.growthbook.io',
  clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY || '',
  enableDevMode: process.env.NODE_ENV === 'development',
});

// Set up tracking callback
growthbook.setTrackingCallback(() => {
  // Tracking callback intentionally left blank
});

// Helper function to get price variations
export const getPriceVariation = (priceId: string, userId: string): PriceVariation => {
  const variation = growthbook.getFeatureValue<PriceVariation>('price-variations', {
    priceId,
    multiplier: 1.0,
    userId: null,
  });

  return {
    ...variation,
    userId,
  };
};

// Helper function to track events
export const trackEvent = (eventName: string, properties?: Record<string, string | number | boolean>) => {
  growthbook.setAttributes({
    ...growthbook.getAttributes(),
    lastEvent: eventName,
    lastEventProperties: properties
  });
};

export default growthbook; 