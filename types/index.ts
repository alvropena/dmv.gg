export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  TEST = 'TEST',
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

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  NON_BINARY = "non-binary",
  OTHER = "other",
  PREFER_NOT_TO_SAY = "prefer-not-to-say"
}

export enum Ethnicity {
  WHITE = "white",
  BLACK = "black",
  ASIAN = "asian",
  HISPANIC = "hispanic",
  OTHER = "other",
  PREFER_NOT_TO_SAY = "prefer-not-to-say"
}

export enum Language {
  EN = "en",
  ES = "es"
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  birthday: Date | null;
  gender: Gender | null;
  ethnicity: Ethnicity | null;
  language: Language | null;
  role: UserRole;
  hasUsedFreeTest: boolean;
  // Email Notifications
  emailMarketing: boolean;
  emailUpdates: boolean;
  emailSecurity: boolean;
  // Product Notifications
  testReminders: boolean;
  studyTips: boolean;
  progressUpdates: boolean;
  weakAreasAlerts: boolean;
  // Marketing Preferences
  promotionalEmails: boolean;
  newsletter: boolean;
  createdAt: Date;
  updatedAt: Date;
  subscriptions?: Subscription[];
  tests?: Test[];
  supportRequests?: SupportRequest[];
  flaggedQuestions?: FlaggedQuestion[];
}

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

export type Creator = {
  id: string;
  name: string;
  handle: string;
  category: string;
  followers: number;
  engagement: number;
  status: string;
  platforms: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type Reminder = {
  id: string;
  text: string;
  completed: boolean;
  archived: boolean;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type EmailCampaign = {
  id: string;
  name: string;
  description: string | null;
  subject: string;
  content: string;
  from: string;
  status: string; // 'draft', 'scheduled', 'sending', 'completed', 'failed'
  active: boolean;
  type: CampaignType;
  scheduleType: ScheduleType;
  triggerType: EmailTriggerType | null;
  scheduledFor: Date | null;
  recipientSegment: RecipientSegment;
  createdAt: Date;
  updatedAt: Date;
  sentEmails: SentEmail[];
};

export type SentEmail = {
  id: string;
  campaignId: string;
  campaign: EmailCampaign;
  recipientEmail: string;
  status: string; // 'pending', 'sent', 'failed', 'delivered', 'opened', 'clicked'
  sentAt: Date | null;
  deliveredAt: Date | null;
  openedAt: Date | null;
  clickedAt: Date | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export enum CampaignType {
  ONE_TIME = 'ONE_TIME',
  RECURRING = 'RECURRING',
  AB_TEST = 'AB_TEST',
}

export enum ScheduleType {
  TRIGGER = 'TRIGGER',
  SCHEDULE = 'SCHEDULE',
}

export enum EmailTriggerType {
  USER_SIGNUP = 'USER_SIGNUP',
  TEST_INCOMPLETE = 'TEST_INCOMPLETE',
  CART_ABANDONED = 'CART_ABANDONED',
  PROFILE_UPDATED = 'PROFILE_UPDATED',
  PURCHASE_COMPLETED = 'PURCHASE_COMPLETED',
}

export enum RecipientSegment {
  ALL_USERS = 'ALL_USERS',
  TEST_USERS = 'TEST_USERS',
  INDIVIDUAL_USER = 'INDIVIDUAL_USER',
} 