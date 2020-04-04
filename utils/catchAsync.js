module.exports = (fn) => (req, res, next) => {
  console.log('CATCHASYNC');
  fn(req, res, next).catch((err) => next(err));
};
