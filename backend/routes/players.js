'use strict';

const router = require('express').Router();
const ctrl = require('../controllers/playerController');
const { cacheMiddleware } = require('../middleware/cache');
const { CACHE_TTL } = require('../config/env');

router.get('/top/scorers',  cacheMiddleware(CACHE_TTL.PLAYERS), ctrl.getTopScorers);
router.get('/top/assists',  cacheMiddleware(CACHE_TTL.PLAYERS), ctrl.getTopAssisters);
router.get('/:id',          cacheMiddleware(CACHE_TTL.PLAYERS), ctrl.getPlayerById);
router.get('/',             cacheMiddleware(CACHE_TTL.PLAYERS), ctrl.getPlayers);

module.exports = router;
