const Company = require('models/company');
const Stack = require('models/stack');
const catchAsync = require('utils/catchAsync');
const AppError = require('utils/appError');

exports.getResult = catchAsync(async (req, res, next) => {
  const { keyword } = req.params;
  let searchResult;
  // 1. keyword와 일치하는 이름을 가진 데이터 존재 확인 (대소문자 구분없이 검색되도록 정규표현식 활용)
  // 2. 참조 ObjectId를 실제 객체로 반환할 때, 그 객체의 참조 Id까지는 반환할 필요 없으므로 제외해서 조회
  const company = await Company.findOne({ name: { $regex: keyword, $options: 'ix' } });
  const stack = await Stack.findOne({ name: { $regex: keyword, $options: 'ix' } });

  if (company && !stack) {
    searchResult = await Company.aggregate([
      { $match: { name: { $regex: keyword, $options: 'ix' } } },
      {
        $project: {
          _id: 1,
          name: 1,
          logo: 1,
          stacks: 1,
          cnt: { $size: '$stacks' },
        },
      },
      {
        $lookup: {
          from: 'stacks',
          localField: 'stacks',
          foreignField: '_id',
          as: 'stacks',
        },
      },
      {
        $addFields: {
          stacks: {
            $map: {
              input: '$stacks',
              in: {
                _id: '$$this._id',
                name: '$$this.name',
                logo: '$$this.logo',
                cnt: { $size: '$$this.companies' },
              },
            },
          },
        },
      },
      { $unwind: '$stacks' },
      {
        $group: {
          _id: keyword,
          stackResult: { $addToSet: '$stacks' },
          companyResult: {
            $addToSet: {
              _id: '$_id', name: '$name', logo: '$logo', cnt: '$cnt',
            },
          },
        },
      },
      { $unwind: '$stackResult' },
      { $sort: { 'stackResult.name': 1, 'companyResult.name': 1 } },
      {
        $group:
        {
          _id: keyword,
          stackResult: { $push: '$stackResult' },
          companyResult: {
            $first: '$$ROOT.companyResult',
          },
        },
      },
    ]);
  } else if (stack && !company) {
    searchResult = await Stack.aggregate([
      { $match: { name: { $regex: keyword, $options: 'ix' } } },
      {
        $project: {
          _id: 1,
          name: 1,
          companies: 1,
          logo: 1,
          cnt: { $size: '$companies' },
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
      { $unwind: '$companies' },
      {
        $group: {
          _id: keyword,
          stackResult: {
            $addToSet: {
              _id: '$_id', name: '$name', logo: '$logo', cnt: '$cnt',
            },
          },
          companyResult: { $addToSet: '$companies' },
        },
      },
      { $unwind: '$companyResult' },
      { $sort: { 'companyResult.name': 1, 'stackResult.name': 1 } },
      {
        $group:
        {
          _id: keyword,
          stackResult: { $first: '$$ROOT.stackResult' },
          companyResult: {
            $push: '$companyResult',
          },
        },
      },
    ]);
  }
  if (!company && !stack) {
    next(new AppError(404, 'ITEM_DOESNT_EXIST'));
  } else {
    res.json({ ok: 1, msg: 'Http Result Code 200 OK', item: searchResult });
  }
});
