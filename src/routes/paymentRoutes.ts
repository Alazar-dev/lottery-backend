import { Router } from "express";

import {
    initiatePayment,
    verifyPayment,
} from "../controllers/paymentController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/initiate", protect, initiatePayment);

router.get("/verify", verifyPayment);

export default router;