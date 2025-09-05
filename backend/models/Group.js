
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  expenses: [{ type: Schema.Types.ObjectId, ref: 'Expense' }],
}, { timestamps: true });

module.exports = mongoose.model('Group', GroupSchema);
