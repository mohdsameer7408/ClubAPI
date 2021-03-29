import { Router } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import generateToken from "../config/generateToken.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const doesUserExists = await User.findOne({ email });

    // email validation
    if (!doesUserExists)
      return res
        .status(400)
        .json(
          "An user with this email already exists try using a different one!"
        );

    const hashedPassword = await generateHashedPassword(password);
    const user = new User({
      ...req.body,
      userType: "user",
      password: hashedPassword,
    });

    const createdUser = await user.save();
    res.status(201).json({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      course: createdUser.course,
      year: createdUser.year,
      phone: createdUser.phone,
      whatsappPhone: createdUser.whatsappPhone,
      clubs: createdUser.clubs,
      token: generateToken(createdUser),
    });
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.post("/login", async (req, res) => {});

const generateHashedPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Hashing error: ${error}`);
  }
};

export default router;
