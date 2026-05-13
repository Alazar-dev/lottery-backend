import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  //@ts-ignore
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  family: 4,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    if (!process.env.EMAIL_ID || !process.env.EMAIL_PASS) {
      throw new Error("EMAIL_ID or EMAIL_PASS is missing");
    }

    await transporter.sendMail({
      from: process.env.EMAIL_ID,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    });

    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw error;
  }
};
