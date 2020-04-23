const Company = require('models/company');
const catchAsync = require('utils/catchAsync');
const AppError = require('utils/appError');

exports.getAllCompanies = catchAsync(async (req, res) => {
  const { category, stack, name } = req.query;
  const { limit } = req.query;
  const queryObj = {};
  if (category) {
    queryObj.category = category;
  }
  if (stack) {
    queryObj.stack = stack;
  }
  if (name) {
    queryObj.name = name;
  }

  let companies;
  if (limit) {
    companies = await Company.aggregate([
      { $match: queryObj },
      {
        $project: {
          _v: 1,
          name: 1,
          description: 1,
          category: 1,
          link: 1,
          logo: 1,
          cnt: { $cond: { if: { $isArray: '$stacks' }, then: { $size: '$stacks' }, else: 0 } },
        },
      },
      { $limit: limit },
      { $sort: { name: 1 } },
    ]);
  } else {
    companies = await Company.aggregate([
      { $match: queryObj },
      {
        $project: {
          _v: 1,
          name: 1,
          description: 1,
          category: 1,
          link: 1,
          logo: 1,
          cnt: { $cond: { if: { $isArray: '$stacks' }, then: { $size: '$stacks' }, else: 0 } },
        },
      },
      { $sort: { name: 1 } },
    ]);
  }

  res.json({ ok: 1, msg: 'Http Result Code 200 OK', item: companies });
});

exports.getCompany = catchAsync(async (req, res, next) => {
  const company = await Company.findById(req.params.id).populate('stacks', { companies: 0 });
  if (company) {
    res.json({ ok: 1, msg: 'Http Result Code 200 OK', item: company });
  } else {
    next(new AppError(404, 'ITEM_DOESNT_EXIST'));
  }
});
