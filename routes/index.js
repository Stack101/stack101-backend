const testRouter = require('./test');

const router = (app) => {
  app.use('/test', testRouter);

  app.all('*', (req, res, next) => {
    const err = {
      msg: `server doesn't have a service for ${req.originalUrl}`,
      status: 'fail',
      statusCode: 404,
    };
    next(err);
  });

  app.use((err, req, res) => {
    const error = { ...err };
    error.statusCode = err.statusCode || 500;
    error.status = err.status || 'error';
    res.status(err.statusCode).json({
      ok: 0,
      status: error.status,
      msg: error.msg,
    });
  });
};

module.exports = router;
