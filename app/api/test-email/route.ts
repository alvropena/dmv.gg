import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
    try {
        const data = await resend.emails.send({
            from: 'DMV.gg <support@dmv.gg>',
            to: ['me@alvropena.com'],
            subject: 'Test Welcome Email',
            react: WelcomeEmail({ firstName: 'John Doe' })
        });

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
} 