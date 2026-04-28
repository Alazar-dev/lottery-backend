import rateLimit from 'express-rate-limit';

export const otpLimiter = rateLimit({
    windowMs: 60 * 60 *1000,
    max: 3,
    keyGenerator: (req) => req.body.email,
})