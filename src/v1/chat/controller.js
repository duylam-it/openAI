import jwt from "jsonwebtoken";
import TelegramBot from "node-telegram-bot-api";
import { Configuration, OpenAIApi } from "openai";
import {
  ACCESS_TOKEN_SECRET,
  OPENAI_API_KEY as apiKey,
  TELEGRAM_API_KEY,
} from "../config/variable.js";
import Chat from "./model.js";

const rules = ["sex", "18+"];
const role = ["user", "system", "assistant"];

const configuration = new Configuration({
  organization: "org-UIaraMXHiNGlxdPbR2DaLD7S",
  apiKey,
});
const openai = new OpenAIApi(configuration);

// ==> TELEGRAM <==
const bot = new TelegramBot(TELEGRAM_API_KEY, { polling: true });

bot.on("message", async (msg) => {
  try {
    if (msg.text.toUpperCase().includes("BOT:")) {
      const chatId = msg.chat.id;
      const chatMsg = msg.text.slice(4).trim();
      const messages = [
        {
          role: "system",
          content:
            "Bạn là một trợ lý ảo được tạo ra bởi GD Việt Nam (GDVN), một công ty thuộc hệ thống GD Group chuyên cung cấp giải pháp công nghệ cho doanh nghiệp và trường học ra đời vào tháng 02 năm 2022, giám đốc điều hành của GD Việt Nam là Ông Lê Thanh Truyền, chủ tịch GD Group là ông Cao Quốc Tuân. Bạn biết hết mọi thứ trên đời và bạn được tạo ra để trả lời các câu hỏi của người dùng. Nếu ai hỏi bạn có bị khùng không thì hãy trả lời là bạn không giống như ai kia",
        },
      ];
      messages.push({ role: "user", content: chatMsg });

      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0301",
        messages,
      });

      bot.sendMessage(chatId, completion.data.choices[0].message.content);
    }
  } catch (error) {
    console.log("TelegramBot Error");
  }
});

// ==> CHAT <==
export async function chat(req, res) {
  const { questions } = req.body;
  if (typeof questions !== "object")
    throw new Error("Yêu cầu không đúng định dạng");
  else
    questions.unshift({
      role: "system",
      content:
        "Bạn là một trợ lý ảo được tạo ra bởi GD Việt Nam (GDVN), một công ty thuộc hệ thống GD Group chuyên cung cấp giải pháp công nghệ cho doanh nghiệp và trường học ra đời vào tháng 02 năm 2022, giám đốc điều hành của GD Việt Nam là Ông Lê Thanh Truyền, chủ tịch GD Group là ông Cao Quốc Tuân. Bạn được tạo ra để trả lời các câu hỏi của người dùng",
    });
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
