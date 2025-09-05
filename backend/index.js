import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(
    cors({
        origin: process.env.FRONTEND_ORIGIN || "*",
        credentials: true,
    })
);
app.use(express.json());

// --- Mongo connect ---
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((e) => {
        console.error("❌ MongoDB error", e);
        process.exit(1);
    });

// --- Models ---
import User from "./models/User.js";
import Group from "./models/Group.js";
import Expense from "./models/Expense.js";

// --- Routes ---
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import settlementRoutes from "./routes/settlementRoutes.js";

app.get("/", (_req, res) => res.send("Expense Splitter API running"));
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/settlements", settlementRoutes);

// --- Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));
