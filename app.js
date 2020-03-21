const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("routes");

dotenv.config();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
router(app);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    console.log("db connected to " + process.env.MONGO_URI);
  })
  .catch(err => {
    console.log("db connection error " + err.message);
  });

mongoose.Promise = global.Promise;
module.exports = app;
