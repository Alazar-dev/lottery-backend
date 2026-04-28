import { Request, Response } from "express";
import User from "../models/User";
import Otp from "../models/Otp";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/sendEmail";

export const requestOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendOtpEmail(email, otp);

        res.json({ message: "OTP sent" });
    } catch (err) {
        res.status(500).json({ message: "Error sending OTP" });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        const record = await Otp.findOne({ email, otp });

        if (!record || record.expiresAt < new Date()) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({ email });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        await Otp.findOneAndDelete({ otp })

        res.json({ token, user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error verifying OTP" });
    }
};