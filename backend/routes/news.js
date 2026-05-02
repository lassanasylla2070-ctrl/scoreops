'use strict';

const router = require('express').Router();
const ctrl = require('../controllers/newsController');
const { cacheMiddleware } = require('../middleware/cache');
const { CACHE_TTL } = require('../config/env');

router.get('/sources', cacheMiddleware(CACHE_TTL.NEWS), ctrl.getSources);
router.get('/:id',     cacheMiddleware(CACHE_TTL.NEWS), ctrl.getNewsById);
router.get('/',        cacheMiddleware(CACHE_TTL.NEWS), ctrl.getNews);

module.exports = router;
