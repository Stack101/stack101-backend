const Stack = require('models/stack');
const catchAsync = require('utils/catchAsync');
const AppError = require('utils/appError');

exports.getResult = catchAsync(async (req, res, next) => {
  const { job_detail, category } = req.query;
  const queryObj = {};

  if (job_detail) {
    queryObj.job_detail = job_detail;
  }
  if (category) {
    queryObj.category = category;
  }

  const total = await Stack.aggregate([
    { $match: queryObj },
    { $project: { cnt: { $size: '$companies' } } },
    { $group: { _id: queryObj, totalCount: { $sum: '$cnt' } } },
  ]);

  const stacks = await Stack.aggregate([
    { $match: queryObj },
    {
      $project: {
        _v: 1,
        name: 1,
        count: { $cond: { if: { $isArray: '$companies' }, then: { $size: '$companies' }, else: 0 } },
        total_count: { $sum: total[0].totalCount },
      },
    },
    {
      $group:
      {
        _id: '$_id',
        name: { $first: '$name' },
        count: { $sum: '$count' },
        total_count: { $sum: '$total_count' },
      },
    },
    {
      $addFields: {
        percentage: { $round: [{ $multiply: [{ $divide: ['$count', '$total_count'] }, 100] }, 0] },
      },
    },
    { $sort: { percentage: -1 } },
  ]);

  if (stacks) {
    res.json({ ok: 1, msg: 'Http Result Code 200 OK', item: stacks });
  } else {
    next(new AppError(404, 'ITEM_DOESNT_EXIST'));
  }
});
