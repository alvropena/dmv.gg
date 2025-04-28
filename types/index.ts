export type UserRole = 'STUDENT' | 'ADMIN';

export type Subscription = {
  id: string;
  userId: string;
  stripeCustomerId: string | null;
  stripePriceId: string | null;
  stripeSubscriptionId: string | null;
  status: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  birthday?: Date | null;
  role: UserRole;
  hasUsedFreeTest: boolean;
  createdAt: Date;
  updatedAt: Date;
  subscriptions: Subscription[];
  tests?: Test[];
  supportRequests?: SupportRequest[];
};

export interface Question {
  id: string;
  title: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD?: string | null;
  image?: string | null;
  correctAnswer: string;
  explanation: string
  createdAt: Date;
  updatedAt: Date;
  flags?: FlaggedQuestion[];
}

export type FlaggedQuestion = {
  id: string;
  questionId: string;
  userId: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  adminNotes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
  question?: Question;
  user?: User;
};

export type AuthContextType = {
  dbUser: User | null;
  isLoading: boolean;
  hasActiveSubscription: boolean;
  refreshUser: () => Promise<void>;
};

export type Test = {
  id: string;
  userId: string;
  startedAt: Date;
  completedAt: Date | null;
  score: number;
  totalQuestions: number;
  status: string; // "in_progress", "completed", "abandoned"
  answers?: TestAnswer[];
  questions?: TestQuestion[];
  createdAt: Date;
  updatedAt: Date;
};

export type TestQuestion = {
  testId: string;
  questionId: string;
  order: number;
  question?: Question;
  createdAt: Date;
  updatedAt: Date;
};

export type TestAnswer = {
  testId: string;
  questionId: string;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  answeredAt: Date | null;
  question?: Question;
  createdAt: Date;
  updatedAt: Date;
};

export type SupportRequest = {
  id: string;
  userId: string | null;
  email: string | null;
  message: string;
  status: string; // "open", "in_progress", "resolved", "closed"
  resolution: string | null;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
}; 