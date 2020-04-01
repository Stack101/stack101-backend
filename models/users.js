const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  id: { type: String, required: true },
  pw: { type: String, required: true },
  name: { type: String, required: true },
  status: String,
  likes: { type: Schema.Types.ObjectId, ref: 'Company' },
});

module.exports = mongoose.model('User', userSchema);
