require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const mongoose = require("mongoose");
const morgan = require("morgan");
const Chat = require("../models/Chat.js");

const app = express();
app.use(cors());
app.use(express.json()); // ✅ Important: Allows Express to parse JSON requests
app.use(morgan("dev"));

// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            You are an expert in career counseling and psychological value assessment, specializing in Schwartz's Theory of Basic Human Values.
            Your task is to analyze the user's input, which consists of ranked values from the Schwartz model.
            Based on their rankings, provide personalized career and life insights, including:
            - Key career themes aligned with their values.
            - Work environments that fit their personality and motivations.
            - Ideal job roles or industries where they can thrive.
            - Any potential challenges they may face and how to navigate them.

            If the user inputs Schwartz values rankings (e.g., "Universalism - 5, Benevolence - 4"), process them and offer insights.
            If they ask about general career guidance, respond based on their values if provided, or request their rankings for a personalized response.
          `,
        },
        { role: "user", content: message },
      ],
    });

    const botResponse = completion.choices[0].message.content;

    // 🔹 Store conversation in MongoDB
    const chatEntry = new Chat({
      userMessage: message,
      botResponse: botResponse,
    });

    await chatEntry.save(); // ✅ Save to database

    res.json({ response: botResponse });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
