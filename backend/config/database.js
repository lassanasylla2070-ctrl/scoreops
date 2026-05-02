'use strict';

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'football.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS competitions (
      id          INTEGER PRIMARY KEY,
      name        TEXT NOT NULL,
      code        TEXT,
      country     TEXT,
      emblem      TEXT,
      updated_at  INTEGER DEFAULT (strftime('%s','now'))
    );

    CREATE TABLE IF NOT EXISTS teams (
      id           INTEGER PRIMARY KEY,
      name         TEXT NOT NULL,
      short_name   TEXT,
      tla          TEXT,
      crest        TEXT,
      address      TEXT,
      website      TEXT,
      founded      INTEGER,
      venue        TEXT,
      competition_id INTEGER,
      squad        TEXT DEFAULT '[]',
      coach_name   TEXT,
      updated_at   INTEGER DEFAULT (strftime('%s','now'))
    );

    CREATE TABLE IF NOT EXISTS matches (
      id              INTEGER PRIMARY KEY,
      competition_id  INTEGER,
      competition_name TEXT,
      utc_date        TEXT,
      status          TEXT,
      matchday        INTEGER,
      stage           TEXT,
      home_team_id    INTEGER,
      home_team_name  TEXT,
      home_team_crest TEXT,
      away_team_id    INTEGER,
      away_team_name  TEXT,
      away_team_crest TEXT,
      home_score      INTEGER,
      away_score      INTEGER,
      home_score_ht   INTEGER,
      away_score_ht   INTEGER,
      minute          INTEGER,
      goals           TEXT DEFAULT '[]',
      bookings        TEXT DEFAULT '[]',
      substitutions   TEXT DEFAULT '[]',
      updated_at      INTEGER DEFAULT (strftime('%s','now'))
    );

    CREATE INDEX IF NOT EXISTS idx_matches_status    ON matches(status);
    CREATE INDEX IF NOT EXISTS idx_matches_date      ON matches(utc_date);
    CREATE INDEX IF NOT EXISTS idx_matches_comp      ON matches(competition_id);
    CREATE INDEX IF NOT EXISTS idx_matches_home_team ON matches(home_team_id);
    CREATE INDEX IF NOT EXISTS idx_matches_away_team ON matches(away_team_id);

    CREATE TABLE IF NOT EXISTS standings (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      competition_id  INTEGER NOT NULL,
      season_year     TEXT,
      stage           TEXT,
      type            TEXT,
      position        INTEGER,
      team_id         INTEGER,
      team_name       TEXT,
      team_short_name TEXT,
      team_crest      TEXT,
      played          INTEGER DEFAULT 0,
      won             INTEGER DEFAULT 0,
      draw            INTEGER DEFAULT 0,
      lost            INTEGER DEFAULT 0,
      goals_for       INTEGER DEFAULT 0,
      goals_against   INTEGER DEFAULT 0,
      goal_difference INTEGER DEFAULT 0,
      points          INTEGER DEFAULT 0,
      form            TEXT,
      updated_at      INTEGER DEFAULT (strftime('%s','now')),
      UNIQUE(competition_id, season_year, type, team_id)
    );

    CREATE TABLE IF NOT EXISTS players (
      id            INTEGER PRIMARY KEY,
      name          TEXT NOT NULL,
      first_name    TEXT,
      last_name     TEXT,
      date_of_birth TEXT,
      nationality   TEXT,
      position      TEXT,
      shirt_number  INTEGER,
      team_id       INTEGER,
      team_name     TEXT,
      team_crest    TEXT,
      updated_at    INTEGER DEFAULT (strftime('%s','now'))
    );

    CREATE INDEX IF NOT EXISTS idx_players_team     ON players(team_id);
    CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);
    CREATE INDEX IF NOT EXISTS idx_players_name     ON players(name COLLATE NOCASE);

    CREATE TABLE IF NOT EXISTS scorers (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      competition_id  INTEGER,
      season_year     TEXT,
      player_id       INTEGER,
      player_name     TEXT,
      player_nationality TEXT,
      team_id         INTEGER,
      team_name       TEXT,
      team_crest      TEXT,
      goals           INTEGER DEFAULT 0,
      assists         INTEGER DEFAULT 0,
      penalties       INTEGER DEFAULT 0,
      played_matches  INTEGER DEFAULT 0,
      updated_at      INTEGER DEFAULT (strftime('%s','now')),
      UNIQUE(competition_id, season_year, player_id)
    );

    CREATE TABLE IF NOT EXISTS articles (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      title        TEXT NOT NULL,
      description  TEXT,
      content      TEXT,
      url          TEXT UNIQUE,
      image_url    TEXT,
      published_at TEXT,
      source       TEXT,
      category     TEXT DEFAULT 'general',
      updated_at   INTEGER DEFAULT (strftime('%s','now'))
    );

    CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_articles_category  ON articles(category);
  `);

  console.log('[DB] Schema initialised at', DB_PATH);
}

module.exports = { getDb };
