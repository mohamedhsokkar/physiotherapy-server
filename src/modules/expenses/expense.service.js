import Expense from "../../models/Expense.js";

const createExpense = async (payload, userId) => {
  const expense = await Expense.create({
    ...payload,
    createdBy: userId
  });

  return await Expense.findById(expense._id).populate(
    "createdBy",
    "name email role"
  );
};

const getExpenses = async ({
  page = 1,
  limit = 10,
  category,
  paymentMethod
}) => {
  const query = {};

  if (category) {
    query.category = category;
  }

  if (paymentMethod) {
    query.paymentMethod = paymentMethod;
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [expenses, total] = await Promise.all([
    Expense.find(query)
      .populate("createdBy", "name email role")
      .sort({ expenseDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNumber),
    Expense.countDocuments(query)
  ]);

  return {
    expenses,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      pages: Math.ceil(total / limitNumber)
    }
  };
};

const getExpenseById = async (expenseId) => {
  const expense = await Expense.findById(expenseId).populate(
    "createdBy",
    "name email role"
  );

  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  return expense;
};

const updateExpense = async (expenseId, payload) => {
  const expense = await Expense.findById(expenseId);

  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  Object.assign(expense, payload);

  await expense.save();

  return await Expense.findById(expense._id).populate(
    "createdBy",
    "name email role"
  );
};

const deleteExpense = async (expenseId) => {
  const expense = await Expense.findById(expenseId);

  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  await expense.deleteOne();

  return { message: "Expense deleted successfully" };
};

export {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
};