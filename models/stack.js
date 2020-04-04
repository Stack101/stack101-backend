const mongoose = require('mongoose');

const { Schema } = mongoose;

const stackSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  logo: String,
  companies: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
  category: { type: String, required: true },
  sub_category: { type: String, required: true },
});

module.exports = mongoose.model('Stack', stackSchema);
