'use strict';

const router = require('express').Router();
const ctrl = require('../controllers/teamController');
const { cacheMiddleware } = require('../middleware/cache');
const { CACHE_TTL } = require('../config/env');

router.get('/:id/matches', cacheMiddleware(CACHE_TTL.MATCHES), ctrl.getTeamMatches);
router.get('/:id',         cacheMiddleware(CACHE_TTL.TEAMS),   ctrl.getTeamById);
router.get('/',            cacheMiddleware(CACHE_TTL.TEAMS),   ctrl.getTeams);

module.exports = router;
