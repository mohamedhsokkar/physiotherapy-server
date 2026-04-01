import Patient from "../../models/Patient.js";
import Visit from "../../models/Visit.js";
import Expense from "../../models/Expense.js";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const getDateRanges = () => {
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  return {
    now,
    startOfToday,
    endOfToday,
    startOfMonth,
    endOfMonth
  };
};

const buildRecentDays = (days) => {
  const today = new Date();
  const start = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - (days - 1)
  );

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(start.getTime() + index * DAY_IN_MS);

    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      shortDate: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      }),
      start: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    };
  });
};

const getGroupedTotals = async (Model, dateField, valueField, days) => {
  const rangeStart = days[0].start;
  const rangeEnd = days[days.length - 1].end;

  const results = await Model.aggregate([
    {
      $match: {
        [dateField]: { $gte: rangeStart, $lt: rangeEnd }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: `$${dateField}`
          }
        },
        total: { $sum: `$${valueField}` }
      }
    }
  ]);

  return new Map(results.map((entry) => [entry._id, entry.total]));
};

const getGroupedCounts = async (Model, dateField, days) => {
  const rangeStart = days[0].start;
  const rangeEnd = days[days.length - 1].end;

  const results = await Model.aggregate([
    {
      $match: {
        [dateField]: { $gte: rangeStart, $lt: rangeEnd }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: `$${dateField}`
          }
        },
        total: { $sum: 1 }
      }
    }
  ]);

  return new Map(
    results.map((entry) => [entry._id, Number(entry.total)])
  );
};

const getTodaySchedule = async (startOfToday, endOfToday) => {
  const visits = await Visit.find({
    visitDate: { $gte: startOfToday, $lt: endOfToday }
  })
    .sort({ visitDate: 1 })
    .limit(6)
    .populate("patient", "fullName phone")
    .populate("doctor", "name")
    .select("visitDate visitType status paymentStatus patient doctor");

  return visits;
};

