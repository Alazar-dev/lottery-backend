import mongoose, { Document } from "mongoose";

export interface IOtp extends Document {
    email: string;
    otp: string;
    expiresAt: Date;
}

const schema = new mongoose.Schema<IOtp>({
    email: String,
    otp: String,
    expiresAt: Date,
}, { timestamps: true });

export default mongoose.model<IOtp>("Otp", schema)