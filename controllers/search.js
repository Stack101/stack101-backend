const Company = require('models/company');
const Stack = require('models/stack');
const catchAsync = require('utils/catchAsync');
const AppError = require('utils/appError');

exports.getResult = catchAsync(async (req, res, next) => {
  const { keyword } = req.params;

  // 1. keyword와 일치하는 이름을 가진 데이터 존재 확인 (대소문자 구분없이 검색되도록 정규표현식 활용)
  // 2. 해당 데이터 뽑아서 응답
  const company = await Company.findOne({ name: { $regex: keyword, $options: 'i' } }).populate('stacks');
  const stack = await Stack.find({ name: { $regex: keyword, $options: 'i' } }).populate('companies');
  if (company || stack) {
    res.json({ ok: 1, msg: 'Http Result Code 200 OK', item: { companies: company, stacks: stack } });
  } else {
    next(new AppError(404, 'ITEM_DOESNT_EXIST'));
  }
});
