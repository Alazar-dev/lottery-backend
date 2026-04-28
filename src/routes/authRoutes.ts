import { Router } from 'express'

import { requestOtp, verifyOtp } from "../controllers/authController";
import { otpLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post('/requestOtp', otpLimiter, requestOtp);
router.post('/verifyOtp', verifyOtp);

export default router;