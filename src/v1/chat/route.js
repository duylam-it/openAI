import express from "express";
import { catchErrors } from "../handlers/errorHandlers.js";
import passport from "../middlewares/passport.js";
import { chat, getToken } from "./controller.js";
const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  catchErrors(chat)
);
router.post("/getToken", catchErrors(getToken));

export default router;
