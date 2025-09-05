
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Group = require('../models/Group');
const User = require('../models/User');

// Create group
router.post('/', auth, async (req, res) => {
  const { name, description, memberIds } = req.body;
  try {
    const group = new Group({ name, description, members: memberIds || [req.user.id] });
    await group.save();
    // add group to each user's groups array
    await User.updateMany({ _id: { $in: group.members } }, { $push: { groups: group._id } });
    res.json(group);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// Get groups of user
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id }).populate('members', 'name email');
    res.json(groups);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// Get single group
router.get('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members', 'name email')
      .populate({ path: 'expenses', populate: { path: 'payer', select: 'name email' } });
    if (!group) return res.status(404).json({ msg: 'Group not found' });
    if (!group.members.some(m => m._id.toString() === req.user.id)) return res.status(403).json({ msg: 'Not a member' });
    res.json(group);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

module.exports = router;
