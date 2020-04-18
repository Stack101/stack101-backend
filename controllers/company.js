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
    companies = await Company.find(queryObj).sort('-cnt').limit(limit);
  } else {
    companies = await Company.find(queryObj).sort('-cnt');
  }

  res.json({ ok: 1, msg: 'Http Result Code 200 OK', item: companies });
});

exports.getCompany = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const company = await Company.findOne({ _id: id }).populate('stacks');
  if (company) {
    res.json({ ok: 1, msg: 'Http Result Code 200 OK', item: company });
  } else {
    next(new AppError(404, 'ITEM_DOESNT_EXIST'));
  }
});
