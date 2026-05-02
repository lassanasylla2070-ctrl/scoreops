'use strict';

const { getDb } = require('../config/database');

// ── GET /api/news ─────────────────────────────────────────────────────────────
function getNews(req, res, next) {
  try {
    const db = getDb();
    const { q, category, source, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let sql = 'SELECT * FROM articles WHERE 1=1';
    const params = [];

    if (q) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (source) {
      sql += ' AND source = ?';
      params.push(source);
    }

    const total = db.prepare(`SELECT COUNT(*) as cnt FROM articles WHERE 1=1 ${sql.split('WHERE 1=1')[1].split('LIMIT')[0]}`).get(...params)?.cnt || 0;

    sql += ' ORDER BY published_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const articles = db.prepare(sql).all(...params);

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      articles,
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/news/:id ─────────────────────────────────────────────────────────
function getNewsById(req, res, next) {
  try {
    const db = getDb();
    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(Number(req.params.id));
    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    res.json({ success: true, article });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/news/sources ─────────────────────────────────────────────────────
function getSources(req, res, next) {
  try {
    const db = getDb();
    const sources = db.prepare('SELECT DISTINCT source FROM articles ORDER BY source').all();
    res.json({ success: true, sources: sources.map((s) => s.source) });
  } catch (err) {
    next(err);
  }
}

module.exports = { getNews, getNewsById, getSources };
