import { Request, Response } from "express";

import Draw from "../models/Draw";

import Ticket from "../models/Ticket";

import User from "../models/User";

import Transaction from "../models/Transaction";

import { generateTicketNumber } from "../utils/generateTicketNumber";

import { getCurrentWeek } from "../utils/getCurrentWeek";


export const triggerDraw = async (
    req: Request,
    res: Response
) => {
    try {
        const week = getCurrentWeek();

        // Prevent duplicate draws
        const existingDraw = await Draw.findOne({
            week,
        });

        if (existingDraw) {
            return res.status(400).json({
                message: "Draw already completed",
            });
        }

        // Get all tickets for week
        const tickets = await Ticket.find({
            drawWeek: week,
        });

        if (tickets.length === 0) {
            return res.status(400).json({
                message: "No tickets sold this week",
            });
        }

        // Revenue
        const totalRevenue = tickets.length * 10;

        // Prize Pool = 53%
        const prizePool = totalRevenue * 0.53;

        // Generate winning number
        const winningNumber =
            generateTicketNumber();

        // Find winners
        const winners = tickets.filter(
            (ticket) =>
                ticket.number === winningNumber
        );

        const totalWinners = winners.length;

        let payoutPerWinner = 0;

        if (totalWinners > 0) {
            payoutPerWinner =
                prizePool / totalWinners;
        }

        // Credit winners
        for (const winnerTicket of winners) {
            const user = await User.findById(
                winnerTicket.userId
            );

            if (user) {
                user.walletBalance +=
                    payoutPerWinner;

                await user.save();

                await Transaction.create({
                    //@ts-ignore
                    userId: user._id,

                    amount: payoutPerWinner,

                    type: "WIN",

                    status: "SUCCESS",
                });
            }
        }

        // Save draw
        const draw = await Draw.create({
            week,

            winningNumber,

            totalRevenue,

            prizePool,

            //@ts-ignore
            winners: winners.map(
                (w) => w.userId
            ),

            totalWinners,

            totalPayout:
                payoutPerWinner * totalWinners,
        });

        res.json({
            message: "Draw completed",
            draw,
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Draw failed",
        });
    }
};