import mongoose from "mongoose";

import Patient from "../models/Patient.js";
import Visit from "../models/Visit.js";

const INACTIVE_AFTER_MONTHS = 6;

const getInactiveCutoffDate = () => {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - INACTIVE_AFTER_MONTHS);

  return cutoff;
};

const toObjectIds = (patientIds = []) =>
  patientIds
    .filter(Boolean)
    .map((patientId) => new mongoose.Types.ObjectId(String(patientId)));

const refreshPatientStatuses = async (patientIds = []) => {
  const objectIds = toObjectIds(patientIds);
  const visitMatchStage = objectIds.length
    ? {
        $match: {
          patient: { $in: objectIds }
        }
      }
    : null;

  const latestVisits = await Visit.aggregate([
    ...(visitMatchStage ? [visitMatchStage] : []),
    {
      $sort: {
        visitDate: -1,
        createdAt: -1
      }
    },
    {
      $group: {
        _id: "$patient",
        lastVisitDate: { $first: "$visitDate" }
      }
    }
  ]);

  if (!latestVisits.length) {
    return;
  }

  const inactiveCutoffDate = getInactiveCutoffDate();
  const statusByPatientId = new Map(
    latestVisits.map(({ _id, lastVisitDate }) => [
      String(_id),
      lastVisitDate < inactiveCutoffDate ? "inactive" : "active"
    ])
  );

  const patients = await Patient.find({
    _id: { $in: [...statusByPatientId.keys()] }
  }).select("_id status");

  const updates = patients
    .filter((patient) => patient.status !== statusByPatientId.get(String(patient._id)))
    .map((patient) => ({
      updateOne: {
        filter: { _id: patient._id },
        update: { status: statusByPatientId.get(String(patient._id)) }
      }
    }));

  if (updates.length) {
    await Patient.bulkWrite(updates);
  }
};

const refreshPatientStatus = async (patientId) => {
  if (!patientId) {
    return;
  }

  await refreshPatientStatuses([patientId]);
};

export { refreshPatientStatus, refreshPatientStatuses };
