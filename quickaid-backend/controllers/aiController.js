const Groq = require("groq-sdk");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getFirstAidGuide = async (req, res) => {
  try {
    const { emergency } = req.body;

    const prompt = `
    Provide clear first-aid steps for a ${emergency} emergency.
    Give 5 bullet points.
    Keep instructions simple and easy for a normal person.
    `;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a medical first-aid assistant." },
        { role: "user", content: prompt }
      ],
    });

    const answer = response.choices[0].message.content;

    res.json({ guide: answer });

  } catch (error) {
    console.error("AI Error: ", error);
    return res.status(500).json({ error: "AI service failed" });
  }
};

module.exports = { getFirstAidGuide };
