const Company = require('models/company');
const Stack = require('models/stack');
const catchAsync = require('utils/catchAsync');
const AppError = require('utils/appError');

exports.getResult = catchAsync(async (req, res, next) => {
  const { keyword } = req.params;

  // 1. keyword와 일치하는 이름을 가진 데이터 존재 확인 (대소문자 구분없이 검색되도록 정규표현식 활용)
  // 2. 참조 ObjectId를 실제 객체로 반환할 때, 그 객체의 참조 Id까지는 반환할 필요 없으므로 제외해서 조회
  const company = await Company.find({ name: { $regex: keyword, $options: 'i' } }).populate('stacks', { companies: false });
  const stack = await Stack.find({ name: { $regex: keyword, $options: 'i' } }).populate('companies', { stacks: false });
  if (company || stack) {
    res.json({ ok: 1, msg: 'Http Result Code 200 OK', item: { companyResult: company, stackResult: stack } });
  } else {
    next(new AppError(404, 'ITEM_DOESNT_EXIST'));
  }
});
