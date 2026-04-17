import express from "express";
import {
  createAlert,
  getAlerts,
  updateAlertStatus,
} from "../controllers/alertController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/").get(getAlerts).post(protect, authorize("admin", "volunteer"), upload.single("image"), createAlert);
router.route("/:id/status").patch(protect, authorize("admin", "volunteer"), updateAlertStatus);

export default router;
