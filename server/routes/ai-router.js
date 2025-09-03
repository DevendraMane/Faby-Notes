// Backend route file - Update your ai-router.js
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
router.post("/chat", async (req, res) => {
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

    // Call GROQ API with updated model
    const completion = await openai.chat.completions.create({
      // Use one of these currently supported models:
      model: "llama-3.3-70b-versatile", // Recommended replacement
      // model: "llama-3.1-8b-instant", // Faster, lighter option
      // model: "mixtral-8x7b-32768", // Alternative option
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024,
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

    if (error.status === 400) {
      return res.status(400).json({
        error: "AI model error. Please contact support.",
      });
    }

    res.status(500).json({
      error: "Failed to get AI response. Please try again.",
    });
  }
});

export { router as aiRouter };
