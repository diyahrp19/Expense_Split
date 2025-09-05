
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SettlementSchema = new Schema({
  group: { type: Schema.Types.ObjectId, ref: 'Group' },
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  to: { type: Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Settlement', SettlementSchema);
