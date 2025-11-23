class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'AppError';
  }
}

const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  // Stripe errors
  if (err.type && err.type.startsWith('Stripe')) {
    return res.status(400).json({
      error: {
        message: err.message,
        type: 'stripe_error'
      }
    });
  }

  // Auth0/JWT errors
  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return res.status(401).json({
      error: {
        message: 'Invalid or expired token',
        type: 'auth_error'
      }
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: {
        message: err.message,
        type: 'validation_error'
      }
    });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    error: {
      message: status === 500 ? 'Internal server error' : message,
      type: 'server_error'
    }
  });
};

module.exports = { errorHandler, AppError };
