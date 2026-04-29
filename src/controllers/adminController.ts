import { Request, Response } from "express";

import User from "../models/User";

import Ticket from "../models/Ticket";

import Transaction from "../models/Transaction";

import Draw from "../models/Draw";

export const getDashboardStats = async (
    req: Request,
    res: Response
) => {
    try {
        const totalUsers =
            await User.countDocuments();

        const totalTickets =
            await Ticket.countDocuments();

        const totalRevenueAgg =
            await Transaction.aggregate([
                {
                    $match: {
                        type: "PAYMENT",
                        status: "SUCCESS",
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount",
                        },
                    },
                },
            ]);

        const totalRevenue =
            totalRevenueAgg[0]?.total || 0;

        const totalDraws =
            await Draw.countDocuments();

        const totalWinnersAgg =
            await Draw.aggregate([
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$totalWinners",
                        },
                    },
                },
            ]);

        const totalWinners =
            totalWinnersAgg[0]?.total || 0;

        const totalPayoutsAgg =
            await Draw.aggregate([
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$totalPayout",
                        },
                    },
                },
            ]);

        const totalPayouts =
            totalPayoutsAgg[0]?.total || 0;

        res.json({
            totalUsers,

            totalTickets,

            totalRevenue,

            totalDraws,

            totalWinners,

            totalPayouts,
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Failed to load dashboard stats",
        });
    }
};

export const getAllUsers = async (
    req: Request,
    res: Response
) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch users",
        });
    }
};

export const getAllTransactions = async (
    req: Request,
    res: Response
) => {
    try {
        const transactions =
            await Transaction.find()
                .populate("userId", "email")
                .sort({ createdAt: -1 });

        res.json(transactions);
    } catch (err) {
        res.status(500).json({
            message:
                "Failed to fetch transactions",
        });
    }
};

export const getDrawHistory = async (
    req: Request,
    res: Response
) => {
    try {
        const draws = await Draw.find()
            .sort({ createdAt: -1 });

        res.json(draws);
    } catch (err) {
        res.status(500).json({
            message:
                "Failed to fetch draw history",
        });
    }
};