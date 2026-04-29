import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  channelId: { type: String, required: true, unique: true },
  label: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 1000 * 60 * 60 * 24), // 24hrs default
  },
});

// Auto-delete expired channels
channelSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Channel = mongoose.model("Channel", channelSchema);