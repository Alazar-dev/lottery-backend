import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    role: 'ADMIN'| 'CUSTOMER';
    walletBalance: number;
}

const schema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'CUSTOMER'],
        default: 'CUSTOMER',
    },
    walletBalance: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

export default mongoose.model<IUser>("User", schema);