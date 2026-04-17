import Volunteer from "../models/Volunteer.js";

export const getVolunteers = async (req, res, next) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    next(error);
  }
};

export const createVolunteer = async (req, res, next) => {
  try {
    const { name, phone, area, availability } = req.body;

    if (!name || !phone || !area) {
      res.status(400);
      throw new Error("name, phone and area are required");
    }

    const volunteer = await Volunteer.create({
      name,
      phone,
      area,
      availability: Array.isArray(availability) ? availability : [],
    });

    res.status(201).json(volunteer);
  } catch (error) {
    next(error);
  }
};

export const toggleVolunteerStatus = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      res.status(404);
      throw new Error("Volunteer not found");
    }

    volunteer.active = !volunteer.active;
    const updated = await volunteer.save();

    res.json(updated);
  } catch (error) {
    next(error);
  }
};
