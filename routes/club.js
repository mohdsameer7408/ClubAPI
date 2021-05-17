import { Router } from "express";

import Club from "../models/Club.js";
import verifyToken from "../config/verifyToken.js";

const router = Router();

router.get("/clubs", async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json(clubs);
  } catch (error) {
    res.status(200).json(`Something went wrong an error occured ${error}`);
  }
});

router.post("/club/create", verifyToken, async (req, res) => {
  try {
    const doesClubExists = await Club.findOne({ name: req.body.name });
    if (doesClubExists)
      return res
        .status(400)
        .json(
          "A club with this name already exists try with a different name!"
        );

    const club = new Club(req.body);
    const createdClub = await club.save();
    res.status(201).json(createdClub);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

export default router;
