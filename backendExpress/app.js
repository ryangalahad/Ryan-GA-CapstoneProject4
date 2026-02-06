import express from "express";
import usersRouter from "./routes/users.js";
import casesRouter from "./routes/cases.js";
import nameEntitiesRouter from "./routes/nameEntities.js";

const app = express();

// CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", usersRouter);
app.use("/api/cases", casesRouter);
app.use("/api/name-entities", nameEntitiesRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

export default app;
