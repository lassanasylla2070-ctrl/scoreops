'use strict';

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${req.method} ${req.path} → ${status}: ${message}`);
    if (err.stack) console.error(err.stack);
  }

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

function notFound(req, res, next) {
  const err = new Error(`Not Found — ${req.originalUrl}`);
  err.status = 404;
  next(err);
}

module.exports = { errorHandler, notFound };
