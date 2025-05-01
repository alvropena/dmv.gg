import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';

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
            react: WelcomeEmail({ firstName: firstName || 'there' })
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return NextResponse.json({ error: "Failed to send welcome email" }, { status: 500 });
    }
} 