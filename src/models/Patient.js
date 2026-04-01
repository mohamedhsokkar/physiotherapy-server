import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Patient full name is required"],
      trim: true
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Gender is required"]
    },
    dateOfBirth: {
      type: Date
    },
    address: {
      type: String,
      trim: true,
      default: ""
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    },
    emergencyContactName: {
      type: String,
      trim: true,
      default: ""
    },
    emergencyContactPhone: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
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

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;