const mongoose = require('mongoose');

const { Schema } = mongoose;

const companySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    link: { type: String, required: true },
    logo: { type: String, required: true },
    stacks: [{ type: Schema.Types.ObjectId, ref: 'Stack' }],
  },
  {
    toJSON: { virtuals: true },
  },
);

companySchema.virtual('cnt').get(function () {
  if (this.stacks) return this.stacks.length || 0;
});

module.exports = mongoose.model('Company', companySchema);
