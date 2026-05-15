import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const user = req.cookies?.token || req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    const { success } = await ratelimit.limit(user);
    if (!success) {
      return res.status(429).json({ message: "Too many requests, try again later." });
    }

    next();
  } catch (err) {
    console.log("Rate limiter error", err);
    next(err);
  }
};

export default rateLimiter;