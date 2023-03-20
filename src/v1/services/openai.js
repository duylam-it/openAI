import { Configuration, OpenAIApi } from "openai";
import { FIRST_CONTENT, OPENAI_API_KEY as apiKey } from "../config/variable.js";

const rules = ["sex", "18+"];
const role = ["user", "system", "assistant"];
const configuration = new Configuration({
  organization: "org-UIaraMXHiNGlxdPbR2DaLD7S",
  apiKey,
});
const openai = new OpenAIApi(configuration);

export const callAI = async (messages) => {
  try {
    console.log(messages);
    if (!configuration.apiKey) throw new Error("Không tìm thấy OpenAI API Key");

    if (typeof messages !== "object")
      throw new Error("Yêu cầu không đúng định dạng");
    messages.forEach((message) => {
      if (
        message.role === undefined ||
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
