require("dotenv").config();
const Groq = require("groq-sdk");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function run() {
  try {
    const result = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: "Hello from Groq new model!" }]
    });

    console.log(result.choices[0].message.content);
  } catch (err) {
    console.error(err);
  }
}

run();
