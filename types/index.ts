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
  studySessions?: StudySession[];
  hasActiveSubscription?: boolean;
};

export interface Question {
  id: string;
  title: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD?: string;
  correctAnswer: string;
  explanation: string;
  createdAt: string;
  updatedAt: string;
}

export type AuthContextType = {
  dbUser: User | null;
  isLoading: boolean;
  hasActiveSubscription: boolean;
};

export type StudySession = {
  id: string;
  userId: string;
  startedAt: Date;
  completedAt: Date | null;
  durationSeconds?: number | null;
  score: number;
  totalQuestions: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  answers?: SessionAnswer[];
  createdAt: Date;
  updatedAt: Date;
};

export type SessionAnswer = {
  id: string;
  sessionId: string;
  questionId: string;
  question?: Question;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  answeredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}; 