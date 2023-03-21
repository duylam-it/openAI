import { Configuration, OpenAIApi } from "openai";
import {
  OPENAI_API_KEY as apiKey,
  OPENAI_ORGANIZATION_ID,
} from "../config/variable.js";

const rules = ["sex", "18+"];
const role = ["user", "system", "assistant"];
const configuration = new Configuration({
  organization: OPENAI_ORGANIZATION_ID,
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
      if (message.role === undefined || message.content === undefined)
        throw new Error("Yêu cầu không đúng định dạng");
      if (!role.includes(message.role))
        throw new Error("Yêu cầu không đúng định dạng");
    });

    messages[messages.length - 1].content.split(" ").forEach((word) => {
      if (rules.includes(word)) throw new Error("Yêu cầu chứa từ ngữ vi phạm");
    });

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0301",
      messages,
    });
    return completion.data.choices[0].message.content;
  } catch (error) {
    console.log(error);
    return "Debug: " + error.message;
  }
};
