import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();

// Load API key from env
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env file");
}

// Use Gemini 2.5 Flash model
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateQuestionPrompt(topic, difficulty) {
  const prompt = `
You are a strict technical interviewer.
Ask one ${difficulty} level question about ${topic}.
Also provide an ideal concise answer.
Return JSON exactly in the format: {"question": "...", "idealAnswer": "..."}
`;

  const model = gemini.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(prompt);

  const raw = result.response.text().trim();
  try {
    return JSON.parse(raw);
  } catch {
    return { question: raw, idealAnswer: "" };
  }
}

export const generateQuestion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { interviewId } = req.body;

  try {
    const interview = await prisma.interview.findFirst({
      where: { id: Number(interviewId), userId: req.user.id }
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const { question, idealAnswer } = await generateQuestionPrompt(
        interview.topic,
        interview.difficulty
    );

    const saved = await prisma.question.create({
      data: {
        interviewId: interview.id,
        questionText: question || 'Question generation failed',
        idealAnswer: idealAnswer || null,
        topic: interview.topic,
        difficulty: interview.difficulty,
      }
    });

    res.status(201).json(saved);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
