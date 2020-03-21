const testRouter = require("./test");

const router = app => {
  app.use("/test", testRouter);

  app.all("*", (req, res, next) => {
    const err = {
      msg: `server doesn't have a service for ${req.originalUrl}`,
      status: "fail",
      statusCode: 404
    };
    next(err);
  });

  app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    res.status(err.statusCode).json({
      ok: 0,
      status: err.status,
      msg: err.msg
    });
  });
};

module.exports = router;
