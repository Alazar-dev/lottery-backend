import nodemailer from 'nodemailer'

export const sendOtpEmail = async (email: string, otp: string) => {
     const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        family: 4,
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASS,
        },
    });

    transporter.sendMail({
        from: process.env.EMAIL_ID,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`,
    })
}
