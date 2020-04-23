const mongoose = require('mongoose');

const { Schema } = mongoose;

const stackSchema = new Schema(
  {
    name: { type: String, required: true, collation: { locale: 'en' } },
    description: { type: String, required: true },
    logo: String,
    job_type: { type: String, required: true },
    job_detail: { type: String, required: true },
    category: { type: String, required: true },
    companies: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
  },
  {
    toJSON: { virtuals: true },
  },
);

stackSchema.virtual('cnt').get(() => {
  if (this.companies) {
    return this.companies.length;
  }
  return 0;
});

module.exports = mongoose.model('Stack', stackSchema);
