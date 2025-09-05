import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
        description: { type: String, required: true },
        amount: { type: Number, required: true, min: 0 },
        paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        category: { type: String, enum: ["Food", "Travel", "Utilities", "Other"], default: "Other" },
        // Map of userId -> share amount
        split: { type: Map, of: Number, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
