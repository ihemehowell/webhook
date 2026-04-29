import { Router } from "express";
import { Request } from "../models/Request.js";
import { Channel } from "../models/Channel.js";
import { broadcast, addClient, removeClient } from "../lib/sse.js";
import fetch from "node-fetch";

const router = Router();

// Capture any HTTP method on /:channelId
router.all("/:channelId", async (req, res) => {
  const { channelId } = req.params;

  const channel = await Channel.findOne({ channelId });
  if (!channel) return res.status(404).json({ error: "Channel not found" });

  const doc = await Request.create({
    channelId,
    method: req.method,
    headers: req.headers,
    body: req.body,
    rawBody: req.rawBody,
    query: req.query,
    sourceIp: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
  });

  // Push to any connected SSE clients
  broadcast(channelId, { type: "request", data: doc });

  res.status(200).json({ received: true, id: doc._id });
});

// SSE stream for a channel
router.get("/:channelId/stream", async (req, res) => {
  const { channelId } = req.params;

  const channel = await Channel.findOne({ channelId });
  if (!channel) return res.status(404).json({ error: "Channel not found" });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Send a heartbeat every 30s to keep connection alive
  const heartbeat = setInterval(() => res.write(": ping\n\n"), 30000);

  addClient(channelId, res);

  req.on("close", () => {
    clearInterval(heartbeat);
    removeClient(channelId, res);
  });
});

// Replay a request to a target URL
router.post("/:channelId/replay/:requestId", async (req, res) => {
  const { requestId } = req.params;
  const { targetUrl } = req.body;

  if (!targetUrl) return res.status(400).json({ error: "targetUrl required" });

  const request = await Request.findById(requestId);
  if (!request) return res.status(404).json({ error: "Request not found" });

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Replay": "true",
      },
      body: ["GET", "HEAD"].includes(request.method)
        ? undefined
        : request.rawBody,
    });

    res.json({
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;