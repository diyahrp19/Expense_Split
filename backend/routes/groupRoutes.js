import express from "express";
import Group from "../models/Group.js";
import User from "../models/User.js";

const router = express.Router();

// Create group with members (upserts by email)
router.post("/", async (req, res) => {
    try {
        const { name, members, createdBy } = req.body; // members: [{name?, email}]
        if (!name || !Array.isArray(members) || !createdBy) return res.status(400).json({ error: "invalid payload" });

        // Upsert each member by email
        const memberIds = [];
        for (const m of members) {
            const result = await User.findOneAndUpdate(
                { email: m.email },
                { $setOnInsert: { name: m.name || m.email }, $set: { email: m.email } },
                { upsert: true, returnDocument: "after" }
            );
            memberIds.push(result._id);
        }

        const group = await Group.create({ name, members: memberIds, createdBy });
        const populated = await group.populate("members");
        res.json(populated);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get groups for a user (by Mongo user _id)
router.get("/user/:userId", async (req, res) => {
    try {
        const groups = await Group.find({ members: req.params.userId }).populate("members");
        res.json(groups);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get a single group
router.get("/:groupId", async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId).populate("members");
        if (!group) return res.status(404).json({ error: "group not found" });
        res.json(group);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
