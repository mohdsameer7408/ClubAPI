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
      { userName: schemaOptions, title: schemaOptions, image: schemaOptions },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Club", clubSchema);
