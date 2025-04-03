export type Subscription = {
  id: string;
  userId: number;
  stripeCustomerId: string | null;
  stripePriceId: string | null;
  stripeSubscriptionId: string | null;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: number;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
  subscriptions: Subscription[];
  hasActiveSubscription?: boolean;
};

export type AuthContextType = {
  dbUser: User | null;
  isLoading: boolean;
  hasActiveSubscription: boolean;
}; 