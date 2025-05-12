# DMV.gg

A modern, interactive DMV practice test application built with Next.js and Tailwind CSS.

## Getting Started

1. Clone the repository `git clone https://github.com/alvropena/dmv.gg.git`
2. Install dependencies: `npm install`
3. Create `.env` file from `.env.example` and configure:
   - Clerk authentication keys from your Clerk dashboard
   - Stripe API keys and product IDs from your Stripe dashboard
   - Database connection string
   - Resend API key for email functionality

## Complete Setup

### 1. Database Setup

```bash
# Reset database and apply migrations
npx prisma migrate reset --force
```

Suggestion: Use TablePlus for visualization.

### 2. Stripe Setup

```bash
# Install Stripe CLI (if not already installed)
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Start webhook listener (in a separate terminal)
stripe listen --forward-to localhost:3000/api/webhooks
```

### 4. Start the Application

```bash
npm run dev
```

## Marketing

### Email System Architecture

The email system is built with a modular, event-driven architecture that supports both scheduled and trigger-based campaigns. Here's a detailed breakdown:

#### Core Components

1. **Email API Endpoint** (`/api/email/send/route.ts`):
   - Handles both manual and automated email sending
   - Processes CRON job execution (hourly via `vercel.json`)
   - Manages campaign status lifecycle
   - Creates and tracks sent email records
   - Handles error states and retries
   - Supports individual email sending for testing

2. **Email Core** (`/lib/email.ts`):
   - Provides core email functionality through Resend API
   - Manages recipient segmentation and filtering
   - Handles email template processing
   - Processes trigger-based campaigns
   - Returns standardized email results
   - Implements error handling and logging

3. **Template System** (`/lib/email/template.ts`):
   - Processes dynamic template variables
   - Supports user-specific data insertion
   - Available variables:

     ```typescript
     {{Users.firstName}}
     {{Users.lastName}}
     {{Users.email}}
     {{Users.role}}
     {{Users.createdAt}}
     {{Users.emailMarketing}}
     {{Users.studyTips}}
     {{Users.testReminders}}
     {{Users.weakAreasAlerts}}
     ```

4. **Database Triggers** (`/lib/db/triggers.ts`):
   - Implements Prisma middleware for automatic email triggers
   - Handles user-related events:
     - User signup notifications
     - Subscription status changes
   - Integrates with the email system for immediate responses

#### Campaign Types

1. **Scheduled Campaigns**:
   - Set for specific dates and times
   - Processed by hourly CRON job
   - Supports recurring schedules
   - Can target specific user segments

2. **Trigger-based Campaigns**:
   - Automatically triggered by user actions
   - Immediate processing
   - Supports multiple trigger types:
     - `USER_SIGNUP`
     - `PURCHASE_COMPLETED`
     - More triggers can be added as needed

#### Recipient Segments

1. **ALL_USERS**:
   - All users with `emailMarketing: true`
   - Respects user preferences
   - Excludes unsubscribed users

2. **TEST_USERS**:
   - Users with `role: "TEST"`
   - Must have opted in to marketing
   - Used for testing new campaigns

3. **INDIVIDUAL_USERS**:
   - Single user targeting
   - Requires explicit email address
   - Validates user opt-in status

#### Status Tracking

1. **Campaign Status**:

   ```typescript
   DRAFT      // Initial state
   SCHEDULED  // Ready for sending
   SENDING    // In progress
   COMPLETED  // Successfully sent
   FAILED     // Error occurred
   CANCELLED  // Manually stopped
   ```

2. **Email Status**:

   ```typescript
   SENT       // Successfully sent
   FAILED     // Delivery failed
   PENDING    // Queued for sending
   DELIVERED  // Reached inbox
   OPENED     // Viewed by recipient
   CLICKED    // Link clicked
   BOUNCED    // Delivery failed
   COMPLAINED // Marked as spam
   ```

#### Security & Best Practices

1. **Access Control**:
   - Admin-only access for manual sending
   - CRON job authentication
   - Rate limiting on API endpoints

2. **Data Protection**:
   - Respects user email preferences
   - Secure template variable processing
   - No sensitive data in templates

3. **Error Handling**:
   - Comprehensive error tracking
   - Failed email logging
   - Automatic retry mechanism
   - Detailed error reporting

4. **Monitoring**:
   - Campaign status tracking
   - Email delivery monitoring
   - Error rate tracking
   - Performance metrics

#### Usage Examples

1. **Creating a Trigger Campaign**:

   ```typescript
   await db.emailCampaign.create({
     data: {
       name: "Welcome Email",
       type: "TRIGGER",
       triggerType: "USER_SIGNUP",
       subject: "Welcome to DMV.gg!",
       content: "Hello {{Users.firstName}}, welcome to DMV.gg!",
       recipientSegment: "INDIVIDUAL_USERS",
       active: true
     }
   });
   ```

2. **Sending Individual Email**:

   ```typescript
   await sendEmail({
     to: "user@example.com",
     subject: "Test Email",
     html: "Hello {{Users.firstName}}!"
   });
   ```

3. **Processing Templates**:

   ```typescript
   const processed = await processTemplateVariables(
     "Hello {{Users.firstName}}!",
     "user@example.com"
   );
   ```
