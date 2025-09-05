import express from "express";
import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import User from "../models/User.js";

const router = express.Router();

// Return balances + suggested transfers (greedy)
router.get("/:groupId", async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const [expenses, group] = await Promise.all([
            (await Expense.find({ groupId })),
            (await Group.findById(groupId)),
        ]);
        if (!group) return res.status(404).json({ error: "group not found" });

        const balances = {}; // userId -> net
        for (const m of group.members) balances[m.toString()] = 0;

        for (const exp of expenses) {
            const payer = exp.paidBy.toString();
            balances[payer] = (balances[payer] || 0) + exp.amount;
            for (const [uid, share] of exp.split.entries()) {
                balances[uid] = (balances[uid] || 0) - share;
            }
        }

        // Build creditors/debtors
        const creditors = [];
        const debtors = [];
        for (const [uid, net] of Object.entries(balances)) {
            if (net > 0.01) creditors.push({ uid, amt: net });
            else if (net < -0.01) debtors.push({ uid, amt: -net });
        }
        creditors.sort((a, b) => b.amt - a.amt);
        debtors.sort((a, b) => b.amt - a.amt);

        const transfers = [];
        let i = 0, j = 0;
        while (i < debtors.length && j < creditors.length) {
            const pay = Math.min(debtors[i].amt, creditors[j].amt);
            transfers.push({ from: debtors[i].uid, to: creditors[j].uid, amount: Math.round(pay * 100) / 100 });
            debtors[i].amt -= pay;
            creditors[j].amt -= pay;
            if (debtors[i].amt <= 0.01) i++;
            if (creditors[j].amt <= 0.01) j++;
        }

        // Populate names/emails
        const uids = Object.keys(balances);
        const users = await User.find({ _id: { $in: uids } });
        const map = {};
        users.forEach(u => map[u._id] = { name: u.name, email: u.email });

        res.json({
            balances: Object.fromEntries(
                Object.entries(balances).map(([uid, v]) => [uid, Math.round(v * 100) / 100])
            ),
            transfers: transfers.map(t => ({
                ...t,
                fromUser: map[t.from],
                toUser: map[t.to],
            })),
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
