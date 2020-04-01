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
const companies = JSON.parse(fs.readFileSync(`${__dirname}/company.json`, 'utf-8'));

console.log(stacks);
console.log(companies);

const insertStacks = async () => {
  await Stack.create(stacks);
  console.log('inserted stacks data');
};

insertStacks();
