'use strict';

/**
 * Seed job — runs once on startup to populate the database with
 * current data for all 6 competitions.
 */

const fds = require('../services/footballDataService');
const { getDb } = require('../config/database');
const { COMPETITIONS } = require('../config/env');

async function seedDatabase() {
  console.log('[SEED] Starting initial data seed…');
  const db = getDb();

  for (const [code, comp] of Object.entries(COMPETITIONS)) {
    try {
      // ── Teams & Players ───────────────────────────────────────────────────
      console.log(`[SEED] Fetching teams for ${code}…`);
      const teamsData = await fds.getTeamsByCompetition(comp.id);
      const teams = teamsData.teams || [];

      const upsertTeam = db.prepare(`
        INSERT INTO teams (id, name, short_name, tla, crest, address, website, founded, venue, competition_id, squad, coach_name)
        VALUES (@id, @name, @short_name, @tla, @crest, @address, @website, @founded, @venue, @competition_id, @squad, @coach_name)
        ON CONFLICT(id) DO UPDATE SET
          name=excluded.name, short_name=excluded.short_name, tla=excluded.tla,
          crest=excluded.crest, founded=excluded.founded, venue=excluded.venue,
          competition_id=excluded.competition_id, squad=excluded.squad,
          coach_name=excluded.coach_name, updated_at=strftime('%s','now')
      `);

      const upsertPlayer = db.prepare(`
        INSERT INTO players (id, name, first_name, last_name, date_of_birth, nationality, position, shirt_number, team_id, team_name, team_crest)
        VALUES (@id, @name, @first_name, @last_name, @date_of_birth, @nationality, @position, @shirt_number, @team_id, @team_name, @team_crest)
        ON CONFLICT(id) DO UPDATE SET
          name=excluded.name, nationality=excluded.nationality, position=excluded.position,
          shirt_number=excluded.shirt_number, team_id=excluded.team_id, team_name=excluded.team_name,
          team_crest=excluded.team_crest, updated_at=strftime('%s','now')
      `);

      const insertTeams = db.transaction((teams) => {
        for (const t of teams) {
          upsertTeam.run({
            id: t.id,
            name: t.name,
            short_name: t.shortName || t.name,
            tla: t.tla || '',
            crest: t.crest || '',
            address: t.address || '',
            website: t.website || '',
            founded: t.founded || null,
            venue: t.venue || '',
            competition_id: comp.id,
            squad: JSON.stringify(t.squad || []),
            coach_name: t.coach?.name || '',
          });

          for (const p of (t.squad || [])) {
            if (!p.id) continue;
            upsertPlayer.run({
              id: p.id,
              name: p.name,
              first_name: p.firstName || '',
              last_name: p.lastName || p.name,
              date_of_birth: p.dateOfBirth || '',
              nationality: p.nationality || '',
              position: p.position || '',
              shirt_number: p.shirtNumber || null,
              team_id: t.id,
              team_name: t.name,
              team_crest: t.crest || '',
            });
          }
        }
      });

      insertTeams(teams);
      console.log(`[SEED] ✓ ${teams.length} teams for ${code}`);

      // ── Standings ─────────────────────────────────────────────────────────
      console.log(`[SEED] Fetching standings for ${code}…`);
      const standingsData = await fds.getStandings(comp.id);
      const season = standingsData.season?.startDate?.slice(0, 4) || new Date().getFullYear().toString();

      const upsertStanding = db.prepare(`
        INSERT INTO standings
          (competition_id, season_year, stage, type, position, team_id, team_name, team_short_name, team_crest,
           played, won, draw, lost, goals_for, goals_against, goal_difference, points, form, updated_at)
        VALUES
          (@competition_id, @season_year, @stage, @type, @position, @team_id, @team_name, @team_short_name, @team_crest,
           @played, @won, @draw, @lost, @goals_for, @goals_against, @goal_difference, @points, @form, strftime('%s','now'))
        ON CONFLICT(competition_id, season_year, type, team_id) DO UPDATE SET
          position=excluded.position, played=excluded.played, won=excluded.won, draw=excluded.draw,
          lost=excluded.lost, goals_for=excluded.goals_for, goals_against=excluded.goals_against,
          goal_difference=excluded.goal_difference, points=excluded.points, form=excluded.form,
          updated_at=strftime('%s','now')
      `);

      const insertStandings = db.transaction((tables) => {
        for (const table of tables) {
          for (const row of (table.table || [])) {
            upsertStanding.run({
              competition_id: comp.id,
              season_year: season,
              stage: table.stage || 'REGULAR_SEASON',
              type: table.type || 'TOTAL',
              position: row.position,
              team_id: row.team?.id,
              team_name: row.team?.name,
              team_short_name: row.team?.shortName || row.team?.name,
              team_crest: row.team?.crest || '',
              played: row.playedGames || 0,
              won: row.won || 0,
              draw: row.draw || 0,
              lost: row.lost || 0,
              goals_for: row.goalsFor || 0,
              goals_against: row.goalsAgainst || 0,
              goal_difference: row.goalDifference || 0,
              points: row.points || 0,
              form: row.form || '',
            });
          }
        }
      });

      insertStandings(standingsData.standings || []);
      console.log(`[SEED] ✓ Standings for ${code}`);

      // ── Top Scorers ───────────────────────────────────────────────────────
      console.log(`[SEED] Fetching top scorers for ${code}…`);
      const scorersData = await fds.getTopScorers(comp.id, 30);
      const scorerSeason = scorersData.season?.startDate?.slice(0, 4) || season;

      const upsertScorer = db.prepare(`
        INSERT INTO scorers
          (competition_id, season_year, player_id, player_name, player_nationality, team_id, team_name, team_crest, goals, assists, penalties, played_matches, updated_at)
        VALUES
          (@competition_id, @season_year, @player_id, @player_name, @player_nationality, @team_id, @team_name, @team_crest, @goals, @assists, @penalties, @played_matches, strftime('%s','now'))
        ON CONFLICT(competition_id, season_year, player_id) DO UPDATE SET
          goals=excluded.goals, assists=excluded.assists, penalties=excluded.penalties,
          played_matches=excluded.played_matches, updated_at=strftime('%s','now')
      `);

      const insertScorers = db.transaction((scorers) => {
        for (const s of scorers) {
          upsertScorer.run({
            competition_id: comp.id,
            season_year: scorerSeason,
            player_id: s.player?.id,
            player_name: s.player?.name,
            player_nationality: s.player?.nationality || '',
            team_id: s.team?.id,
            team_name: s.team?.name,
            team_crest: s.team?.crest || '',
            goals: s.goals || 0,
            assists: s.assists || 0,
            penalties: s.penalties || 0,
            played_matches: s.playedMatches || 0,
          });
        }
      });

      insertScorers(scorersData.scorers || []);
      console.log(`[SEED] ✓ Scorers for ${code}`);

      // ── Recent Matches ────────────────────────────────────────────────────
      await seedMatchesForCompetition(db, comp, code);

    } catch (err) {
      console.error(`[SEED] ✗ Failed ${code}:`, err.message);
    }
  }

  console.log('[SEED] ✓ Initial seed complete');
}

