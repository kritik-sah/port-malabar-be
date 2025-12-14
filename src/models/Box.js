import { Schema, model } from "mongoose";

const BoxSchema = new Schema(
  {
    boxNo: { type: Number, unique: true, index: true },
    version: { type: String, required: true },
    imageUrl: { type: String, required: true },

    secretHash: { type: String, required: true },

    claimed: { type: Boolean, default: false },
    failedAttempts: { type: Number, default: 0 },

    claimedAt: { type: Date },
  },
  { timestamps: true }
);

export const Box = model("Box", BoxSchema);
