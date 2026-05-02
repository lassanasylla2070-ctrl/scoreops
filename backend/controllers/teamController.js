'use strict';

const { getDb } = require('../config/database');
const fds = require('../services/footballDataService');
const { COMPETITIONS } = require('../config/env');

// ── GET /api/teams ────────────────────────────────────────────────────────────
function getTeams(req, res, next) {
  try {
    const db = getDb();
    const { league, q } = req.query;

    let sql = 'SELECT id, name, short_name, tla, crest, founded, venue, competition_id, coach_name FROM teams WHERE 1=1';
    const params = [];

    if (league) {
      const comp = COMPETITIONS[league.toUpperCase()];
      if (comp) {
        sql += ' AND competition_id = ?';
        params.push(comp.id);
      }
    }
    if (q) {
      sql += ' AND name LIKE ?';
      params.push(`%${q}%`);
    }

    sql += ' ORDER BY name ASC';
    const teams = db.prepare(sql).all(...params);
    res.json({ success: true, count: teams.length, teams });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/teams/:id ────────────────────────────────────────────────────────
async function getTeamById(req, res, next) {
  try {
    const db = getDb();
    const id = Number(req.params.id);
    const team = db.prepare('SELECT * FROM teams WHERE id = ?').get(id);

    if (!team) {
      try {
        const data = await fds.getTeamById(id);
        return res.json({ success: true, team: data });
      } catch (_) {
        return res.status(404).json({ success: false, error: 'Team not found' });
      }
    }

    const players = db
      .prepare('SELECT * FROM players WHERE team_id = ? ORDER BY position, name')
      .all(id);

    const recentMatches = db
      .prepare(
        `SELECT * FROM matches
         WHERE (home_team_id = ? OR away_team_id = ?)
           AND status = 'FINISHED'
         ORDER BY utc_date DESC
         LIMIT 5`
      )
      .all(id, id);

    const upcomingMatches = db
      .prepare(
        `SELECT * FROM matches
         WHERE (home_team_id = ? OR away_team_id = ?)
           AND status IN ('SCHEDULED','TIMED')
         ORDER BY utc_date ASC
         LIMIT 5`
      )
      .all(id, id);

    res.json({
      success: true,
      team: {
        ...team,
        squad: safeJson(team.squad, []),
      },
      players,
      recentMatches,
      upcomingMatches,
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/teams/:id/matches ────────────────────────────────────────────────
function getTeamMatches(req, res, next) {
  try {
    const db = getDb();
    const id = Number(req.params.id);
    const { status } = req.query;

    let sql = `SELECT * FROM matches WHERE (home_team_id = ? OR away_team_id = ?)`;
    const params = [id, id];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY utc_date DESC LIMIT 30';
    const matches = db.prepare(sql).all(...params);

    res.json({ success: true, count: matches.length, matches });
  } catch (err) {
    next(err);
  }
}

function safeJson(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

module.exports = { getTeams, getTeamById, getTeamMatches };
