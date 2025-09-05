
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Settlement = require('../models/Settlement');

router.post('/', auth, async (req, res) => {
  const { group, from, to, amount } = req.body;
  try {
    const s = new Settlement({ group, from, to, amount });
    await s.save();
    res.json(s);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

router.get('/group/:groupId', auth, async (req, res) => {
  try {
    const list = await Settlement.find({ group: req.params.groupId }).populate('from to', 'name email');
    res.json(list);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

module.exports = router;
