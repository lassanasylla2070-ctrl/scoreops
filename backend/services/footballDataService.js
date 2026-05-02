'use strict';

const axios = require('axios');
const { FOOTBALL_API_KEY, FOOTBALL_API_BASE, COMPETITIONS } = require('../config/env');

// ── Rate-limit queue (max 10 req/min on free tier) ──────────────────────────
const RATE_LIMIT_MS = 6500; // ~9 req/min to be safe
let lastRequestTime = 0;

async function rateLimitedRequest(url, params = {}) {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < RATE_LIMIT_MS) {
    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS - elapsed));
  }
  lastRequestTime = Date.now();

  try {
    const response = await axios.get(`${FOOTBALL_API_BASE}${url}`, {
      headers: { 'X-Auth-Token': FOOTBALL_API_KEY },
      params,
      timeout: 10000,
    });
    return response.data;
  } catch (err) {
    if (err.response) {
      const msg = `Football API error ${err.response.status}: ${JSON.stringify(err.response.data)}`;
      console.error('[FDS]', msg);
      throw Object.assign(new Error(msg), { status: err.response.status });
    }
    throw err;
  }
}

// ── Competitions ─────────────────────────────────────────────────────────────
async function getCompetitions() {
  const codes = Object.keys(COMPETITIONS).join(',');
  return rateLimitedRequest('/competitions', { areas: codes });
}

// ── Matches ──────────────────────────────────────────────────────────────────
async function getMatchesByCompetition(competitionId, params = {}) {
  return rateLimitedRequest(`/competitions/${competitionId}/matches`, params);
}

async function getLiveMatches() {
  return rateLimitedRequest('/matches', { status: 'IN_PLAY,PAUSED' });
}

async function getTodayMatches() {
  const today = new Date().toISOString().split('T')[0];
  return rateLimitedRequest('/matches', { dateFrom: today, dateTo: today });
}

async function getMatchesRange(dateFrom, dateTo, competitionId) {
  const params = { dateFrom, dateTo };
  if (competitionId) params.competitions = competitionId;
  return rateLimitedRequest('/matches', params);
}

async function getMatchById(matchId) {
  return rateLimitedRequest(`/matches/${matchId}`);
}

async function getUpcomingMatches(days = 7) {
  const from = new Date();
  const to = new Date(from);
  to.setDate(to.getDate() + days);
  return rateLimitedRequest('/matches', {
    dateFrom: from.toISOString().split('T')[0],
    dateTo: to.toISOString().split('T')[0],
    status: 'SCHEDULED,TIMED',
  });
}

// ── Standings ────────────────────────────────────────────────────────────────
async function getStandings(competitionId) {
  return rateLimitedRequest(`/competitions/${competitionId}/standings`);
}

async function getAllStandings() {
  const results = {};
  for (const [code, comp] of Object.entries(COMPETITIONS)) {
    try {
      results[code] = await getStandings(comp.id);
    } catch (e) {
      console.warn(`[FDS] Could not fetch standings for ${code}:`, e.message);
    }
  }
  return results;
}

// ── Top Scorers ──────────────────────────────────────────────────────────────
async function getTopScorers(competitionId, limit = 20) {
  return rateLimitedRequest(`/competitions/${competitionId}/scorers`, { limit });
}

// ── Teams ────────────────────────────────────────────────────────────────────
async function getTeamsByCompetition(competitionId) {
  return rateLimitedRequest(`/competitions/${competitionId}/teams`);
}

async function getTeamById(teamId) {
  return rateLimitedRequest(`/teams/${teamId}`);
}

async function getTeamMatches(teamId, params = {}) {
  return rateLimitedRequest(`/teams/${teamId}/matches`, params);
}

// ── Players ──────────────────────────────────────────────────────────────────
async function getPlayerById(playerId) {
  return rateLimitedRequest(`/persons/${playerId}`);
}

async function getPlayerMatches(playerId, params = {}) {
  return rateLimitedRequest(`/persons/${playerId}/matches`, params);
}

module.exports = {
  getCompetitions,
  getMatchesByCompetition,
  getLiveMatches,
  getTodayMatches,
  getMatchesRange,
  getMatchById,
  getUpcomingMatches,
  getStandings,
  getAllStandings,
  getTopScorers,
  getTeamsByCompetition,
  getTeamById,
  getTeamMatches,
  getPlayerById,
  getPlayerMatches,
};
