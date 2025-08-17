import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post("/", async (req, res) => {
  const { transcript, prompt } = req.body;

  if (!transcript || !prompt) {
    return res.status(400).json({ error: "Transcript and prompt are required" });
  }

  try {
    const aiPrompt = `
You are an assistant that summarizes meeting transcripts.
Transcript:
${transcript}

Instruction:
${prompt}

Structured summary:
`;

    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: aiPrompt }]
    });

    const summary = response.choices[0].message.content.trim();
    return res.json({ summary });
  } catch (err) {
    console.error("Error generating summary:", err.message);
    return res.status(500).json({ error: "Failed to generate summary" });
  }
});

export default router;
