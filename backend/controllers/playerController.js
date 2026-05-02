'use strict';

const { getDb } = require('../config/database');
const fds = require('../services/footballDataService');
const { COMPETITIONS } = require('../config/env');

// ── GET /api/players ──────────────────────────────────────────────────────────
function getPlayers(req, res, next) {
  try {
    const db = getDb();
    const { q, position, nationality, team, page = 1, limit = 24 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let sql = 'SELECT * FROM players WHERE 1=1';
    const params = [];

    if (q) {
      sql += ' AND name LIKE ?';
      params.push(`%${q}%`);
    }
    if (position) {
      sql += ' AND position = ?';
      params.push(position);
    }
    if (nationality) {
      sql += ' AND nationality LIKE ?';
      params.push(`%${nationality}%`);
    }
    if (team) {
      sql += ' AND team_id = ?';
      params.push(Number(team));
    }

    const countSql = `SELECT COUNT(*) as cnt FROM players WHERE 1=1 ${sql.split('WHERE 1=1')[1]}`;
    const total = db.prepare(countSql).get(...params)?.cnt || 0;

    sql += ' ORDER BY name ASC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const players = db.prepare(sql).all(...params);

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      players,
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/players/top/scorers ──────────────────────────────────────────────
function getTopScorers(req, res, next) {
  try {
    const db = getDb();
    const { league = 'PL', limit = 20 } = req.query;
    const comp = COMPETITIONS[league.toUpperCase()];

    if (!comp) {
      return res.status(404).json({ success: false, error: 'Unknown league' });
    }

    const scorers = db
      .prepare(
        `SELECT * FROM scorers
         WHERE competition_id = ?
         ORDER BY goals DESC, assists DESC
         LIMIT ?`
      )
      .all(comp.id, Number(limit));

    res.json({ success: true, competition: comp, scorers });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/players/top/assists ──────────────────────────────────────────────
function getTopAssisters(req, res, next) {
  try {
    const db = getDb();
    const { league = 'PL', limit = 20 } = req.query;
    const comp = COMPETITIONS[league.toUpperCase()];

    if (!comp) {
      return res.status(404).json({ success: false, error: 'Unknown league' });
    }

    const scorers = db
      .prepare(
        `SELECT * FROM scorers
         WHERE competition_id = ?
         ORDER BY assists DESC, goals DESC
         LIMIT ?`
      )
      .all(comp.id, Number(limit));

    res.json({ success: true, competition: comp, scorers });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/players/:id ──────────────────────────────────────────────────────
async function getPlayerById(req, res, next) {
  try {
    const db = getDb();
    const id = Number(req.params.id);
    let player = db.prepare('SELECT * FROM players WHERE id = ?').get(id);

    if (!player) {
      // Fetch from API and cache
      const data = await fds.getPlayerById(id);
      player = data;
    }

    res.json({ success: true, player });
  } catch (err) {
    next(err);
  }
}

module.exports = { getPlayers, getTopScorers, getTopAssisters, getPlayerById };
