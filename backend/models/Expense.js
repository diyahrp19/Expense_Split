
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SplitSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  share: { type: Number }, // amount owed by this user
}, { _id: false });

const ExpenseSchema = new Schema({
  group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  description: String,
  amount: { type: Number, required: true },
  payer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  splits: [SplitSchema],
  category: String,
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
