const mongoose = require('mongoose');

const { Schema } = mongoose;

const companySchema = new Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, collation: { locale: 'en' } },
    description: { type: String, required: true },
    category: { type: String, required: true },
    link: { type: String, required: true },
    logo: { type: String, required: true },
    stacks: [{ type: Schema.Types.ObjectId, ref: 'Stack' }],
  },
);

companySchema.virtual('cnt').get(function getCnt() {
  return (this.stacks && this.stacks.length) || 0;
});


module.exports = mongoose.model('Company', companySchema);
