require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

// Validate required environment variables
const requiredEnvVars = [
  'AUTH0_DOMAIN',
  'AUTH0_AUDIENCE',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('ERROR: Missing required environment variables:');
  missingVars.forEach(varName => console.error(`  - ${varName}`));
  console.error('\nPlease create a .env file based on .env.example');
  process.exit(1);
}

// Start server
app.listen(PORT, () => {
  console.log(`\nServer running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log('\nAuth0 Configuration:');
  console.log(`  Domain: ${process.env.AUTH0_DOMAIN}`);
  console.log(`  Audience: ${process.env.AUTH0_AUDIENCE}`);
  console.log('\nStripe Configuration:');
  console.log(`  Mode: ${process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') ? 'TEST' : 'LIVE'}`);
  console.log('\nReady to accept requests!\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});
