import { Request, Response } from "express";

import axios from "axios";

import { v4 as uuidv4 } from "uuid";

import Transaction from "../models/Transaction";

import User from "../models/User";

import Ticket from "../models/Ticket";

import { generateTicketNumber } from "../utils/generateTicketNumber";

import { getCurrentWeek } from "../utils/getCurrentWeek";


export const initiatePayment = async (
    req: Request,
    res: Response
) => {
    try {
        //@ts-ignore
        const userId = req.user?.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const tx_ref = uuidv4();

        await Transaction.create({
            userId,
            amount: 10,
            type: "PAYMENT",
            status: "PENDING",
            chapaTxRef: tx_ref,
        });

        const response = await axios.post(
            "https://api.chapa.co/v1/transaction/initialize",
            {
                amount: "10",
                currency: "ETB",
                email: user.email,
                first_name: "Lottery",
                last_name: "User",
                tx_ref,

                return_url:
                    `http://localhost:5173/dashboard?tx_ref=${tx_ref}`,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                },
            }
        );

        res.json({
            checkout_url: response.data.data.checkout_url,
        });
    } catch (err: any) {
        console.log(err.response?.data || err);

        res.status(500).json({
            message: "Payment initiation failed",
        });
    }
};

export const verifyPayment = async (
    req: Request,
    res: Response
) => {
    try {
        const tx_ref = req.query.tx_ref as string;

        console.log("VERIFY HIT");
        console.log(tx_ref);

        const verifyResponse = await axios.get(
            `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                },
            }
        );

        const paymentData = verifyResponse.data.data;

        if (paymentData.status !== "success") {
            return res.status(400).json({
                message: "Payment not successful",
            });
        }

        const transaction = await Transaction.findOne({
            chapaTxRef: tx_ref,
        });

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found",
            });
        }

        if (transaction.status === "SUCCESS") {
            return res.json({
                message: "Already processed",
            });
        }

        transaction.status = "SUCCESS";

        await transaction.save();

        const user = await User.findById(transaction.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.walletBalance += transaction.amount;

        user.walletBalance -= 10;

        await user.save();

        // GENERATE UNIQUE TICKET
        const drawWeek = getCurrentWeek();

        let number = "";
        let exists = true;

        while (exists) {
            number = generateTicketNumber();

            const existingTicket = await Ticket.findOne({
                number,
                drawWeek,
            });

            exists = !!existingTicket;
        }

        await Ticket.create({
            //@ts-ignore
            userId: user._id,
            number,
            drawWeek,
        });

        res.json({
            message: "Payment verified",
        });
    } catch (err: any) {
        console.log(err.response?.data || err);

        res.status(500).json({
            message: "Verification failed",
        });
    }
};