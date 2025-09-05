import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Upsert a user on login; return Mongo _id for app usage
router.post("/upsert", async (req, res) => {
    try {
        const { firebaseId, email, name } = req.body;
        if (!email && !firebaseId) return res.status(400).json({ error: "email or firebaseId required" });

        const query = email ? { email } : { firebaseId };
        const update = { $setOnInsert: { createdAt: new Date() }, $set: { firebaseId, email, name } };
        const options = { upsert: true, returnDocument: "after" };

        const result = await User.findOneAndUpdate(query, update, options);
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
