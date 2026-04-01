import {
  createVisit,
  getVisits,
  getVisitById,
  updateVisit,
  deleteVisit
} from "./visit.service.js";

const create = async (req, res, next) => {
  try {
    const visit = await createVisit(req.body, req.user.userId);

    res.status(201).json({
      success: true,
      message: "Visit created successfully",
      data: visit
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await getVisits(req.query);

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
    const visit = await getVisitById(req.params.id);

    res.status(200).json({
      success: true,
      data: visit
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const visit = await updateVisit(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Visit updated successfully",
      data: visit
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await deleteVisit(req.params.id);

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