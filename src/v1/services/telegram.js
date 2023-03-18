import { TELEGRAM_API_KEY } from "../config/variable.js";
import { callAI } from "./openai.js";

const bot = new Telegraf(TELEGRAM_API_KEY);
const temp = [];

const connect = () => {
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
    console.log("Command (/ai): ", ctx.update.message.text.slice(4).trim());
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
};

export default { connect };
