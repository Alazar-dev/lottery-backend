import { Resend } from "resend";

export const sendOtpEmail = async (email: string, otp: string) => {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        throw new Error("RESEND_API_KEY is missing");
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || "Lottery App <onboarding@resend.dev>",
        to: [email],
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`,
    });

    if (error) {
        console.error("Failed to send OTP email:", error);
        throw new Error("Failed to send OTP email");
    }
};
