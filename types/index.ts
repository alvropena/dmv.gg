export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

export enum TestType {
  NEW = 'NEW',
  REVIEW = 'REVIEW',
  WEAK_AREAS = 'WEAK_AREAS',
}

export type Subscription = {
  id: string;
  userId: string;
  user: User;
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
  birthday: Date | null;
  role: UserRole;
  hasUsedFreeTest: boolean;
  createdAt: Date;
  updatedAt: Date;
  subscriptions: Subscription[];
  tests: Test[];
  supportRequests: SupportRequest[];
  flaggedQuestions: FlaggedQuestion[];
};

export type Question = {
  id: string;
  title: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string | null;
  image: string | null;
  correctAnswer: string;
  explanation: string;
  createdAt: Date;
  updatedAt: Date;
  answers: TestAnswer[];
  tests: TestQuestion[];
  flags: FlaggedQuestion[];
};

export type Test = {
  id: string;
  userId: string;
  user: User;
  type: TestType;
  startedAt: Date;
  completedAt: Date | null;
  score: number;
  totalQuestions: number;
  status: string;
  answers: TestAnswer[];
  questions: TestQuestion[];
  createdAt: Date;
  updatedAt: Date;
};

export type TestQuestion = {
  testId: string;
  test: Test;
  questionId: string;
  question: Question;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TestAnswer = {
  testId: string;
  test: Test;
  questionId: string;
  question: Question;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  answeredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SupportRequest = {
  id: string;
  userId: string | null;
  user: User | null;
  email: string | null;
  message: string;
  status: string;
  resolution: string | null;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
};

export type FlaggedQuestion = {
  id: string;
  questionId: string;
  question: Question;
  userId: string;
  user: User;
  reason: string;
  status: string;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
};

export type AuthContextType = {
  dbUser: User | null;
  isLoading: boolean;
  hasActiveSubscription: boolean;
  refreshUser: () => Promise<void>;
}; 