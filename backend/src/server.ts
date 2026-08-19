import "dotenv/config";
import express from "express";
import cors from "cors";

import { prisma } from "./config/db";

import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/job.routes";
import applicationRoutes from "./routes/application.routes";
import candidateRoutes from "./routes/candidate.routes";

import {
  authenticate,
  AuthRequest,
} from "./middleware/auth.middleware";

import { authorize } from "./middleware/role.middleware";

const app = express();

// ======================================================
// PORT
// ======================================================

const PORT = Number(process.env.PORT) || 5000;

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "https://devhire-frontend-vrsf.onrender.com"
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// ======================================================
// ROOT
// ======================================================

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to DevHire API",
    version: "1.0.0",
  });
});

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "DevHire API is running",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      database: "disconnected",
    });
  }
});

// ======================================================
// AUTH
// ======================================================

app.use("/api/auth", authRoutes);

// ======================================================
// JOBS
// ======================================================

app.use("/api/jobs", jobRoutes);

// ======================================================
// APPLICATIONS
// ======================================================

app.use("/api/applications", applicationRoutes);

// ======================================================
// CANDIDATES
// ======================================================

app.use("/api/candidates", candidateRoutes);

// ======================================================
// PROTECTED TEST ROUTE
// ======================================================

app.get(
  "/api/protected",
  authenticate,
  (req: AuthRequest, res) => {
    res.status(200).json({
      success: true,
      message: "You accessed a protected route",
      user: req.user,
    });
  },
);

// ======================================================
// RECRUITER TEST ROUTE
// ======================================================

app.get(
  "/api/recruiter-only",
  authenticate,
  authorize("RECRUITER"),
  (req: AuthRequest, res) => {
    res.status(200).json({
      success: true,
      message: "Recruiter authorization successful",
      user: req.user,
    });
  },
);

// ======================================================
// CANDIDATE TEST ROUTE
// ======================================================

app.get(
  "/api/candidate-only",
  authenticate,
  authorize("CANDIDATE"),
  (req: AuthRequest, res) => {
    res.status(200).json({
      success: true,
      message: "Candidate authorization successful",
      user: req.user,
    });
  },
);

// ======================================================
// 404 HANDLER
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use(
  (
    error: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled server error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  },
);

// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 DevHire API running on http://localhost:${PORT}`,
  );
});