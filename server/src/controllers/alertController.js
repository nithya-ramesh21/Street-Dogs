import Alert from "../models/Alert.js";
import { sendNotification } from "../services/notificationService.js";

export const getAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find()
      .populate("feedingPoint", "name location.address")
      .sort({ createdAt: -1 });

    res.json(alerts);
  } catch (error) {
    next(error);
  }
};

export const createAlert = async (req, res, next) => {
  try {
    const { type, severity, feedingPoint, description } = req.body;

    if (!type || !description) {
      res.status(400);
      throw new Error("type and description are required");
    }

    const imageUrl = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : "";

    const alert = await Alert.create({
      type,
      severity,
      feedingPoint: feedingPoint || null,
      description,
      imageUrl,
    });

    if (severity === "critical") {
      await sendNotification({
        subject: `Critical ${type} alert raised`,
        text: `Description: ${description}`,
      });
    }

    const populated = await alert.populate("feedingPoint", "name location.address");
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

export const updateAlertStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["open", "in-progress", "resolved"].includes(status)) {
      res.status(400);
      throw new Error("Invalid status");
    }

    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      res.status(404);
      throw new Error("Alert not found");
    }

    alert.status = status;
    const updated = await alert.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};
