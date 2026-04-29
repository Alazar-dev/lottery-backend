import { Router } from "express";

import {
    getDashboardStats,
    getAllUsers,
    getAllTransactions,
    getDrawHistory,
} from "../controllers/adminController";

import { protect } from "../middleware/authMiddleware";

import { isAdmin } from "../middleware/adminMiddleware";

const router = Router();

router.get(
    "/stats",
    protect,
    isAdmin,
    getDashboardStats
);

router.get(
    "/users",
    protect,
    isAdmin,
    getAllUsers
);

router.get(
    "/transactions",
    protect,
    isAdmin,
    getAllTransactions
);

router.get(
    "/draws",
    protect,
    isAdmin,
    getDrawHistory
);

export default router;