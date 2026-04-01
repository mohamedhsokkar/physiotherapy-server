import {
  getOverview,
  getFinanceSummary,
  getVisitSummary,
  getRecentActivity
} from "./dashboard.service.js";

const overview = async (req, res, next) => {
  try {
    const data = await getOverview();

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

const financeSummary = async (req, res, next) => {
  try {
    const data = await getFinanceSummary();

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

const visitSummary = async (req, res, next) => {
  try {
    const data = await getVisitSummary();

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

const recentActivity = async (req, res, next) => {
  try {
    const data = await getRecentActivity();

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export {
  overview,
  financeSummary,
  visitSummary,
  recentActivity
};