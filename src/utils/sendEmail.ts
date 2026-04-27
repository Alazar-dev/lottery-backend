import nodemailer from 'nodemailer'

export const sendEmail = async (email: string, otp: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    transporter.sendmail({
        from: process.env.EMAIL_ID,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${email}`,
    })
}