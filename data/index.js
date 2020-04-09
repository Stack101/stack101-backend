const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('../models/company');
const Stack = require('../models/stack');

dotenv.config({ path: '../.env' });

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection success');
  });

const stacks = JSON.parse(fs.readFileSync(`${__dirname}/stacks.json`, 'utf-8'));
const companies = JSON.parse(fs.readFileSync(`${__dirname}/companies.json`, 'utf-8'));

console.log(stacks);
console.log(companies);

const insertStacks = async () => {
  await Stack.create(stacks);
  console.log('inserted stacks dev data');
};

const insertCompanies = async () => {
  await Company.create(companies);
  console.log('inserted companies dev data');
};

(async () => {
  await insertStacks();
  await insertCompanies();

  const originalCompanies = await Company.find();
  const originalStacks = await Stack.find();

  originalCompanies.forEach(async (e) => {
    const randNum = Math.ceil(Math.random() * (8 - 6) + 6);
    const randStacksArr = [];
    const compStacksArr = [];

    new Array(randNum).fill(0).forEach(async (_) => {
      const randStackIdx = Math.ceil(Math.random() * originalStacks.length - 1);

      if (!~randStacksArr.indexOf(randStackIdx)) {
        randStacksArr.push(randStackIdx);
        const currentStackId = originalStacks[randStackIdx]._id;
        compStacksArr.push(currentStackId);
        await Stack.updateOne({ _id: currentStackId }, { $push: { companies: e._id } });
      }
    });

    await Company.updateOne({ _id: e._id }, { $set: { stacks: compStacksArr } });
  });
})();
