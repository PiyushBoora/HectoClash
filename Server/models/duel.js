const mongoose = require("mongoose");
const { Schema } = mongoose;

const duelSchema = new Schema(
  {
    player1: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    player2: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    player1Score: {
      type: Number,
      default: 0,
    },
    player2Score: {
      type: Number,
      default: 0,
    },
    duelTime: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Duel || mongoose.model("Duel", duelSchema);
