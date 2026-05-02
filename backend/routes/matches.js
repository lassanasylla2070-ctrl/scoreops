'use strict';

const router = require('express').Router();
const ctrl = require('../controllers/matchController');
const { cacheMiddleware } = require('../middleware/cache');
const { CACHE_TTL } = require('../config/env');

router.get('/live',     cacheMiddleware(CACHE_TTL.LIVE),    ctrl.getLiveMatches);
router.get('/upcoming', cacheMiddleware(CACHE_TTL.MATCHES), ctrl.getUpcomingMatches);
router.get('/today',    cacheMiddleware(CACHE_TTL.LIVE),    ctrl.getTodayMatches);
router.get('/:id',      cacheMiddleware(CACHE_TTL.MATCHES), ctrl.getMatchById);
router.get('/',         cacheMiddleware(CACHE_TTL.MATCHES), ctrl.getMatches);

module.exports = router;
