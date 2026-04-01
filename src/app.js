import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes.js";
import patientRoutes from "./modules/patients/patient.routes.js";
import visitRoutes from "./modules/visits/visit.routes.js";
import expenseRoutes from "./modules/expenses/expense.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

import notFoundMiddleware from "./middlewares/notFoundMiddleware.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Clinic backend API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);


app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
