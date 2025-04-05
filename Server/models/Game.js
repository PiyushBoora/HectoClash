const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['practice', 'duel'],
      required: true
    },
    players: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      score: {
        type: Number,
        default: 0
      },
      timeSpent: [Number],
      correctAnswers: {
        type: Number,
        default: 0
      },
      totalQuestions: {
        type: Number,
        default: 0
      }
    }],
    sequences: [[String]],
    solutions: [[{
      expression: String,
      difficulty: Number
    }]],
    startTime: Date,
    endTime: Date,
    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;