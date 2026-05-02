'use strict';

const { getDb } = require('../config/database');
const { COMPETITIONS } = require('../config/env');

// ── GET /api/standings ───────────────────────────────────────────────────────
function getAllStandings(req, res, next) {
  try {
    const db = getDb();
    const result = {};

    for (const [code, comp] of Object.entries(COMPETITIONS)) {
      const rows = db
        .prepare(
          `SELECT * FROM standings
           WHERE competition_id = ?
             AND type = 'TOTAL'
           ORDER BY position ASC`
        )
        .all(comp.id);

      if (rows.length > 0) {
        result[code] = {
          competition: comp,
          table: rows,
          updatedAt: rows[0]?.updated_at,
        };
      }
    }

    res.json({ success: true, standings: result });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/standings/:leagueCode ───────────────────────────────────────────
function getStandingsByLeague(req, res, next) {
  try {
    const db = getDb();
    const code = req.params.leagueCode.toUpperCase();
    const comp = COMPETITIONS[code];

    if (!comp) {
      return res.status(404).json({ success: false, error: `Unknown league code: ${code}` });
    }

    const rows = db
      .prepare(
        `SELECT * FROM standings
         WHERE competition_id = ?
           AND type = 'TOTAL'
         ORDER BY position ASC`
      )
      .all(comp.id);

    res.json({ success: true, competition: comp, table: rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllStandings, getStandingsByLeague };
