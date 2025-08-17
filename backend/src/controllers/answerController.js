import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();

// Ensure API key is available
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env file");
}

// Set default model to Gemini 2.5 Flash
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function gradeAnswer(questionText, idealAnswer, userResponse) {
  const system = You are grading a technical interview answer. Score 0-10 and provide brief feedback. Return JSON {score, feedback}.;
  const userMsg = Question: ${questionText}\nIdealAnswer: ${idealAnswer || 'N/A'}\nCandidateAnswer: ${userResponse};

  const prompt = ${system}\n\n${userMsg};

  const model = gemini.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(prompt);

  const raw = result.response.text().trim();
  try {
    return JSON.parse(raw);
  } catch {
    return { score: null, feedback: raw || 'No feedback' };
  }
}

export const submitAnswer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { questionId, userResponse } = req.body;

  try {
    const question = await prisma.question.findUnique({
      where: { id: Number(questionId) }
    });
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Ensure ownership of the interview
    const interview = await prisma.interview.findFirst({
      where: { id: question.interviewId, userId: req.user.id }
    });
    if (!interview) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const grading = await gradeAnswer(
        question.questionText,
        question.idealAnswer,
        userResponse
    );

    const saved = await prisma.answer.create({
      data: {
        userId: req.user.id,
        questionId: question.id,
        userResponse,
        score: grading.score,
        feedback: grading.feedback
      }
    });

    res.status(201).json(saved);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const listAnswersByUser = async (req, res) => {
  try {
    const answers = await prisma.answer.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { question: true }
    });
    res.json(answers);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
