// Backend route file - Create this in your routes folder
import express from "express";
import OpenAI from "openai";
import { authMiddleware } from "../middleware/auth-middleware.js";

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

// Chat endpoint
router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Prepare conversation context
    const messages = [
      {
        role: "system",
        content: `You are a helpful AI assistant for a student notes platform called FabyNotes. 
        You help students with their studies, answer questions about their notes, subjects, and provide educational assistance. 
        Be friendly, helpful, and educational in your responses. Keep responses concise but informative.
        If asked about specific notes or subjects, you can help explain concepts, provide study tips, or answer academic questions.`,
      },
    ];

    // Add conversation history for context (last 10 messages)
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.slice(-10).forEach((msg) => {
        messages.push({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        });
      });
    }

    // Add current message
    messages.push({
      role: "user",
      content: message,
    });

    // Call GROQ API
    const completion = await openai.chat.completions.create({
      model: "llama3-70b-8192", // or "mixtral-8x7b-32768"
      messages: messages,
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);

    if (error.code === "insufficient_quota") {
      return res.status(429).json({
        error: "AI service temporarily unavailable. Please try again later.",
      });
    }

    res.status(500).json({
      error: "Failed to get AI response. Please try again.",
    });
  }
});

export { router as aiRouter };
