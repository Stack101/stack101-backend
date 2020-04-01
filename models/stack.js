const mongoose = require('mongoose');

const { Schema } = mongoose;

const stackSchema = new Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  image: String,
  type: { type: String, required: true },
});

module.exports = mongoose.model('Stack', stackSchema);
