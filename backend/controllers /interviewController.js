import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';
const prisma = new PrismaClient();

export const createInterview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { topic, difficulty } = req.body;
  try {
    const interview = await prisma.interview.create({
      data: { topic, difficulty, userId: req.user.id },
    });
    res.status(201).json(interview);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const listInterviews = async (req, res) => {
  try {
    const interviews = await prisma.interview.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' },
    });
    res.json(interviews);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getInterview = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const interview = await prisma.interview.findFirst({
      where: { id, userId: req.user.id },
      include: { questions: true },
    });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json(interview);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
