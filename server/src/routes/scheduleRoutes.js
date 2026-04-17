import express from "express";
import {
  createSchedule,
  getSchedules,
  updateScheduleStatus,
} from "../controllers/scheduleController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getSchedules).post(protect, authorize("admin", "volunteer"), createSchedule);
router.route("/:id/status").patch(protect, authorize("admin", "volunteer"), updateScheduleStatus);

export default router;
