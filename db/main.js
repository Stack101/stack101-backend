const mongoose = require('mongoose');

const DB = mongoose.createConnection('mongodb://127.0.0.1:27017/stack101', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = DB;
