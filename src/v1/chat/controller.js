import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/variable.js";
import { callAI } from "../services/openai.js";
import Chat from "./model.js";

// ==> CHAT <==
export async function chat(req, res) {
  const { questions } = req.body;

  const message = await callAI(questions);

  await new Chat({
    ip: req.ip,
    token: req.get("Authorization"),
    userMess: questions[questions.length - 1].content,
    aiMess: message,
  }).save();

  res.json({
    success: true,
    data: {
      message,
    },
  });
}

export async function getToken(req, res) {
  const { pass } = req.body;
  if (pass !== "admin") throw new Error("Unauthorized");

  res.json({
    success: true,
    data: {
      token: encodedToken("GDVN", ACCESS_TOKEN_SECRET),
    },
  });
}

const encodedToken = (sub, secret) => {
  return jwt.sign(
    {
      iss: "Duy Lam",
      iat: new Date().getTime(),
      sub,
    },
    secret
  );
};
