import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

export async function sendEmail({ to, subject, html, from = "DMV.gg <noreply@dmv.gg>" }: SendEmailParams) {
    try {
        const { data, error } = await resend.emails.send({
            from,
            to,
            subject,
            html,
        });

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
} 