import Schedule from "../models/Schedule.js";
import { sendNotification } from "../services/notificationService.js";

export const getSchedules = async (req, res, next) => {
  try {
    const schedules = await Schedule.find()
      .populate("feedingPoint", "name location.address")
      .populate("assignedVolunteer", "name phone")
      .sort({ feedingDate: 1 });

    res.json(schedules);
  } catch (error) {
    next(error);
  }
};

export const createSchedule = async (req, res, next) => {
  try {
    const { feedingPoint, feedingDate, mealType, assignedVolunteer } = req.body;

    if (!feedingPoint || !feedingDate) {
      res.status(400);
      throw new Error("feedingPoint and feedingDate are required");
    }

    const schedule = await Schedule.create({
      feedingPoint,
      feedingDate,
      mealType,
      assignedVolunteer: assignedVolunteer || null,
    });

    const populated = await schedule.populate([
      { path: "feedingPoint", select: "name location.address" },
      { path: "assignedVolunteer", select: "name phone" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

export const updateScheduleStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["planned", "completed", "missed"].includes(status)) {
      res.status(400);
      throw new Error("Invalid status");
    }

    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      res.status(404);
      throw new Error("Schedule not found");
    }

    schedule.status = status;
    const updated = await schedule.save();

    if (status === "missed") {
      await sendNotification({
        subject: "Missed feeding schedule",
        text: `Schedule ${updated._id} has been marked as missed.`,
      });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};
