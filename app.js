const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const router = require('routes');
const winston = require('./config/winston');

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev', { stream: winston.stream }));
router(app);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    winston.info(`db connected to ${process.env.MONGO_URI}`);
  })
  .catch((err) => {
    winston.info(`db connection error ${err.message}`);
  });

mongoose.Promise = global.Promise;
module.exports = app;
