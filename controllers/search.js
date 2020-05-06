const Company = require('../models/company');
const Stack = require('../models/stack');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getResult = catchAsync(async (req, res, next) => {
  const { keyword } = req.params;
  let searchResult;

  const exactMatchKeyword = `^${keyword}$`;
  const startMatchKeyword = `^${keyword}`;

  const company = await Company.findOne({ name: { $regex: exactMatchKeyword, $options: 'ix' } });
  const stack = await Stack.findOne({ name: { $regex: exactMatchKeyword, $options: 'ix' } });

  if (company && stack) {
  // 정확한 회사명과 스택명이 모두 존재 할 때

    const exactCompany = await Company.aggregate([
      {
        $match: {
          name: { $regex: exactMatchKeyword, $options: 'ix' },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          logo: 1,
          repStack: { $arrayElemAt: ['$stacks', 0] },
          cnt: { $size: '$stacks' },
        },
      },
      {
        $lookup: {
          from: 'stacks',
          localField: 'repStack',
          foreignField: '_id',
          as: 'repStack',
        },
      },
      {
        $addFields: {
          repStack: { $arrayElemAt: ['$repStack.name', 0] },
        },
      },
      {
        $sort: { name: 1, cnt: -1 },
      },
    ]);
    const exactStack = await Stack.aggregate([
      {
        $match: {
          name: { $regex: exactMatchKeyword, $options: 'ix' },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          logo: 1,
          repCompany: { $arrayElemAt: ['$companies', 0] },
          cnt: { $size: '$companies' },
        },
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'repCompany',
          foreignField: '_id',
          as: 'repCompany',
        },
      },
      {
        $addFields: {
          repCompany: { $arrayElemAt: ['$repCompany.name', 0] },
        },
      },
      {
        $sort: { name: 1, cnt: -1 },
      },
    ]);
    searchResult = { _id: keyword, stackResult: exactStack, companyResult: exactCompany };
  } else if (company && !stack) {
  // 정확한 회사명만 존재 할 때

    searchResult = await Company.aggregate([
      { $match: { name: { $regex: exactMatchKeyword, $options: 'ix' } } },
      {
        $project: {
          _id: 1,
          name: 1,
          logo: 1,
          repStack: { $arrayElemAt: ['$stacks', 0] },
          stacks: 1,
          cnt: { $size: '$stacks' },
        },
      },
      {
        $lookup: {
          from: 'stacks',
          localField: 'repStack',
          foreignField: '_id',
          as: 'repStack',
        },
      },
      {
        $addFields: {
          repStack: { $arrayElemAt: ['$repStack.name', 0] },
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
                repCompany: { $arrayElemAt: ['$$this.companies', 0] },
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
              _id: '$_id', name: '$name', logo: '$logo', repStack: '$repStack', cnt: '$cnt',
            },
          },
        },
      },
      { $unwind: '$stackResult' },
      {
        $lookup: {
          from: 'companies',
          localField: 'stackResult.repCompany',
          foreignField: '_id',
          as: 'stackResult.repCompany',
        },
      },
      {
        $addFields: {
          stackResult: {
            repCompany: { $arrayElemAt: ['$stackResult.repCompany.name', 0] },
          },
        },
      },
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
  // 정확한 스택명만 존재할 때

    searchResult = await Stack.aggregate([
      { $match: { name: { $regex: exactMatchKeyword, $options: 'ix' } } },
      {
        $project: {
          _id: 1,
          name: 1,
          companies: 1,
          logo: 1,
          repCompany: { $arrayElemAt: ['$companies', 0] },
          cnt: { $size: '$companies' },
        },
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'repCompany',
          foreignField: '_id',
          as: 'repCompany',
        },
      },
      {
        $addFields: {
          repCompany: { $arrayElemAt: ['$repCompany.name', 0] },
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
                repStack: { $arrayElemAt: ['$$this.stacks', 0] },
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
      {
        $lookup: {
          from: 'stacks',
          localField: 'companyResult.repStack',
          foreignField: '_id',
          as: 'companyResult.repStack',
        },
      },
      {
        $addFields: {
          companyResult: {
            repStack: { $arrayElemAt: ['$companyResult.repStack.name', 0] },
          },
        },
      },
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

  // 검색 키워드와 정확하게 일치하는 데이터가 없을 때
  if (!company && !stack) {
    // 검색 키워드와 부분적으로 일치하는 데이터 탐색

    const companyResult = await Company.aggregate([
      {
        $match: {
          name: { $regex: startMatchKeyword, $options: 'i' },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          logo: 1,
          repStack: { $arrayElemAt: ['$stacks', 0] },
          cnt: { $size: '$stacks' },
        },
      },
      {
        $lookup: {
          from: 'stacks',
          localField: 'repStack',
          foreignField: '_id',
          as: 'repStack',
        },
      },
      {
        $addFields: {
          repStack: { $arrayElemAt: ['$repStack.name', 0] },
        },
      },
      {
        $sort: { name: 1, cnt: -1 },
      },
    ]);
    const stackResult = await Stack.aggregate([
      {
        $match: {
          name: { $regex: startMatchKeyword, $options: 'i' },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          logo: 1,
          repCompany: { $arrayElemAt: ['$companies', 0] },
          cnt: { $size: '$companies' },
        },
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'repCompany',
          foreignField: '_id',
          as: 'repCompany',
        },
      },
      {
        $addFields: {
          repCompany: { $arrayElemAt: ['$repCompany.name', 0] },
        },
      },
      {
        $sort: { name: 1, cnt: -1 },
      },
    ]);

    searchResult = { _id: keyword, stackResult, companyResult };

    // 검색한 키워드가 존재하지 않는 경우
    if (companyResult.length === 0 && stackResult.length === 0) {
      next(new AppError(404, 'ITEM_DOESNT_EXIST'));
    } else {
    // 검색 키워드와 부분적으로 일치하는 데이터 반환

      res.json({ ok: 1, msg: 'Http Result Code 200 OK', item: searchResult });
    }
  } else {
  // 검색 키워드와 정확하게 일치하는 데이터 반환

    res.json({ ok: 1, msg: 'Http Result Code 200 OK', item: searchResult });
  }
});
