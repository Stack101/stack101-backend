const mongoose = require('mongoose');
const dotenv = require('dotenv');
const csvtojson = require('csvtojson');
const Company = require('../models/company');
const Stack = require('../models/stack');

dotenv.config({ path: '../.env' });

// 기술스택 정보 추가
const insertStacks = async () => {
  await csvtojson()
    .fromFile(`${__dirname}/stacks.csv`)
    .then((stack) => {
      Stack.create(stack);
    });
};

// 참조 ObjectId 추가
const updateRefId = async (element) => {
  // 프론트엔드 언어 스택
  element.Frontend_Language.split(',').forEach(async (v) => {
    // 해당 스택의 id 조회
    const result = await Stack.findOne({ name: v, job_detail: 'Frontend' }, '_id');

    // 회사 정보에 스택 ObjectId정보 push
    const updatedResult = await Company.findOneAndUpdate(
      { name: element.Name },
      { $push: { stacks: result._id } },
    );

    // 스택 정보에 해당 회사 ObjectId정보 push
    await Stack.findOneAndUpdate(
      { _id: result._id },
      { $push: { companies: updatedResult._id } },
    );
  });

  // 프론트엔드 프레임워크 스택
  element.Frontend_Framework.split(',').forEach(async (v) => {
    const result = await Stack.findOne({ name: v, job_detail: 'Frontend' }, '_id');
    if (result !== null) {
      const updatedResult = await Company.findOneAndUpdate(
        { name: element.Name },
        { $push: { stacks: result._id } },
      );
      await Stack.findOneAndUpdate(
        { _id: result._id },
        { $push: { companies: updatedResult._id } },
      );
    }
  });

  // 백엔드 언어 스택
  element.Backend_Language.split(',').forEach(async (v) => {
    const result = await Stack.findOne({ name: v, job_detail: 'Backend' }, '_id');
    const updatedResult = await Company.findOneAndUpdate(
      { name: element.Name },
      { $push: { stacks: result._id } },
    );
    await Stack.findOneAndUpdate(
      { _id: result._id },
      { $push: { companies: updatedResult._id } },
    );
  });

  // 백엔드 프레임워크 스택
  element.Backend_Framework.split(',').forEach(async (v) => {
    const result = await Stack.findOne({ name: v, job_detail: 'Backend' }, '_id');
    const updatedResult = await Company.findOneAndUpdate(
      { name: element.Name },
      { $push: { stacks: result._id } },
    );
    await Stack.findOneAndUpdate(
      { _id: result._id },
      { $push: { companies: updatedResult._id } },
    );
  });

  // 안드로이드 스택
  element.Android.split(',').forEach(async (v) => {
    const result = await Stack.findOne({ name: v, job_detail: 'Android' }, '_id');
    const updatedResult = await Company.findOneAndUpdate(
      { name: element.Name },
      { $push: { stacks: result._id } },
    );
    await Stack.findOneAndUpdate(
      { _id: result._id },
      { $push: { companies: updatedResult._id } },
    );
  });

  // IOS 스택
  element.IOS.split(',').forEach(async (v) => {
    const result = await Stack.findOne({ name: v, job_detail: 'IOS' }, '_id');
    const updatedResult = await Company.findOneAndUpdate(
      { name: element.Name },
      { $push: { stacks: result._id } },
    );
    await Stack.findOneAndUpdate(
      { _id: result._id },
      { $push: { companies: updatedResult._id } },
    );
  });

  // 디자인 툴 스택
  element.DesignTool.split(',').forEach(async (v) => {
    const result = await Stack.findOne({ name: v, category: 'Tool' }, '_id');
    const updatedResult = await Company.findOneAndUpdate(
      { name: element.Name },
      { $push: { stacks: result._id } },
    );
    await Stack.findOneAndUpdate(
      { _id: result._id },
      { $push: { companies: updatedResult._id } },
    );
  });
};

// 회사 정보 추가
const insertCompanies = async () => {
  await csvtojson()
    .fromFile(`${__dirname}/companies.csv`)
    .subscribe(async (element) => {
      await Company.create({
        name: element.Name,
        description: element.Description,
        category: element.Column,
        logo: element.Logo,
        link: element.Link,
      });
      await updateRefId(element);
    });
};

(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }).then(() => {
    console.log('DB connection success');
  });
  // Stack.companies를 제외하고 스택정보 추가
  await insertStacks();

  /* Company.stacks를 제외하고 회사정보 추가,
  참조관계에 맞는 ObjectId값을 companies, stacks에 추가 */
  await insertCompanies();
})();
