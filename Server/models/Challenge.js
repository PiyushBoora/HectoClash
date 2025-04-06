import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['daily', 'weekly'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  sequence: { type: [[String]], required: true }, // <-- double array
});

const userChallengeStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['daily', 'weekly'],
    required: true
  },
  lastCompleted: {
    type: Date
  },
  attempts: {
    type: Number,
    default: 0
  },
  completions: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  }
});

export const Challenge = mongoose.model('Challenge', challengeSchema);
export const UserChallengeStats = mongoose.model('UserChallengeStats', userChallengeStatsSchema);
