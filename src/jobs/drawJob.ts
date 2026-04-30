import cron from "node-cron";
import { runWeeklyDraw } from "../services/drawService";

export const startWeeklyDrawJob = () => {
    cron.schedule("59 23 * * 0", async () => {
        try {
            console.log("Running weekly draw cron job...");

            const result = await runWeeklyDraw();

            console.log(result.message);
        } catch (err) {
            console.log("Weekly draw cron failed:", err);
        }
    });
};