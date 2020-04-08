const Stack = require('models/stack');
const catchAsync = require('utils/catchAsync');
const AppError = require('utils/appError');

exports.getResult = catchAsync(async (req, res, next) => {
  const { category, sub_category } = req.query;

  const result = await Stack.aggregate([
    { $match: { category, sub_category } },
    { $project: { cnt: { $size: '$companies' } } },
    { $group: { _id: { category, sub_category }, total: { $sum: '$cnt' } } },
  ]);

  let stacks = await Stack.find({ category, sub_category });

  stacks = stacks.map((e) => ({
    _id: e._id,
    cnt: e.cnt,
    total: result[0].total,
    name: e.name,
    description: e.description,
    percentage: (e.cnt / result[0].total) * 100,
  }));

  if (stacks) {
    res.json({ ok: 1, item: stacks });
  } else {
    next(new AppError(404, 'ITEM_DOESNT_EXIST'));
  }
});
