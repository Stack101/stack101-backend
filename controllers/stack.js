const Mongoose = require('mongoose');
const Stack = require('../models/stack');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllStacks = catchAsync(async (req, res, next) => {
  const { job_type, job_detail, category } = req.query;
  const { limit } = req.query;
  const queryObj = {};
  if (job_type) {
    queryObj.job_type = job_type;
  }
  if (job_detail) {
    queryObj.job_detail = job_detail;
  }
  if (category) {
    queryObj.category = category;
  }

  let stacks;
  if (limit) {
    stacks = await Stack.aggregate([
      { $match: queryObj },
      {
        $project: {
          _v: 1,
          name: 1,
          job_type: 1,
          job_detail: 1,
          category: 1,
          description: 1,
          logo: 1,
          cnt: { $cond: { if: { $isArray: '$companies' }, then: { $size: '$companies' }, else: 0 } },
        },
      },
      { $limit: limit },
      { $sort: { cnt: -1, name: 1 } },
    ]);
  } else {
    stacks = await Stack.aggregate([
      { $match: queryObj },
      {
        $project: {
          _v: 1,
          name: 1,
          job_type: 1,
          job_detail: 1,
          category: 1,
          description: 1,
          logo: 1,
          cnt: { $cond: { if: { $isArray: '$companies' }, then: { $size: '$companies' }, else: 0 } },
        },
      },
      { $sort: { cnt: -1, name: 1 } },
    ]);
  }
  if (stacks.length !== 0) {
    res.json({ ok: 1, msg: 'Http Result Code 200 OK', item: stacks });
  } else {
    next(new AppError(404, 'ITEM_DOESNT_EXIST'));
  }
});

exports.getStack = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { ObjectId } = Mongoose.Types;

  const stack = await Stack.aggregate([
    { $match: { _id: new ObjectId(id) } },
    {
      $project: {
        _id: 1,
        name: 1,
        job_type: 1,
        job_detail: 1,
        category: 1,
        description: 1,
        logo: 1,
        companies: 1,
        cnt: { $cond: { if: { $isArray: '$companies' }, then: { $size: '$companies' }, else: 0 } },
      },
    },
    {
      $lookup: {
        from: 'companies',
        localField: 'companies',
        foreignField: '_id',
        as: 'companies',
      },
    },
    {
      $addFields: {
        companies: {
          $map: {
            input: '$companies',
            in: {
              _id: '$$this._id',
              name: '$$this.name',
              logo: '$$this.logo',
              cnt: { $size: '$$this.stacks' },
            },
          },
        },
      },
    },
  ]);
  if (stack.length !== 0) {
    res.json({ ok: 1, msg: 'Http Result Code 200 OK', item: stack });
  } else {
    next(new AppError(404, 'ITEM_DOESNT_EXIST'));
  }
});
