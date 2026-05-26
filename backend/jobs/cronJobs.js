cat > ~/scoreops/Football-Statistics-Platform/backend/jobs/cronJobs.js << 'EOF'
'use strict';

const cron = require('node-cron');
const fds = require('../services/footballDataService');
const { getDb } = require('../config/database');
const { COMPETITIONS } = require('../config/env');
const { clearCache } = require('../middleware/cache');

function startLiveScoreUpdater() {
  cron.schedule('*/60 * * * * *', async () => {
    const db = getDb();
    const soonThreshold = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const liveOrSoon = db.prepare(
      `SELECT COUNT(*) as cnt FROM matches
       WHERE status IN ('IN_PLAY','PAUSED')
          OR (status IN ('SCHEDULED','TIMED') AND utc_date <= ?)`
    ).get(soonThreshold);
    if (!liveOrSoon || liveOrSoon.cnt === 0) return;
    try {
      const data = await fds.getLiveMatches();
      const matches = data.matches || [];
      const upsert = db.prepare(`
        UPDATE matches SET
          status=@status, home_score=@home_score, away_score=@away_score,
          minute=@minute, goals=@goals, bookings=@bookings,
          substitutions=@substitutions, updated_at=strftime('%s','now')
        WHERE id=@id
      `);
      const txn = db.transaction((matches) => {
        for (const m of matches) {
          upsert.run({
            id: m.id, status: m.status,
            home_score: m.score?.fullTime?.home ?? null,
            away_score: m.score?.fullTime?.away ?? null,
            minute: m.minute ?? null,
            goals: JSON.stringify(m.goals || []),
            bookings: JSON.stringify(m.bookings || []),
            substitutions: JSON.stringify(m.substitutions || []),
          });
        }
      });
      txn(matches);
      clearCache('/api/matches/live');
      clearCache('/api/matches/today');
      if (matches.length > 0) console.log(`[CRON] Updated ${matches.length} live match(es)`);
    } catch (err) {
      console.warn('[CRON] Live update failed:', err.message);
    }
  }, { noOverlap: true });
  console.log('[CRON] Live score updater started');
}

function startStandingsUpdater() {
  cron.schedule('0 */6 * * *', async () => {
    const db = getDb();
    const { seedMatchesForCompetition } = require('./seedDatabase');
    for (const [code, comp] of Object.entries(COMPETITIONS)) {
      try {
        const standingsData = await fds.getStandings(comp.id);
        const season = standingsData.season?.startDate?.slice(0, 4) || new Date().getFullYear().toString();
        const upsert = db.prepare(`
          INSERT INTO standings
            (competition_id, season_year, stage, type, position, team_id, team_name, team_short_name,
             team_crest, played, won, draw, lost, goals_for, goals_against, goal_difference, points, form, updated_at)
          VALUES
            (@competition_id, @season_year, @stage, @type, @position, @team_id, @team_name, @team_short_name,
             @team_crest, @played, @won, @draw, @lost, @goals_for, @goals_against, @goal_difference, @points, @form, strftime('%s','now'))
          ON CONFLICT(competition_id, season_year, type, team_id) DO UPDATE SET
            position=excluded.position, played=excluded.played, won=excluded.won,
            draw=excluded.draw, lost=excluded.lost, goals_for=excluded.goals_for,
            goals_against=excluded.goals_against, goal_difference=excluded.goal_difference,
            points=excluded.points, form=excluded.form, updated_at=strftime('%s','now')
        `);
        const txn = db.transaction((tables) => {
          for (const table of tables) {
            for (const row of (table.table || [])) {
              upsert.run({
                competition_id: comp.id, season_year: season,
                stage: table.stage || 'REGULAR_SEASON', type: table.type || 'TOTAL',
                position: row.position, team_id: row.team?.id,
                team_name: row.team?.name, team_short_name: row.team?.shortName || row.team?.name,
                team_crest: row.team?.crest || '', played: row.playedGames || 0,
                won: row.won || 0, draw: row.draw || 0, lost: row.lost || 0,
                goals_for: row.goalsFor || 0, goals_against: row.goalsAgainst || 0,
                goal_difference: row.goalDifference || 0, points: row.points || 0,
                form: row.form || '',
              });
            }
          }
        });
        txn(standingsData.standings || []);
        await seedMatchesForCompetition(db, comp, code);
        clearCache('/api/standings');
        console.log(`[CRON] ✓ Standings refreshed for ${code}`);
      } catch (err) {
        console.warn(`[CRON] Standings update failed for ${code}:`, err.message);
      }
    }
  }, { noOverlap: true });
  console.log('[CRON] Standings updater started (every 6h)');
}

function startNewsUpdater() {
  cron.schedule('0 * * * *', async () => {
    try {
      const { fetchAllFeeds } = require('../services/newsService');
      const count = await fetchAllFeeds();
      clearCache('/api/news');
      console.log(`[CRON] Fetched ${count} new articles`);
    } catch (err) {
      console.warn('[CRON] News update failed:', err.message);
    }
  }, { noOverlap: true });
  console.log('[CRON] News updater started (every 1h)');
}

function startAllJobs() {
  startLiveScoreUpdater();
  startStandingsUpdater();
  startNewsUpdater();
}

module.exports = { startAllJobs, startLiveScoreUpdater, startStandingsUpdater, startNewsUpdater };
EOF
