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
            //@ts-ignore
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

export const getMyTickets = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 6;

        const skip = (page - 1) * limit;

        const filter = {
            //@ts-ignore
            userId: req.user?.userId,
        };

        const [tickets, totalTickets] = await Promise.all([
            //@ts-ignore
            Ticket.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            //@ts-ignore
            Ticket.countDocuments(filter),
        ]);

        res.json({
            tickets,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalTickets / limit),
                totalTickets,
                limit,
            },
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching tickets",
        });
    }
};
