import { Request, Response } from "express";
import { runWeeklyDraw } from "../services/drawService";

export const triggerDraw = async (req: Request, res: Response) => {
    try {
        const result = await runWeeklyDraw();

        if (result.skipped) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Draw failed",
        });
    }
};