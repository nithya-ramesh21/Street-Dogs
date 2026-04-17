import FeedingPoint from "../models/FeedingPoint.js";

export const getFeedingPoints = async (req, res, next) => {
  try {
    const points = await FeedingPoint.find().sort({ createdAt: -1 });
    res.json(points);
  } catch (error) {
    next(error);
  }
};

export const createFeedingPoint = async (req, res, next) => {
  try {
    const { name, lat, lng, address, notes, nextFeedingAt } = req.body;

    if (!name || lat === undefined || lng === undefined || !address) {
      res.status(400);
      throw new Error("name, lat, lng and address are required");
    }

    const feedingPoint = await FeedingPoint.create({
      name,
      location: { lat: Number(lat), lng: Number(lng), address },
      notes: notes || "",
      nextFeedingAt: nextFeedingAt || null,
    });

    res.status(201).json(feedingPoint);
  } catch (error) {
    next(error);
  }
};

export const updateFeedingPoint = async (req, res, next) => {
  try {
    const feedingPoint = await FeedingPoint.findById(req.params.id);

    if (!feedingPoint) {
      res.status(404);
      throw new Error("Feeding point not found");
    }

    const { name, notes, lastFedAt, nextFeedingAt } = req.body;

    if (name !== undefined) feedingPoint.name = name;
    if (notes !== undefined) feedingPoint.notes = notes;
    if (lastFedAt !== undefined) feedingPoint.lastFedAt = lastFedAt;
    if (nextFeedingAt !== undefined) feedingPoint.nextFeedingAt = nextFeedingAt;

    const updated = await feedingPoint.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};
