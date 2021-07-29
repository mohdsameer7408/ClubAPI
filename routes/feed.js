import { Router } from "express";

import verifyToken from "../config/verifyToken.js";
import Feed from "../models/Feed.js";

const router = Router();

router.get("/feeds", async (req, res) => {
  try {
    const feeds = await Feed.find({ clubId: req.query.clubId }).populate(
      "userId",
      "-password -__v -createdAt -updatedAt"
    );
    res.status(200).json(feeds);
  } catch (error) {
    res.status(501).json(`Something went wrong an error occured ${error}`);
  }
});

router.post("/feed/create", verifyToken, async (req, res) => {
  try {
    const feed = new Feed({ ...req.body, userId: req.user._id });
    const createdFeed = await feed.save();
    res.status(201).json(createdFeed);
  } catch (error) {
    res.status(501).json(`Something went wrong an error occured ${error}`);
  }
});

router.patch("/feed/update/:feedId", verifyToken, async (req, res) => {
  const { feedId } = req.params;

  try {
    if (req.user.userType !== "admin")
      return res.status(401).json("Only Admins are allowed!");
    const feed = await Feed.findOneAndUpdate({ _id: feedId }, req.body, {
      new: true,
      useFindAndModify: false,
    });
    res.status(200).json(feed);
  } catch (error) {
    res.status(500).json(`Something went wrong an error occured ${error}`);
  }
});

router.delete("/feed/delete/:feedId", verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== "admin")
      return res.status(401).json("Only admins are allowed!");
    const deletedFeed = await Feed.findOneAndDelete({ _id: req.params.feedId });
    res.status(200).json(deletedFeed);
  } catch (error) {
    res.status(501).json(`Something went wrong an error occured ${error}`);
  }
});

export default router;
