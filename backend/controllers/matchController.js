'use strict';

const fds = require('../services/footballDataService');
const { getDb } = require('../config/database');
const { COMPETITIONS } = require('../config/env');

// ── GET /api/matches ─────────────────────────────────────────────────────────
async function getMatches(req, res, next) {
  try {
    const { league, dateFrom, dateTo, status, team } = req.query;

    const db = getDb();
    let sql = 'SELECT * FROM matches WHERE 1=1';
    const params = [];

    if (league) {
      const comp = COMPETITIONS[league.toUpperCase()];
      if (comp) {
        sql += ' AND competition_id = ?';
        params.push(comp.id);
      }
    }
    if (status) {
      const statuses = status.split(',').map((s) => `'${s}'`).join(',');
      sql += ` AND status IN (${statuses})`;
    }
    if (dateFrom) {
      sql += ' AND utc_date >= ?';
      params.push(dateFrom);
    }
    if (dateTo) {
      sql += ' AND utc_date <= ?';
      params.push(dateTo + 'T23:59:59Z');
    }
    if (team) {
      sql += ' AND (home_team_id = ? OR away_team_id = ?)';
      params.push(Number(team), Number(team));
    }

    sql += ' ORDER BY utc_date DESC LIMIT 100';
    const matches = db.prepare(sql).all(...params);
    const parsed = matches.map(parseMatchRow);

    res.json({ success: true, count: parsed.length, matches: parsed });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/matches/live ────────────────────────────────────────────────────
async function getLiveMatches(req, res, next) {
  try {
    const db = getDb();
    const matches = db
      .prepare(`SELECT * FROM matches WHERE status IN ('IN_PLAY','PAUSED') ORDER BY utc_date`)
      .all();
    res.json({ success: true, count: matches.length, matches: matches.map(parseMatchRow) });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/matches/upcoming ────────────────────────────────────────────────
async function getUpcomingMatches(req, res, next) {
  try {
    const db = getDb();
    const now = new Date().toISOString();
    const future = new Date(Date.now() + 7 * 86400000).toISOString();
    const matches = db
      .prepare(
        `SELECT * FROM matches
         WHERE status IN ('SCHEDULED','TIMED')
           AND utc_date >= ?
           AND utc_date <= ?
         ORDER BY utc_date ASC
         LIMIT 50`
      )
      .all(now, future);
    res.json({ success: true, count: matches.length, matches: matches.map(parseMatchRow) });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/matches/today ───────────────────────────────────────────────────
async function getTodayMatches(req, res, next) {
  try {
    const db = getDb();
    const today = new Date().toISOString().split('T')[0];
    const matches = db
      .prepare(
        `SELECT * FROM matches
         WHERE utc_date LIKE ?
         ORDER BY utc_date ASC`
      )
      .all(`${today}%`);
    res.json({ success: true, count: matches.length, matches: matches.map(parseMatchRow) });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/matches/:id ─────────────────────────────────────────────────────
async function getMatchById(req, res, next) {
  try {
    const db = getDb();
    const match = db.prepare('SELECT * FROM matches WHERE id = ?').get(Number(req.params.id));

    if (!match) {
      // Try fetching live from API
      try {
        const data = await fds.getMatchById(req.params.id);
        return res.json({ success: true, match: normalizeMatch(data.match || data) });
      } catch (_) {
        return res.status(404).json({ success: false, error: 'Match not found' });
      }
    }

    res.json({ success: true, match: parseMatchRow(match) });
  } catch (err) {
    next(err);
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function parseMatchRow(row) {
  return {
    ...row,
    goals: safeJson(row.goals, []),
    bookings: safeJson(row.bookings, []),
    substitutions: safeJson(row.substitutions, []),
  };
}

function safeJson(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function normalizeMatch(m) {
  return {
    id: m.id,
    competition_id: m.competition?.id,
    competition_name: m.competition?.name,
    utc_date: m.utcDate,
    status: m.status,
    matchday: m.matchday,
    stage: m.stage,
    home_team_id: m.homeTeam?.id,
    home_team_name: m.homeTeam?.name,
    home_team_crest: m.homeTeam?.crest,
    away_team_id: m.awayTeam?.id,
    away_team_name: m.awayTeam?.name,
    away_team_crest: m.awayTeam?.crest,
    home_score: m.score?.fullTime?.home,
    away_score: m.score?.fullTime?.away,
    home_score_ht: m.score?.halfTime?.home,
    away_score_ht: m.score?.halfTime?.away,
    minute: m.minute,
    goals: m.goals || [],
    bookings: m.bookings || [],
    substitutions: m.substitutions || [],
  };
}

module.exports = { getMatches, getLiveMatches, getUpcomingMatches, getTodayMatches, getMatchById };
