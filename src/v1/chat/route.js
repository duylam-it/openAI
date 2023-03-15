import express from "express";
// import { catchErrors } from "../handlers/errorHandlers.js";
import { chat } from "./controller.js";
const router = express.Router();

router.post("/", chat);

export default router;
