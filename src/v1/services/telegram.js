import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { FIRST_CONTENT, TELEGRAM_API_KEY } from "../config/variable.js";
import { callAI } from "./openai.js";

const bot = new Telegraf(TELEGRAM_API_KEY);
let temp = [{
  role: "system",
  content: FIRST_CONTENT,
}];

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
    try {
      if(temp.lenght > 100) temp = [
        {
          role: "system",
          content: FIRST_CONTENT,
        }
      ];
      console.log("Command (/ai): ", ctx.update.message.text.slice(3).trim());
      let content = "";
      if(ctx.update.message.text.slice(3).trim() === "") content = "Xin chào";
      else content = ctx.update.message.text.slice(3).trim();
      if(temp.indexOf({role: "user", content}) !== -1) temp.splice(temp.indexOf({role: "user", content}), 1);
      temp.push({
        role: "user",
        content,
      });
      const message = await callAI(temp);
      temp.push({
        role: "assistant",
        content: message,
      });

      ctx.reply(message);
    } catch (e) {
      console.log(e)
    }
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
