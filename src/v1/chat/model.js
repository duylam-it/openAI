import mongoose from "mongoose";

export default mongoose.model(
  "Chat",
  new mongoose.Schema(
    {
      ip: { type: "String", required: "ip is required" },
      token: { type: "String", required: "token is required" },
      userMess: { type: "String", required: "messReq is required" },
      aiMess: { type: "String", required: "messRes is required" },
    },
    { timestamps: true }
  )
);
