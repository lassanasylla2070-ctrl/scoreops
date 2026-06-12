'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { CLIENT_URL } = require('./config/env');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// ── Security & Logging ───────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: 'http://192.168.1.29',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Body Parser ───────────────────────────────────────────────────────────────
app.use(express.json());

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/matches',   require('./routes/matches'));
app.use('/api/standings', require('./routes/standings'));
app.use('/api/players',   require('./routes/players'));
app.use('/api/teams',     require('./routes/teams'));
app.use('/api/news',      require('./routes/news'));

// ── API info ──────────────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    name: 'Football Stats API',
    version: '1.0.0',
    endpoints: [
      'GET /api/matches',
      'GET /api/matches/live',
      'GET /api/matches/upcoming',
      'GET /api/matches/today',
      'GET /api/matches/:id',
      'GET /api/standings',
      'GET /api/standings/:leagueCode',
      'GET /api/players',
      'GET /api/players/top/scorers',
      'GET /api/players/top/assists',
      'GET /api/players/:id',
      'GET /api/teams',
      'GET /api/teams/:id',
      'GET /api/teams/:id/matches',
      'GET /api/news',
      'GET /api/news/sources',
      'GET /api/news/:id',
    ],
  });
});

// ── Error Handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
