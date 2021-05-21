import mongoose from "mongoose";

const schemaOptions = {
  type: String,
  required: true,
};

const feedSchema = new mongoose.Schema(
  {
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
    text: schemaOptions,
    imageUrl: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Feed", feedSchema);
