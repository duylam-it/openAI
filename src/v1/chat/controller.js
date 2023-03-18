import jwt from "jsonwebtoken";
import { Configuration, OpenAIApi } from "openai";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import {
  ACCESS_TOKEN_SECRET,
  FIRST_CONTENT,
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
const bot = new Telegraf(TELEGRAM_API_KEY);
const temp = [];

bot.start((ctx) =>
  ctx.reply("Chào bạn, tôi là trợ lý ảo của GD Việt Nam. Bạn cần giúp gì ạ?")
);

bot.help((ctx) =>
  ctx.reply("Chào bạn, tôi là trợ lý ảo của GD Việt Nam. Bạn cần giúp gì ạ?")
);

bot.command("test", (ctx) => {
  ctx.reply("Tao vẫn ở đây chờ m hỏi");
});

bot.command("ai", async (ctx) => {
  temp.push({
    role: "user",
    content: ctx.update.message.text.slice(4).trim(),
  });
  const message = await callAI(temp);
  temp.push({
    role: "assistant",
    content: message,
  });

  ctx.reply(message);
});

bot.on(message("sticker"), (ctx) =>
  ctx.sendSticker(
    "CAACAgIAAxkBAAM8ZBUd9qEcTNjmMtu2zDqZlUPc5rIAAlQAA0G1Vgxqt_jHCI0B-i8E"
  )
);

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

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

const callAI = async (messages) => {
  try {
    if (!configuration.apiKey) throw new Error("Không tìm thấy OpenAI API Key");

    if (typeof messages !== "object")
      throw new Error("Yêu cầu không đúng định dạng");
    messages.forEach((message) => {
      if (
        !message.role ||
        message.role === undefined ||
        !message.content ||
        message.content === undefined
      )
        throw new Error("Yêu cầu không đúng định dạng");
      if (!role.includes(message.role))
        throw new Error("Yêu cầu không đúng định dạng");

      message.content.split(" ").forEach((word) => {
        if (rules.includes(word))
          throw new Error("Yêu cầu chứa từ ngữ vi phạm");
      });
    });

    messages.unshift({
      role: "system",
      content: FIRST_CONTENT,
    });

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0301",
      messages,
    });
    return completion.data.choices[0].message.content;
  } catch (error) {
    console.log(messages);
    console.log(error);
    return "AI Server: Đã xảy ra lỗi, vui lòng liên hệ GD Việt Nam";
  }
};

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
