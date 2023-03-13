import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import log from "morgan";
import cron from "node-cron";
import db from "./src/v1/config/db.js";
import routes from "./src/v1/routes.js";

const app = express();
const version = process.env.VERSION;
dotenv.config();

// Static Files
// app.use(express.static());

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Logger
app.use(log("dev"));

// Setup Cookie Parser
app.use(cookieParser());

// Setup Cross Origin
app.use(
  cors({
    origin: "*",
  })
);

// Bring in the routes
routes(app);

// DB Connect
db.connect();

// Cron
cron.schedule(
  "0 6 * * *",
  () => {
    console.log("Schedule started");
    console.log("Schedule stopped");
  },
  { scheduled: true, timezone: "Asia/Ho_Chi_Minh" }
);

const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => console.log("Connected to port " + PORT));
