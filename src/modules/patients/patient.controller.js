import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient
} from "./patient.service.js";

const create = async (req, res, next) => {
  try {
    const patient = await createPatient(req.body, req.user.userId);

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: patient
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await getPatients(req.query);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const patient = await getPatientById(req.params.id);

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const patient = await updatePatient(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: patient
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await deletePatient(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export {
  create,
  getAll,
  getOne,
  update,
  remove
};
