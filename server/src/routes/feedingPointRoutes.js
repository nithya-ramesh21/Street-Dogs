import express from "express";
import {
  createFeedingPoint,
  getFeedingPoints,
  updateFeedingPoint,
} from "../controllers/feedingPointController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getFeedingPoints).post(protect, authorize("admin", "volunteer"), createFeedingPoint);
router.route("/:id").patch(protect, authorize("admin", "volunteer"), updateFeedingPoint);

export default router;
