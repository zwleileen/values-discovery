const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userMessage: String,
  botResponse: {
    summary: String,
    career_themes: [String],
    work_environments: [String],
    ideal_jobs: [String],
    challenges: [
      {
        challenge: String,
        solution: String,
      },
    ],
  },
  timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema); // create model

module.exports = Chat;
