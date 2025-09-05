
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');
const Group = require('../models/Group');

// Add expense
router.post('/', auth, async (req, res) => {
  const { groupId, description, amount, payer, splits, category, date } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ msg: 'Group not found' });
    if (!group.members.some(m => m.toString() === req.user.id)) return res.status(403).json({ msg: 'Not a member' });
    const expense = new Expense({ group: groupId, description, amount, payer, splits, category, date });
    await expense.save();
    group.expenses.push(expense._id);
    await group.save();
    res.json(expense);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// Get expenses for a group
router.get('/group/:groupId', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId }).populate('payer', 'name email').populate('splits.user', 'name email');
    res.json(expenses);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

module.exports = router;
