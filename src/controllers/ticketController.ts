import { Request, Response } from "express";

import Ticket from "../models/Ticket";
import User from "../models/User";

import { generateTicketNumber } from "../utils/generateTicketNumber";
import { getCurrentWeek } from "../utils/getCurrentWeek";

export const createTicket = async (
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

        if (user.walletBalance < 10) {
            return res.status(400).json({
                message: "Insufficient balance",
            });
        }

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

        const ticket = await Ticket.create({
            userId,
            number,
            drawWeek,
        });

        user.walletBalance -= 10;

        await user.save();

        res.json({
            message: "Ticket created",
            ticket,
            walletBalance: user.walletBalance,
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Error creating ticket",
        });
    }
};

export const getMyTickets = async (
    req: Request,
    res: Response
) => {
    try {
        const tickets = await Ticket.find({
            //@ts-ignore
            userId: req.user?.userId,
        }).sort({ createdAt: -1 });

        res.json(tickets);
    } catch (err) {
        res.status(500).json({
            message: "Error fetching tickets",
        });
    }
};