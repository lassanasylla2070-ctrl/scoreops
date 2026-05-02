'use strict';

const router = require('express').Router();
const ctrl = require('../controllers/standingsController');
const { cacheMiddleware } = require('../middleware/cache');
const { CACHE_TTL } = require('../config/env');

router.get('/',              cacheMiddleware(CACHE_TTL.STANDINGS), ctrl.getAllStandings);
router.get('/:leagueCode',   cacheMiddleware(CACHE_TTL.STANDINGS), ctrl.getStandingsByLeague);

module.exports = router;
