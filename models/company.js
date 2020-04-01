const mongoose = require('mongoose');

const { Schema } = mongoose;

const companySchema = new Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  link: { type: String, required: true },
  logo: { type: String, required: true },
  stacks: { type: Schema.Types.ObjectId, ref: 'Stack' },
  isAuthenticated: { type: Boolean, default: false },
  likes: { type: Schema.Types.ObjectId, ref: 'User' },
  // jobs: {type: Schema.Types.ObjectId, ref: "Job"},
  // members: {type: Schema.Types.ObjectId, ref: "User"},
});

module.exports = mongoose.model('Company', companySchema);
