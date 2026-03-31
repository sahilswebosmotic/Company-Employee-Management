import nodemailer from 'nodemailer';
import { config } from '../config/env.js';
import { fileURLToPath } from 'url';

export const sendEmail = async (to: string, subject: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: config.EMAIL_HOST,
        port: config.EMAIL_PORT,
        secure: config.EMAIL_PORT === 465,
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Company Management" <${config.EMAIL_USER}>`,
        to,
        subject,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Check if file is run directly
const isMain = process.argv[1] && (process.argv[1] === fileURLToPath(import.meta.url));

if (isMain) {
    (async () => {
        console.log('--- Email utility self-test ---');
        try {
            await sendEmail("sahilsojitra273@gmail.com", "Test Email", "<h1>Email test successful!</h1>");
            console.log("Self-test completed: Success");
        } catch (error) {
            console.error("Self-test completed: Failed");
            if (error instanceof Error) {
                console.error("Reason:", error.message);
            }
        }
    })();
}
