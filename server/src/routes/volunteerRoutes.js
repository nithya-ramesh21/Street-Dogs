import express from "express";
import {
  createVolunteer,
  getVolunteers,
  toggleVolunteerStatus,
} from "../controllers/volunteerController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getVolunteers).post(protect, authorize("admin"), createVolunteer);
router.route("/:id/toggle").patch(protect, authorize("admin"), toggleVolunteerStatus);

export default router;
