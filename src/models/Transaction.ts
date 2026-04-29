import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
    userId: Schema.Types.ObjectId;

    amount: number;

    type: "PAYMENT" | "WIN";

    status: "PENDING" | "SUCCESS";

    chapaTxRef?: string;
}

const transactionSchema = new mongoose.Schema<ITransaction>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        type: {
            type: String,
            enum: ["PAYMENT", "WIN"],
            required: true,
        },

        status: {
            type: String,
            enum: ["PENDING", "SUCCESS"],
            default: "SUCCESS",
        },

        chapaTxRef: String,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ITransaction>(
    "Transaction",
    transactionSchema
);