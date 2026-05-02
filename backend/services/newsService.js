'use strict';

const RssParser = require('rss-parser');
const { getDb } = require('../config/database');

const parser = new RssParser({
  timeout: 10000,
  headers: { 'User-Agent': 'FootballStatsBot/1.0' },
});

const RSS_FEEDS = [
  {
    url: 'https://feeds.bbci.co.uk/sport/football/rss.xml',
    source: 'BBC Sport',
    category: 'general',
  },
  {
    url: 'https://www.theguardian.com/football/rss',
    source: 'The Guardian',
    category: 'general',
  },
  {
    url: 'https://www.skysports.com/rss/12040',
    source: 'Sky Sports',
    category: 'general',
  },
  {
    url: 'https://www.goal.com/feeds/en/news',
    source: 'Goal.com',
    category: 'general',
  },
];

async function fetchAllFeeds() {
  const db = getDb();
  const insert = db.prepare(`
    INSERT OR IGNORE INTO articles (title, description, url, image_url, published_at, source, category)
    VALUES (@title, @description, @url, @image_url, @published_at, @source, @category)
  `);

  let total = 0;

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      const items = parsed.items || [];

      for (const item of items.slice(0, 30)) {
        const imageUrl =
          item['media:content']?.$.url ||
          item['media:thumbnail']?.$.url ||
          item.enclosure?.url ||
          null;

        try {
          insert.run({
            title: item.title?.trim() || 'Untitled',
            description: stripHtml(item.contentSnippet || item.summary || '').slice(0, 500),
            url: item.link || item.guid || '',
            image_url: imageUrl,
            published_at: item.pubDate || item.isoDate || new Date().toISOString(),
            source: feed.source,
            category: feed.category,
          });
          total++;
        } catch (_) {
          // ignore duplicate URLs (UNIQUE constraint)
        }
      }

      console.log(`[NEWS] Fetched ${items.length} articles from ${feed.source}`);
    } catch (err) {
      console.warn(`[NEWS] Failed to fetch ${feed.source}: ${err.message}`);
    }
  }

  return total;
}

function stripHtml(str) {
  return str.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}

module.exports = { fetchAllFeeds };
