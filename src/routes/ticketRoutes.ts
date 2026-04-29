import { Router } from "express";

import {
    createTicket,
    getMyTickets,
} from "../controllers/ticketController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, createTicket);

router.get("/my", protect, getMyTickets);

export default router;