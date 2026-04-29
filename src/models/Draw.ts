import mongoose, { Document } from "mongoose";

export interface IDraw extends Document {
    week: string;

    winningNumber: string;

    totalRevenue: number;

    prizePool: number;

    winners: mongoose.Types.ObjectId[];

    totalWinners: number;

    totalPayout: number;
}

const drawSchema = new mongoose.Schema<IDraw>(
    {
        week: {
            type: String,
            required: true,
            unique: true,
        },

        winningNumber: {
            type: String,
            required: true,
        },

        totalRevenue: {
            type: Number,
            required: true,
        },

        prizePool: {
            type: Number,
            required: true,
        },

        winners: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        totalWinners: {
            type: Number,
            default: 0,
        },

        totalPayout: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IDraw>(
    "Draw",
    drawSchema
);