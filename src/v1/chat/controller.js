import jwt from "jsonwebtoken";
import { Configuration, OpenAIApi } from "openai";
import {
  ACCESS_TOKEN_SECRET,
  OPENAI_API_KEY as apiKey,
} from "../config/variable.js";
import Chat from "./model.js";

const rules = ["sex", "18+"];
const role = ["user", "system", "assistant"];

const configuration = new Configuration({
  organization: "org-UIaraMXHiNGlxdPbR2DaLD7S",
  apiKey,
});
const openai = new OpenAIApi(configuration);

// ==> CHAT <==
export async function chat(req, res) {
  const { questions } = req.body;
  if (typeof questions !== "object")
    throw new Error("Yêu cầu không đúng định dạng");

  questions.forEach((question) => {
    if (
      !question.role ||
      question.role === undefined ||
      !question.content ||
      question.content === undefined
    )
      throw new Error("Yêu cầu không đúng định dạng");
    if (!role.includes(question.role))
      throw new Error("Yêu cầu không đúng định dạng");

    question.content.split(" ").forEach((word) => {
      if (rules.includes(word)) throw new Error("Yêu cầu chứa từ ngữ vi phạm");
    });
  });

  if (!configuration.apiKey) throw new Error("Không tìm thấy OpenAI API Key");

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0301",
    messages: questions,
  });

  await new Chat({
    messReq: questions,
    messRes: completion.data.choices[0].message.content,
    ip: req.ip,
  }).save();

  res.json({
    success: true,
    data: {
      message: completion.data.choices[0].message.content,
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
