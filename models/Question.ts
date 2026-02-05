import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
    },
    answeredAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["pending", "answered", "ignored"],
        default: "pending",
    },
});

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);
