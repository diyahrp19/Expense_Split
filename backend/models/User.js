import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firebaseId: { type: String, index: true }, // optional for MVP
        name: String,
        email: { type: String, unique: true, sparse: true },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
