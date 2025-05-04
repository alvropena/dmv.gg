import { NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { email, firstName } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        await resend.emails.send({
            from: 'DMV.gg <support@dmv.gg>',
            to: [email],
            subject: 'Welcome to DMV.gg!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #4F46E5;">Welcome to DMV.gg!</h1>
                    <p>Hi ${firstName || 'there'},</p>
                    <p>Thank you for joining DMV.gg! We're excited to have you on board.</p>
                    <p>With DMV.gg, you'll have access to:</p>
                    <ul>
                        <li>Comprehensive DMV practice tests</li>
                        <li>Detailed explanations for each question</li>
                        <li>Progress tracking and performance analytics</li>
                    </ul>
                    <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                    <p>Best regards,<br>The DMV.gg Team</p>
                </div>
            `
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return NextResponse.json({ error: "Failed to send welcome email" }, { status: 500 });
    }
} 