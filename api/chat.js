const OpenAI = require("openai");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message: userMessage } = req.body;

  const openai = new OpenAI({
    apiKey: "sk-proj-eEcFq8IFJkCvgCzGYXfOT3BlbkFJdB6b3xW2TXg4RDNOGN31",
  });

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: userMessage }],
      max_tokens: 150,
      temperature: 0.7,
    });

    const botResponse = chatCompletion.choices[0].message.content;
    res.json({ response: botResponse });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
