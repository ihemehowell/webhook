import { Router } from "express";
import { nanoid } from "nanoid";
import { Channel } from "../models/Channel.js";
import { Request } from "../models/Request.js";

const router = Router();

// Create a new channel
router.post("/", async (req, res) => {
  const channelId = nanoid(10);
  const { label } = req.body || {};

  const channel = await Channel.create({ channelId, label });
  res.status(201).json(channel);
});

// Get channel info
router.get("/:channelId", async (req, res) => {
  const channel = await Channel.findOne({ channelId: req.params.channelId });
  if (!channel) return res.status(404).json({ error: "Not found" });
  res.json(channel);
});

// List requests for a channel
router.get("/:channelId/requests", async (req, res) => {
  const requests = await Request.find({ channelId: req.params.channelId })
    .sort({ receivedAt: -1 })
    .limit(100);
  res.json(requests);
});

// Delete a single request
router.delete("/:channelId/requests/:requestId", async (req, res) => {
  await Request.findByIdAndDelete(req.params.requestId);
  res.json({ ok: true });
});

// Clear all requests for a channel
router.delete("/:channelId/requests", async (req, res) => {
  await Request.deleteMany({ channelId: req.params.channelId });
  res.json({ ok: true });
});

export default router;