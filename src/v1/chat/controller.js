import { Configuration, OpenAIApi } from "openai";

export async function chat(req, res) {
  const { question } = req.body;

  if (!question || question === undefined)
    throw new Error("Bạn phải nhập câu hỏi");
  const rules = ["sex", "18+"];
  question.split(" ").forEach((word) => {
    if (rules.includes(word)) throw new Error("Yêu cầu chứa từ ngữ vi phạm");
  });
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: question }],
  });

  res.json({
    success: true,
    data: {
      message: completion.data.choices[0].message.content,
    },
  });
}
