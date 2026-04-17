import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    feedingPoint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeedingPoint",
      required: true,
    },
    feedingDate: {
      type: Date,
      required: true,
    },
    mealType: {
      type: String,
      enum: ["Dry Food", "Wet Food", "Mixed", "Water"],
      default: "Mixed",
    },
    status: {
      type: String,
      enum: ["planned", "completed", "missed"],
      default: "planned",
    },
    assignedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Schedule", scheduleSchema);
