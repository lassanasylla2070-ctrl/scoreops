'use strict';

const requiredEnv = [
  'FOOTBALL_API_KEY',
  'FOOTBALL_API_BASE',
];

function validateEnv() {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`[ENV] Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

module.exports = {
  validateEnv,
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FOOTBALL_API_KEY: process.env.FOOTBALL_API_KEY,
  FOOTBALL_API_BASE: process.env.FOOTBALL_API_BASE || 'https://api.football-data.org/v4',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  CACHE_TTL: {
    LIVE: parseInt(process.env.CACHE_TTL_LIVE) || 30,
    MATCHES: parseInt(process.env.CACHE_TTL_MATCHES) || 300,
    STANDINGS: parseInt(process.env.CACHE_TTL_STANDINGS) || 3600,
    PLAYERS: parseInt(process.env.CACHE_TTL_PLAYERS) || 3600,
    TEAMS: parseInt(process.env.CACHE_TTL_TEAMS) || 86400,
    NEWS: parseInt(process.env.CACHE_TTL_NEWS) || 1800,
  },
  // Football-Data.org free tier competition IDs
  COMPETITIONS: {
    PL:  { id: 2021, name: 'Premier League',   country: 'England',  flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    PD:  { id: 2014, name: 'La Liga',           country: 'Spain',    flag: '🇪🇸' },
    BL1: { id: 2002, name: 'Bundesliga',        country: 'Germany',  flag: '🇩🇪' },
    SA:  { id: 2019, name: 'Serie A',           country: 'Italy',    flag: '🇮🇹' },
    FL1: { id: 2015, name: 'Ligue 1',           country: 'France',   flag: '🇫🇷' },
    CL:  { id: 2001, name: 'Champions League',  country: 'Europe',   flag: '🇪🇺' },
    WC: { id: 2000, name: 'FIFA World Cup', country: 'World', flag: '🌍' },
  },
};