const getOverview = async () => {
  const {
    startOfToday,
    endOfToday,
    startOfMonth,
    endOfMonth
  } = getDateRanges();

  const [
    totalPatients,
    activePatients,
    totalVisits,
    todayVisits,
    monthlyVisits,
    monthlyPaidIncomeAgg,
    monthlyExpensesAgg
  ] = await Promise.all([
    Patient.countDocuments(),
    Patient.countDocuments({ status: "active" }),
    Visit.countDocuments(),
    Visit.countDocuments({
      visitDate: { $gte: startOfToday, $lt: endOfToday }
    }),
    Visit.countDocuments({
      visitDate: { $gte: startOfMonth, $lt: endOfMonth }
    }),
    Visit.aggregate([
      {
        $match: {
          visitDate: { $gte: startOfMonth, $lt: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amountPaid" }
        }
      }
    ]),
    Expense.aggregate([
      {
        $match: {
          expenseDate: { $gte: startOfMonth, $lt: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ])
  ]);

  const monthlyIncome = monthlyPaidIncomeAgg[0]?.total || 0;
  const monthlyExpenses = monthlyExpensesAgg[0]?.total || 0;
  const recentDays = buildRecentDays(7);

  const [visitCountsByDay, patientCountsByDay, incomeByDay, expenseByDay, todaySchedule] =
    await Promise.all([
      getGroupedCounts(Visit, "visitDate", recentDays),
      getGroupedCounts(Patient, "createdAt", recentDays),
      getGroupedTotals(Visit, "visitDate", "amountPaid", recentDays),
      getGroupedTotals(Expense, "expenseDate", "amount", recentDays),
      getTodaySchedule(startOfToday, endOfToday)
    ]);

  const trends = recentDays.map((day) => {
    const income = incomeByDay.get(day.key) || 0;
    const expenses = expenseByDay.get(day.key) || 0;

    return {
      date: day.key,
      label: day.label,
      shortDate: day.shortDate,
      visits: visitCountsByDay.get(day.key) || 0,
      newPatients: patientCountsByDay.get(day.key) || 0,
      income,
      expenses,
      net: income - expenses
    };
  });

  return {
    cards: {
      totalPatients,
      activePatients,
      totalVisits,
      todayVisits,
      monthlyVisits,
      monthlyIncome,
      monthlyExpenses,
      monthlyNet: monthlyIncome - monthlyExpenses
    },
    trends,
    todaySchedule
  };
};

const getFinanceSummary = async () => {
  const {
    startOfToday,
    endOfToday,
    startOfMonth,
    endOfMonth
  } = getDateRanges();

  const [
    todayIncomeAgg,
    monthlyIncomeAgg,
    todayExpensesAgg,
    monthlyExpensesAgg
  ] = await Promise.all([
    Visit.aggregate([
      {
        $match: {
          visitDate: { $gte: startOfToday, $lt: endOfToday }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amountPaid" }
        }
      }
    ]),
    Visit.aggregate([
      {
        $match: {
          visitDate: { $gte: startOfMonth, $lt: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amountPaid" }
        }
      }
    ]),
    Expense.aggregate([
      {
        $match: {
          expenseDate: { $gte: startOfToday, $lt: endOfToday }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]),
    Expense.aggregate([
      {
        $match: {
          expenseDate: { $gte: startOfMonth, $lt: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ])
  ]);

  const todayIncome = todayIncomeAgg[0]?.total || 0;
  const monthlyIncome = monthlyIncomeAgg[0]?.total || 0;
  const todayExpenses = todayExpensesAgg[0]?.total || 0;
  const monthlyExpenses = monthlyExpensesAgg[0]?.total || 0;
  const recentDays = buildRecentDays(7);
  const [incomeByDay, expensesByDay] = await Promise.all([
    getGroupedTotals(Visit, "visitDate", "amountPaid", recentDays),
    getGroupedTotals(Expense, "expenseDate", "amount", recentDays)
  ]);

  const daily = recentDays.map((day) => {
    const income = incomeByDay.get(day.key) || 0;
    const expenses = expensesByDay.get(day.key) || 0;

    return {
      date: day.key,
      label: day.label,
      shortDate: day.shortDate,
      income,
      expenses,
      net: income - expenses
    };
  });

  return {
    today: {
      income: todayIncome,
      expenses: todayExpenses,
      net: todayIncome - todayExpenses
    },
    month: {
      income: monthlyIncome,
      expenses: monthlyExpenses,
      net: monthlyIncome - monthlyExpenses
    },
    daily
  };
};

const getVisitSummary = async () => {
  const { startOfToday, endOfToday, startOfMonth, endOfMonth } = getDateRanges();

  const [
    totalVisits,
    todayVisits,
    monthlyVisits,
    scheduledVisits,
    completedVisits,
    cancelledVisits,
    unpaidVisits,
    partialVisits,
    paidVisits
  ] = await Promise.all([
    Visit.countDocuments(),
    Visit.countDocuments({
      visitDate: { $gte: startOfToday, $lt: endOfToday }
    }),
    Visit.countDocuments({
      visitDate: { $gte: startOfMonth, $lt: endOfMonth }
    }),
    Visit.countDocuments({ status: "scheduled" }),
    Visit.countDocuments({ status: "completed" }),
    Visit.countDocuments({ status: "cancelled" }),
    Visit.countDocuments({ paymentStatus: "unpaid" }),
    Visit.countDocuments({ paymentStatus: "partial" }),
    Visit.countDocuments({ paymentStatus: "paid" })
  ]);

  const recentDays = buildRecentDays(7);
  const visitCountsByDay = await getGroupedCounts(Visit, "visitDate", recentDays);
  const daily = recentDays.map((day) => ({
    date: day.key,
    label: day.label,
    shortDate: day.shortDate,
    visits: visitCountsByDay.get(day.key) || 0
  }));

  return {
    totals: {
      totalVisits,
      todayVisits,
      monthlyVisits
    },
    byStatus: {
      scheduled: scheduledVisits,
      completed: completedVisits,
      cancelled: cancelledVisits
    },
    byPaymentStatus: {
      unpaid: unpaidVisits,
      partial: partialVisits,
      paid: paidVisits
    },
    daily
  };
};

const getRecentActivity = async () => {
  const [recentPatients, recentVisits, recentExpenses] = await Promise.all([
    Patient.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("fullName phone gender status createdAt"),

    Visit.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("patient", "fullName phone")
      .populate("doctor", "name")
      .select(
        "visitDate visitType status totalAmount amountPaid paymentStatus patient doctor createdAt"
      ),

    Expense.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("createdBy", "name role")
      .select("title category amount expenseDate paymentMethod createdBy createdAt")
  ]);

  return {
    recentPatients,
    recentVisits,
    recentExpenses
  };
};

export {
  getOverview,
  getFinanceSummary,
  getVisitSummary,
  getRecentActivity
};
