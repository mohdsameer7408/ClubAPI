import { Router } from "express";

import Event from "../models/Event.js";
import verifyToken from "../config/verifyToken.js";

const router = Router();

router.get("/events", async (req, res) => {
  try {
    const events = await Event.find().populate(
      "clubId participants",
      "-password -__v -createdAt -updatedAt"
    );
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json(`Something went wrong an error occured ${error}`);
  }
});

router.post("/event/create", verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== "admin")
      return res.status(401).json("Only Admins are allowed!");
    const event = new Event(req.body);
    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.patch("/event/update/:eventId", verifyToken, async (req, res) => {
  const { eventId } = req.params;

  try {
    if (req.user.userType !== "admin")
      return res.status(401).json("Only Admins are allowed!");
    const event = await Event.findOneAndUpdate({ _id: eventId }, req.body, {
      new: true,
      useFindAndModify: false,
    });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.delete("/event/delete/:eventId", verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== "admin")
      return res.status(401).json("Only Admins are allowed!");
    const deletedEvent = await Event.findOneAndDelete({
      _id: req.params.eventId,
    });
    res.status(200).json(deletedEvent);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.patch(
  "/event/addParticipant/:eventId",
  verifyToken,
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.eventId);
      event.participants = [...event.participants, req.user._id];
      const updatedEvent = await event.save();
      res.status(200).json(updatedEvent);
    } catch (error) {
      res
        .status(500)
        .json(`Something went wrong and an error occured: ${error}`);
    }
  }
);

export default router;
