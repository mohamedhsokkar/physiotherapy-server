import Patient from "../../models/Patient.js";
import { refreshPatientStatuses } from "../../utils/patientStatus.js";

const createPatient = async (payload, userId) => {
  const patient = await Patient.create({
    ...payload,
    createdBy: userId
  });

  return patient;
};

const getPatients = async ({ page = 1, limit = 10, search = "", status }) => {
  await refreshPatientStatuses();

  const query = {};

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } }
    ];
  }

  if (status) {
    query.status = status;
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [patients, total] = await Promise.all([
    Patient.find(query)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber),
    Patient.countDocuments(query)
  ]);

  return {
    patients,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      pages: Math.ceil(total / limitNumber)
    }
  };
};

const getPatientById = async (patientId) => {
  await refreshPatientStatuses([patientId]);

  const patient = await Patient.findById(patientId).populate(
    "createdBy",
    "name email role"
  );

  if (!patient) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }

  return patient;
};

const updatePatient = async (patientId, payload) => {
  const patient = await Patient.findById(patientId);

  if (!patient) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }

  Object.assign(patient, payload);

  await patient.save();

  return patient;
};

const deletePatient = async (patientId) => {
  const patient = await Patient.findById(patientId);

  if (!patient) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }

  await patient.deleteOne();

  return { message: "Patient deleted successfully" };
};

export {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient
};
