'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { validateEnv, PORT } = require('./config/env');
validateEnv();

// Init DB schema before anything else
require('./config/database').getDb();

const app = require('./app');
const { startAllJobs } = require('./jobs/cronJobs');
const { seedDatabase } = require('./jobs/seedDatabase');
const { fetchAllFeeds } = require('./services/newsService');

async function main() {
  // Start HTTP server
  const server = app.listen(PORT, () => {
    console.log(`\n⚽ Football Stats API running at http://localhost:${PORT}`);
    console.log(`   API info: http://localhost:${PORT}/api\n`);
  });

  // Seed data on first run (non-blocking — runs in background)
  seedDatabase()
    .then(() => fetchAllFeeds())
    .then((count) => console.log(`[INIT] Initial news fetch: ${count} articles`))
    .catch((err) => console.error('[INIT] Seed error:', err.message));

  // Start cron jobs
  startAllJobs();

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('[SERVER] SIGTERM received — shutting down gracefully');
    server.close(() => process.exit(0));
  });
  process.on('SIGINT', () => {
    console.log('[SERVER] SIGINT received — shutting down');
    server.close(() => process.exit(0));
  });
}

main().catch((err) => {
  console.error('[SERVER] Fatal error:', err);
  process.exit(1);
});
