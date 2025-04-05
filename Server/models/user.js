const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    profileImage: {
      type: String,
      default: "https://t3.ftcdn.net/jpg/03/64/62/36/360_F_364623623_ERzQYfO4HHHyawYkJ16tREsizLyvcaeg.jpg",
    },
    name: {
      type: String,
    },
    stats: {
      totalSolved: { type: Number, default: 0 },
      gamesPlayed: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      averageTime: { type: Number, default: 0 },
      rank: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;