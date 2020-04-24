const mongoose = require('mongoose');

const { Schema } = mongoose;

const stackSchema = new Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, collation: { locale: 'en' } },
    description: { type: String, required: true },
    logo: String,
    job_type: { type: String, required: true },
    job_detail: { type: String, required: true },
    category: { type: String, required: true },
    companies: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
  },
);

stackSchema.virtual('cnt').get(function getCnt() {
  return (this.companies && this.companies.length) || 0;
});

module.exports = mongoose.model('Stack', stackSchema);