async function seedMatchesForCompetition(db, comp, code) {
  console.log(`[SEED] Fetching recent matches for ${code}…`);
  try {
    const from = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
    const to   = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

    const data = await fds.getMatchesByCompetition(comp.id, { dateFrom: from, dateTo: to });
    const matches = data.matches || [];

    const upsertMatch = db.prepare(`
      INSERT INTO matches
        (id, competition_id, competition_name, utc_date, status, matchday, stage,
         home_team_id, home_team_name, home_team_crest,
         away_team_id, away_team_name, away_team_crest,
         home_score, away_score, home_score_ht, away_score_ht, minute,
         goals, bookings, substitutions, updated_at)
      VALUES
        (@id, @competition_id, @competition_name, @utc_date, @status, @matchday, @stage,
         @home_team_id, @home_team_name, @home_team_crest,
         @away_team_id, @away_team_name, @away_team_crest,
         @home_score, @away_score, @home_score_ht, @away_score_ht, @minute,
         @goals, @bookings, @substitutions, strftime('%s','now'))
      ON CONFLICT(id) DO UPDATE SET
        status=excluded.status, home_score=excluded.home_score, away_score=excluded.away_score,
        home_score_ht=excluded.home_score_ht, away_score_ht=excluded.away_score_ht,
        minute=excluded.minute, goals=excluded.goals, bookings=excluded.bookings,
        substitutions=excluded.substitutions, updated_at=strftime('%s','now')
    `);

    const txn = db.transaction((matches) => {
      for (const m of matches) {
        upsertMatch.run({
          id: m.id,
          competition_id: comp.id,
          competition_name: comp.name,
          utc_date: m.utcDate,
          status: m.status,
          matchday: m.matchday || null,
          stage: m.stage || '',
          home_team_id: m.homeTeam?.id,
          home_team_name: m.homeTeam?.name,
          home_team_crest: m.homeTeam?.crest || '',
          away_team_id: m.awayTeam?.id,
          away_team_name: m.awayTeam?.name,
          away_team_crest: m.awayTeam?.crest || '',
          home_score: m.score?.fullTime?.home ?? null,
          away_score: m.score?.fullTime?.away ?? null,
          home_score_ht: m.score?.halfTime?.home ?? null,
          away_score_ht: m.score?.halfTime?.away ?? null,
          minute: m.minute ?? null,
          goals: JSON.stringify(m.goals || []),
          bookings: JSON.stringify(m.bookings || []),
          substitutions: JSON.stringify(m.substitutions || []),
        });
      }
    });

    txn(matches);
    console.log(`[SEED] ✓ ${matches.length} matches for ${code}`);
  } catch (err) {
    console.warn(`[SEED] Could not fetch matches for ${code}:`, err.message);
  }
}

module.exports = { seedDatabase, seedMatchesForCompetition };
