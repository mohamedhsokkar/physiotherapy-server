import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Expense title is required"],
      trim: true
    },
    category: {
      type: String,
      enum: [
        "rent",
        "salary",
        "utilities",
        "maintenance",
        "supplies",
        "marketing",
        "transport",
        "other"
      ],
      default: "other"
    },
    amount: {
      type: Number,
      required: [true, "Expense amount is required"],
      min: [0, "Expense amount cannot be negative"]
    },
    expenseDate: {
      type: Date,
      required: [true, "Expense date is required"],
      default: Date.now
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "bank_transfer", "other"],
      default: "cash"
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;