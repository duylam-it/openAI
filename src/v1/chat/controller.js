import { Configuration, OpenAIApi } from "openai";

export async function chat(req, res) {
  const { question } = req.body;

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
