import express from "express";
import Expense from "../models/Expense.js";

const router = express.Router();

// Add expense (frontend will compute split or you can compute equal there)
router.post("/", async (req, res) => {
    try {
        const { groupId, description, amount, paidBy, split, category } = req.body;
        if (!groupId || !description || !amount || !paidBy || !split) return res.status(400).json({ error: "invalid payload" });
        const expense = await Expense.create({ groupId, description, amount, paidBy, split, category });
        res.json(expense);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get expenses for a group
router.get("/:groupId", async (req, res) => {
    try {
        const expenses = await Expense.find({ groupId: req.params.groupId }).populate("paidBy");
        res.json(expenses);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
