import express from "express";
import cors from "cors";
import morgan from "morgan";
import feedingPointRoutes from "./routes/feedingPointRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_URL || "*",
    })
  );
  app.use(express.json({ limit: "6mb" }));
  app.use(morgan("dev"));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Street Dogs API running" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/feeding-points", feedingPointRoutes);
  app.use("/api/schedules", scheduleRoutes);
  app.use("/api/alerts", alertRoutes);
  app.use("/api/volunteers", volunteerRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createApp;
