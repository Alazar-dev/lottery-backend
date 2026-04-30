import Draw from "../models/Draw";
import Ticket from "../models/Ticket";
import User from "../models/User";
import Transaction from "../models/Transaction";
import { getCurrentWeek } from "../utils/getCurrentWeek";

export const runWeeklyDraw = async () => {
    const week = getCurrentWeek();

    const existingDraw = await Draw.findOne({ week });

    if (existingDraw) {
        return {
            skipped: true,
            message: "Draw already completed",
            draw: existingDraw,
        };
    }

    const tickets = await Ticket.find({ drawWeek: week });

    if (tickets.length === 0) {
        return {
            skipped: true,
            message: "No tickets sold this week",
        };
    }

    const totalRevenue = tickets.length * 10;
    const prizePool = totalRevenue * 0.53;

    // Demo-friendly: guarantees at least one winner
    const randomTicket =
        tickets[Math.floor(Math.random() * tickets.length)];

    const winningNumber = randomTicket.number;

    const winners = tickets.filter(
        (ticket) => ticket.number === winningNumber
    );

    const totalWinners = winners.length;
    const payoutPerWinner =
        totalWinners > 0 ? prizePool / totalWinners : 0;

    for (const winnerTicket of winners) {
        const user = await User.findById(winnerTicket.userId);

        if (user) {
            user.walletBalance += payoutPerWinner;
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

    const draw = await Draw.create({
        week,
        winningNumber,
        totalRevenue,
        prizePool,
        //@ts-ignore
        winners: winners.map((w) => w.userId),
        totalWinners,
        totalPayout: payoutPerWinner * totalWinners,
    });

    return {
        skipped: false,
        message: "Weekly draw completed",
        draw,
    };
};