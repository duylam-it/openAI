import mongoose from "mongoose";

export default mongoose.model(
  "Chat",
  new mongoose.Schema(
    {
      messReq: { type: [Object], required: "messReq is required" },
      messRes: { type: "String", required: "messRes is required" },
      ip: { type: "String", required: "ip is required" },
    },
    { timestamps: true }
  )
);
