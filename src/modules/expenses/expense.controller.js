import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
} from "./expense.service.js";

const create = async (req, res, next) => {
  try {
    const expense = await createExpense(req.body, req.user.userId);

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await getExpenses(req.query);

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
    const expense = await getExpenseById(req.params.id);

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const expense = await updateExpense(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await deleteExpense(req.params.id);

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