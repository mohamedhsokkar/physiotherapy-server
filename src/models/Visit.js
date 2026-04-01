import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient is required"]
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor is required"]
    },
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Registered by user is required"]
    },
    visitDate: {
      type: Date,
      required: [true, "Visit date is required"],
      default: Date.now
    },
    visitType: {
      type: String,
      enum: ["consultation", "session", "follow_up"],
      default: "session"
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "completed"
    },
    chiefComplaint: {
      type: String,
      trim: true,
      default: ""
    },
    clinicalNotes: {
      type: String,
      trim: true,
      default: ""
    },
    treatmentPlan: {
      type: String,
      trim: true,
      default: ""
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"]
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: [0, "Paid amount cannot be negative"]
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid"
    }
  },
  {
    timestamps: true
  }
);

visitSchema.pre("save", function (next) {
  if (this.amountPaid <= 0) {
    this.paymentStatus = "unpaid";
  } else if (this.amountPaid < this.totalAmount) {
    this.paymentStatus = "partial";
  } else {
    this.paymentStatus = "paid";
  }

  next();
});

const Visit = mongoose.model("Visit", visitSchema);

export default Visit;