import mongoose, { Document, Schema } from "mongoose";

export interface ITicket extends Document {
    userId: Schema.Types.ObjectId;
    number: string;
    drawWeek: string;
    createdAt: Date;
}

const ticketSchema = new mongoose.Schema<ITicket>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        number: {
            type: String,
            required: true,
        },

        drawWeek: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

ticketSchema.index(
    {
        number: 1,
        drawWeek: 1,
    },
    {
        unique: true,
    }
);

export default mongoose.model<ITicket>("Ticket", ticketSchema);