import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  channelId: { type: String, required: true, index: true },
  method: { type: String, required: true },
  headers: { type: Object, default: {} },
  body: { type: mongoose.Schema.Types.Mixed, default: null },
  rawBody: { type: String, default: "" },
  query: { type: Object, default: {} },
  sourceIp: { type: String, default: "" },
  receivedAt: { type: Date, default: Date.now, index: true },
});

// Auto-delete requests after 48 hours
requestSchema.index({ receivedAt: 1 }, { expireAfterSeconds: 172800 });

export const Request = mongoose.model("Request", requestSchema);