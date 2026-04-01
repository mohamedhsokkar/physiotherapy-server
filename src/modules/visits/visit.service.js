import Visit from "../../models/Visit.js";
import Patient from "../../models/Patient.js";
import User from "../../models/User.js";

const ensurePatientExists = async (patientId) => {
  const patient = await Patient.findById(patientId);

  if (!patient) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }

  return patient;
};

const ensureDoctorExists = async (doctorId) => {
  const doctor = await User.findById(doctorId);

  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  if (doctor.role !== "doctor") {
    const error = new Error("Selected user is not a doctor");
    error.statusCode = 400;
    throw error;
  }

  return doctor;
};

const createVisit = async (payload, userId) => {
  await ensurePatientExists(payload.patient);
  await ensureDoctorExists(payload.doctor);

  if ((payload.amountPaid || 0) > payload.totalAmount) {
    const error = new Error("Amount paid cannot be greater than total amount");
    error.statusCode = 400;
    throw error;
  }

  const visit = await Visit.create({
    ...payload,
    registeredBy: userId
  });

  return await Visit.findById(visit._id)
    .populate("patient", "fullName phone gender")
    .populate("doctor", "name email role")
    .populate("registeredBy", "name email role");
};

const getVisits = async ({
  page = 1,
  limit = 10,
  patient,
  doctor,
  paymentStatus,
  status
}) => {
  const query = {};

  if (patient) {
    query.patient = patient;
  }

  if (doctor) {
    query.doctor = doctor;
  }

  if (paymentStatus) {
    query.paymentStatus = paymentStatus;
  }

  if (status) {
    query.status = status;
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [visits, total] = await Promise.all([
    Visit.find(query)
      .populate("patient", "fullName phone gender")
      .populate("doctor", "name email role")
      .populate("registeredBy", "name email role")
      .sort({ visitDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNumber),
    Visit.countDocuments(query)
  ]);

  return {
    visits,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      pages: Math.ceil(total / limitNumber)
    }
  };
};

const getVisitById = async (visitId) => {
  const visit = await Visit.findById(visitId)
    .populate("patient", "fullName phone gender dateOfBirth address")
    .populate("doctor", "name email role")
    .populate("registeredBy", "name email role");

  if (!visit) {
    const error = new Error("Visit not found");
    error.statusCode = 404;
    throw error;
  }

  return visit;
};

const updateVisit = async (visitId, payload) => {
  const visit = await Visit.findById(visitId);

  if (!visit) {
    const error = new Error("Visit not found");
    error.statusCode = 404;
    throw error;
  }

  if (payload.patient) {
    await ensurePatientExists(payload.patient);
  }

  if (payload.doctor) {
    await ensureDoctorExists(payload.doctor);
  }

  const nextTotalAmount =
    payload.totalAmount !== undefined ? payload.totalAmount : visit.totalAmount;

  const nextAmountPaid =
    payload.amountPaid !== undefined ? payload.amountPaid : visit.amountPaid;

  if (nextAmountPaid > nextTotalAmount) {
    const error = new Error("Amount paid cannot be greater than total amount");
    error.statusCode = 400;
    throw error;
  }

  Object.assign(visit, payload);

  await visit.save();

  return await Visit.findById(visit._id)
    .populate("patient", "fullName phone gender")
    .populate("doctor", "name email role")
    .populate("registeredBy", "name email role");
};

const deleteVisit = async (visitId) => {
  const visit = await Visit.findById(visitId);

  if (!visit) {
    const error = new Error("Visit not found");
    error.statusCode = 404;
    throw error;
  }

  await visit.deleteOne();

  return { message: "Visit deleted successfully" };
};

export {
  createVisit,
  getVisits,
  getVisitById,
  updateVisit,
  deleteVisit
};
