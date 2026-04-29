import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  channelId: { type: String, required: true, index: true },
  method: { type: String, required: true },
  headers: { type: mongoose.Schema.Types.Mixed, default: {} },
  body: { type: mongoose.Schema.Types.Mixed, default: null },
  rawBody: { type: String, default: "" },
  query: { type: mongoose.Schema.Types.Mixed, default: {} },
  sourceIp: { type: String, default: "" },
  receivedAt: { type: Date, default: Date.now, index: true },
});

export const Request = mongoose.model("Request", requestSchema);