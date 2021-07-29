import { Router } from "express";

import Club from "../models/Club.js";
import verifyToken from "../config/verifyToken.js";

const router = Router();

router.get("/clubs", async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json(`Something went wrong an error occured ${error}`);
  }
});

router.post("/club/create", verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== "admin")
      return res
        .status(400)
        .json("Only admins allowed to perform this action!");

    const doesClubExists = await Club.findOne({ name: req.body.name });
    if (doesClubExists)
      return res
        .status(400)
        .json(
          "A club with this name already exists try with a different name!"
        );

    const isUserAdminOfAClub = await Club.findOne({ admin: req.user._id });
    if (isUserAdminOfAClub)
      return res
        .status(400)
        .json("Your account is already associated to a club");

    const club = new Club({ ...req.body, admin: req.user._id });
    const createdClub = await club.save();
    res.status(201).json(createdClub);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.patch("/club/update/:clubId", verifyToken, async (req, res) => {
  const { clubId } = req.params;
  try {
    if (req.user.userType !== "admin")
      return res
        .status(400)
        .json("Only admins allowed to perform this action!");

    const club = await Club.findOneAndUpdate({ _id: clubId }, req.body, {
      new: true,
      useFindAndModify: false,
    });
    res.status(200).json(club);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.delete("/club/delete/:clubId", verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== "admin")
      return res
        .status(400)
        .json("Only admins allowed to perform this action!");

    const deletedClub = await Club.findOneAndDelete({ _id: req.params.clubId });
    res.status(200).json(deletedClub);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.patch("/club/addMember/:clubId", verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== "admin")
      return res
        .status(400)
        .json("Only admins allowed to perform this action!");

    const club = await Club.findById(req.params.clubId);
    club.members = [...club.members, req.body];
    const updatedClub = await club.save();
    res.status(200).json(updatedClub);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.patch("/club/updateMember/:clubId", verifyToken, async (req, res) => {
  const { memberId, name, title, imageUrl } = req.body;

  try {
    if (req.user.userType !== "admin")
      return res
        .status(400)
        .json("Only admins allowed to perform this action!");

    const club = await Club.findById(req.params.clubId);
    club.members = club.members.map((member) =>
      member._id.toString() === memberId
        ? { _id: memberId, name, title, imageUrl }
        : member
    );
    const updatedClub = await club.save();
    res.status(200).json(updatedClub);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.patch("/club/deleteMember/:clubId", verifyToken, async (req, res) => {
  const { memberId } = req.body;

  try {
    if (req.user.userType !== "admin")
      return res
        .status(400)
        .json("Only admins allowed to perform this action!");

    const club = await Club.findById(req.params.clubId);
    club.members = club.members.filter(
      (member) => member._id.toString() !== memberId
    );
    const updatedClub = await club.save();
    res.status(200).json(updatedClub);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.patch(
  "/club/addToImageGallery/:clubId",
  verifyToken,
  async (req, res) => {
    const { imageUrl } = req.body;

    try {
      if (req.user.userType !== "admin")
        return res
          .status(400)
          .json("Only admins allowed to perform this action!");

      const club = await Club.findById(req.params.clubId);
      club.imagesGallery = [imageUrl, ...club.imagesGallery].slice(0, 9);
      const updatedClub = await club.save();
      res.status(200).json(updatedClub);
    } catch (error) {
      res
        .status(500)
        .json(`Something went wrong and an error occured: ${error}`);
    }
  }
);

export default router;
