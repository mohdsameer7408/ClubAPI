import mongoose from "mongoose";

const schemaOptions = {
  type: String,
  required: true,
};

const clubSchema = new mongoose.Schema(
  {
    name: { ...schemaOptions, unique: true },
    banner: schemaOptions,
    icon: schemaOptions,
    description: schemaOptions,
    imagesGallery: [schemaOptions],
    socialLinks: {
      faceBook: schemaOptions,
      instagram: schemaOptions,
      gmail: schemaOptions,
    },
    members: [
      { name: schemaOptions, title: schemaOptions, imageUrl: schemaOptions },
    ],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Club", clubSchema);
