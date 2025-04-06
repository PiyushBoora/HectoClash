const { Challenge, UserChallengeStats } = require('../models/Challenge');
const { getRandomQuestions } = require('../data/RandomSequences'); // Use your question generation logic here

// Utility to get start of current period (daily/weekly)
const getStartOfPeriod = (type) => {
  const now = new Date();
  if (type === 'daily') {
    now.setHours(0, 0, 0, 0);
  } else {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as start of week
    now.setDate(diff);
    now.setHours(0, 0, 0, 0);
  }
  return now;
};

// GET /api/challenges/:type?userId=xxx
const getChallengeByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { userId } = req.query;

    if (!['daily', 'weekly'].includes(type)) {
      return res.status(400).json({ error: 'Invalid challenge type' });
    }

    const date = getStartOfPeriod(type);

    let challenge = await Challenge.findOne({ type });
    if (!challenge) {
      const sequence = getRandomQuestions(1);
      challenge = await Challenge.create({ type, date, sequence });
    }

    let stats = await UserChallengeStats.findOne({ userId, type });
    if (!stats) {
      stats = await UserChallengeStats.create({ userId, type });
    }

    const completed =
      stats.lastCompleted &&
      new Date(stats.lastCompleted).toDateString() === new Date(date).toDateString();

    if (completed) {
      return res.status(403).json({ error: 'Challenge already completed' });
    }

    return res.json({
      _id: challenge._id,
      sequence: challenge.sequence,
      stats: {
        attempts: stats.attempts,
        completions: stats.completions,
        streak: stats.streak,
      },
      completed: false,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// POST /api/challenges/:type/complete
const completeChallenge = async (req, res) => {
  try {
    const { type } = req.params;
    const { userId } = req.body;
    console.log(userId)
    console.log(type)
    if (!['daily', 'weekly'].includes(type)) {
      return res.status(400).json({ error: 'Invalid challenge type' });
    }

    const date = getStartOfPeriod(type);
    const todayStr = date.toDateString();

    const stats = await UserChallengeStats.findOne({ userId, type });
    if (!stats) return res.status(404).json({ error: 'Stats not found' });

    const alreadyCompleted =
      stats.lastCompleted &&
      new Date(stats.lastCompleted).toDateString() === todayStr;

    if (!alreadyCompleted) {
      const lastDate = stats.lastCompleted ? new Date(stats.lastCompleted) : null;
      const yesterday = new Date(date);
      yesterday.setDate(yesterday.getDate() - (type === 'daily' ? 1 : 7));

      const keepStreak =
        lastDate &&
        new Date(lastDate).toDateString() === yesterday.toDateString();

      stats.streak = keepStreak ? stats.streak + 1 : 1;
      stats.completions += 1;
      stats.lastCompleted = date;
    }

    stats.attempts += 1;
    await stats.save();

    return res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getChallengeByType,
  completeChallenge,
};
