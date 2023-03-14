import mongoose from "mongoose";

export default mongoose.model(
  "Chat",
  new mongoose.Schema(
    {
      reqMess: { type: "Array", required: "name is required" },
      resMess: { type: "String", required: "description is required" },
      ip: { type: "String", required: "ip is required" },
    },
    { timestamps: true }
  )
);
