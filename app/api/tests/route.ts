import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

// Maximum number of questions per test
const MAX_QUESTIONS_PER_TEST = 46;

// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Create a new test
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const { type = 'NEW', questionIds, originalTestId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user from the database with subscriptions
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        role: true,
        hasUsedFreeTest: true,
        subscriptions: {
          select: {
            status: true,
            currentPeriodEnd: true
          }
        }
      }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has an active subscription or is an ADMIN
    const hasActiveSubscription = dbUser.subscriptions.some(
      (sub: { status: string; currentPeriodEnd: Date }) =>
        sub.status === 'active' && new Date(sub.currentPeriodEnd) > new Date()
    );
    const isAdmin = dbUser.role === 'ADMIN';

    // If user has no active subscription, is not an ADMIN, and has used their free test
    if (!hasActiveSubscription && !isAdmin && dbUser.hasUsedFreeTest) {
      return NextResponse.json(
        { error: 'Please subscribe to create more tests' },
        { status: 403 }
      );
    }

    let selectedQuestions;

    switch (type) {
      case 'REVIEW': {
        if (!originalTestId) {
          return NextResponse.json(
            { error: 'Original test ID is required for review' },
            { status: 400 }
          );
        }

        // Get questions from the original test
        const originalTest = await db.test.findUnique({
          where: { id: originalTestId },
          include: {
            questions: {
              include: {
                question: true
              }
            }
          }
        });

        if (!originalTest) {
          return NextResponse.json(
            { error: 'Original test not found' },
            { status: 404 }
          );
        }

        selectedQuestions = originalTest.questions.map(q => q.question);
        break;
      }

      case 'WEAK_AREAS': {
        // Get all completed tests for the user
        const completedTests = await db.test.findMany({
            where: {
                userId: dbUser.id,
                status: 'completed'
            },
            include: {
                answers: {
                    where: {
                        isCorrect: false
                    },
                    select: {
                        questionId: true
                    }
                }
            }
        });

        // Get unique question IDs from incorrect answers
        const incorrectQuestionIds = Array.from(new Set(
            completedTests.flatMap(test => 
                test.answers.map(answer => answer.questionId)
            )
        ));

        if (incorrectQuestionIds.length === 0) {
            return NextResponse.json(
                { error: 'No weak areas found. Complete more tests first.' },
                { status: 400 }
            );
        }

        // Get the questions
        selectedQuestions = await db.question.findMany({
            where: {
                id: {
                    in: incorrectQuestionIds
                }
            }
        });

        // Shuffle and limit the number of questions if needed
        selectedQuestions = shuffleArray(selectedQuestions).slice(0, MAX_QUESTIONS_PER_TEST);
        break;
      }

      case 'NEW':
      default: {
        // Get all questions excluding those from incomplete tests
        const incompleteTests = await db.test.findMany({
          where: {
            userId: dbUser.id,
            status: 'in_progress'
          },
          select: {
            questions: {
              select: {
                questionId: true
              }
            }
          }
        });

        const excludeQuestionIds = incompleteTests.flatMap(test =>
          test.questions.map(q => q.questionId)
        );

        const allQuestions = await db.question.findMany({
          where: {
            id: {
              notIn: excludeQuestionIds
            }
          }
        });

        selectedQuestions = shuffleArray(allQuestions).slice(0, MAX_QUESTIONS_PER_TEST);
        break;
      }
    }

    // Create a new test
    const test = await db.test.create({
      data: {
        userId: dbUser.id,
        type,
        totalQuestions: selectedQuestions.length,
        status: 'in_progress',
      },
    });

    // If this is a free test (NEW type only), mark it as used
    if (!hasActiveSubscription && type === 'NEW') {
      await db.user.update({
        where: { id: dbUser.id },
        data: {
          hasUsedFreeTest: true,
          updatedAt: new Date()
        }
      });
    }

    // Create TestQuestion entries for the selected questions
    for (let i = 0; i < selectedQuestions.length; i++) {
      await db.testQuestion.create({
        data: {
          testId: test.id,
          questionId: selectedQuestions[i].id,
          order: i,
        },
      });
    }

    // Create initial test answers for the selected questions
    for (const question of selectedQuestions) {
      await db.testAnswer.create({
        data: {
          testId: test.id,
          questionId: question.id,
        },
      });
    }

    return NextResponse.json({ test });
  } catch (error) {
    console.error('Error creating test:', error);
    return NextResponse.json(
      { error: 'Failed to create test' },
      { status: 500 }
    );
  }
}

// Get all tests for the current user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user from the database
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get tests with their answers
    const tests = await db.test.findMany({
      where: {
        userId: dbUser.id
      },
      orderBy: {
        startedAt: 'desc'
      },
      include: {
        answers: true
      }
    });

    return NextResponse.json({ tests });
  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
} 