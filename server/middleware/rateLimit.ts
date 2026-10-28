import rateLimit from "express-rate-limit";


export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 60, // 60 requests/minute/IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: {
      code: "rate_limited",
      message: "Too many requests. Please slow down and try again shortly.",
    },
  },
});


export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: {
      code: "rate_limited",
      message: "Too many AI requests. Please wait a moment before trying again.",
    },
  },
});
