const Company = require('models/company');
const catchAsync = require('utils/catchAsync');
const AppError = require('utils/appError');

exports.getAllCompanies = catchAsync(async (req, res, next) => {
  const { stack, category, search } = req.query;

  let companies;
  if (stack) {
    console.log(stack);
    companies = await Company.find({ stacks: stack }).populate({
      path: 'stacks',
      select: 'name description category sub_category',
    });
    console.log(companies);
  } else if (category) {
    companies = await Company.find({ category }).populate({
      path: 'stacks',
      select: 'name description category sub_category',
    });
  } else if (search) {
    companies = await Company.find({ name: search }).populate({
      path: 'stacks',
      select: 'name description category sub_category',
    });
  } else {
    return next(new AppError(400, 'SERVICE_NOT_OFFERED'));
  }

  res.json({ ok: 1, item: companies });
});

exports.getCompany = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const company = await Company.findOne({ _id: id }).populate({
    path: 'stacks',
    select: 'name description category sub_category',
  });

  if (company) {
    res.json({ ok: 1, item: company });
  } else {
    return next(new AppError(404, 'ITEM_DOESNT_EXIST'));
  }
});
