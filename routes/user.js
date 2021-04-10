import { Router } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import generateToken from "../config/generateToken.js";
import verifyToken from "../config/verifyToken.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const doesUserExists = await User.findOne({ email });

    // email validation
    if (doesUserExists)
      return res
        .status(400)
        .json("An user with this email already exists try signing in!");

    const hashedPassword = await generateHashedPassword(password);
    const user = new User({
      ...req.body,
      userType: "user",
      password: hashedPassword,
    });

    const createdUser = await user.save();
    const token = generateToken(createdUser);
    res.status(201).header("auth-token", token).json({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      course: createdUser.course,
      year: createdUser.year,
      phone: createdUser.phone,
      whatsappPhone: createdUser.whatsappPhone,
      clubs: createdUser.clubs,
      token,
    });
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const doesUserExists = await User.findOne({ email });

    if (!doesUserExists)
      return res
        .status(400)
        .json("No user exists with this email!, Try creating an account.");

    const isPasswordValid = await bcrypt.compare(
      password,
      doesUserExists.password
    );

    if (!isPasswordValid) return res.status(400).json("Invalid Password!");

    const token = generateToken(doesUserExists);
    res.status(200).header("auth-token", token).json({
      _id: doesUserExists._id,
      name: doesUserExists.name,
      email: doesUserExists.email,
      course: doesUserExists.course,
      year: doesUserExists.year,
      phone: doesUserExists.phone,
      whatsappPhone: doesUserExists.whatsappPhone,
      clubs: doesUserExists.clubs,
      token,
    });
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.patch("/profile/update", verifyToken, async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      req.body,
      { new: true, useFindAndModify: false }
    );
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      course: updatedUser.course,
      year: updatedUser.year,
      phone: updatedUser.phone,
      whatsappPhone: updatedUser.whatsappPhone,
      clubs: updatedUser.clubs,
      token: req.header("auth-token"),
    });
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.patch("/password/update", verifyToken, async (req, res) => {
  const { currentPassword, password } = req.body;
  try {
    const user = await User.findById(req.user._id);
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid)
      return res.status(400).json("Your current password dosent match!");

    const hashedPassword = await generateHashedPassword(password);
    user.password = hashedPassword;
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      course: updatedUser.course,
      year: updatedUser.year,
      phone: updatedUser.phone,
      whatsappPhone: updatedUser.whatsappPhone,
      clubs: updatedUser.clubs,
      token: req.header("auth-token"),
    });
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

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
