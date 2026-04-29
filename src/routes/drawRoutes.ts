import { Router } from "express";

import { triggerDraw } from "../controllers/drawController";

import { protect } from "../middleware/authMiddleware";

import { isAdmin } from "../middleware/adminMiddleware";

const router = Router();

router.post(
    "/trigger",
    protect,
    isAdmin,
    triggerDraw
);

export default router;