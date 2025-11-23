const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

app.use(helmet());

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// IMPORTANT: Webhook route must use raw body parser
// This must be defined BEFORE express.json()
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/', apiLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/webhooks', require('./routes/webhook.routes'));

app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      type: 'not_found'
    }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
