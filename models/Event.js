import mongoose from "mongoose";

const schemaOptions = {
  type: String,
  required: true,
};

const eventSchema = new mongoose.Schema({
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
  title: schemaOptions,
  description: schemaOptions,
  imageUrl: schemaOptions,
  meetUrl: schemaOptions,
  dateTime: { ...schemaOptions, type: Date, default: Date.now() },
});

export default mongoose.model("Event", eventSchema);
