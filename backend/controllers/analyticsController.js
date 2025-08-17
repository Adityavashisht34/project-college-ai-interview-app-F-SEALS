import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const answers = await prisma.answer.findMany({
      where: { userId },
      include: { question: true }
    });

    const byTopic = {};
    const byDifficulty = {};
    const timeline = {}; // yyyy-mm

    for (const a of answers) {
      const topic = a.question.topic;
      const diff = a.question.difficulty;
      const month = a.createdAt.toISOString().slice(0,7);

      if (!byTopic[topic]) byTopic[topic] = { total: 0, scored: 0, sum: 0 };
      byTopic[topic].total += 1;
      if (a.score !== null && a.score !== undefined) {
        byTopic[topic].scored += 1;
        byTopic[topic].sum += a.score;
      }

      if (!byDifficulty[diff]) byDifficulty[diff] = { total: 0, scored: 0, sum: 0 };
      byDifficulty[diff].total += 1;
      if (a.score !== null && a.score !== undefined) {
        byDifficulty[diff].scored += 1;
        byDifficulty[diff].sum += a.score;
      }

      if (!timeline[month]) timeline[month] = { count: 0, sum: 0, scored: 0 };
      timeline[month].count += 1;
      if (a.score !== null && a.score !== undefined) {
        timeline[month].scored += 1;
        timeline[month].sum += a.score;
      }
    }

    const topicSummary = Object.entries(byTopic).map(([topic, v]) => ({
      topic,
      attempts: v.total,
      avgScore: v.scored ? Number((v.sum / v.scored).toFixed(2)) : null
    }));

    const difficultySummary = Object.entries(byDifficulty).map(([difficulty, v]) => ({
      difficulty,
      attempts: v.total,
      avgScore: v.scored ? Number((v.sum / v.scored).toFixed(2)) : null
    }));

    const progress = Object.entries(timeline).sort(([a], [b]) => a.localeCompare(b)).map(([month, v]) => ({
      month,
      attempts: v.count,
      avgScore: v.scored ? Number((v.sum / v.scored).toFixed(2)) : null
    }));

    res.json({ topicSummary, difficultySummary, progress });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};