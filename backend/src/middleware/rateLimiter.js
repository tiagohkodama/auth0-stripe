const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: {
      message: 'Too many requests, please try again later',
      type: 'rate_limit_error'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 payment requests per windowMs
  message: {
    error: {
      message: 'Too many payment attempts, please try again later',
      type: 'rate_limit_error'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, paymentLimiter };
