const Stack = require('models/stack');
const catchAsync = require('utils/catchAsync');
const AppError = require('utils/appError');

exports.getAllStacks = catchAsync(async (req, res) => {
  const { category } = req.query;

  const stacks = await Stack.find({ category });
  res.json({ ok: 1, item: stacks });
});

exports.getStack = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const stack = await Stack.findOne({ _id: id });
  if (stack) {
    res.json({ ok: 1, item: stack });
  } else {
    next(new AppError(404, 'ITEM_DOESNT_EXIST'));
  }
});
