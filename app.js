const express = require("express");
const app = express();
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

module.exports = app;
