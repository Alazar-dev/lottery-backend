import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/adminMiddleware";

const router = Router();

router.get("/user", protect, (req, res) => {
    //@ts-ignore
    res.json({ message: "User access granted", user: req.user });
});

router.get("/admin", protect, isAdmin, (req, res) => {
    res.json({ message: "Admin access granted" });
});

export default router;