import dialogflow from "@google-cloud/dialogflow";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keyPath = path.join(__dirname, "dialogflow-key.json");

if (!fs.existsSync(keyPath)) {
  const base64Data = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
  if (!base64Data)
    throw new Error("Missing GOOGLE_APPLICATION_CREDENTIALS_BASE64 in .env");

  const keyBuffer = Buffer.from(base64Data, "base64");
  fs.writeFileSync(keyPath, keyBuffer);
}

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: keyPath,
});

const projectId = process.env.DIALOGFLOW_PROJECT_ID || "your-project-id";

export const detectIntent = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({
        success: false,
        message: "Message and sessionId are required",
      });
    }

    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: "en-US",
        },
      },
    };

    const [response] = await sessionClient.detectIntent(request);
    const result = response.queryResult;

    const botResponse = {
      success: true,
      message: result.fulfillmentText,
      intent: result.intent
        ? result.intent.displayName
        : "Default Fallback Intent",
      confidence: result.intentDetectionConfidence,
      suggestions: getSuggestions(result.intent?.displayName),
    };

    res.json(botResponse);
  } catch (error) {
    console.error("Dialogflow Error:", error);
    res.status(500).json({
      success: false,
      message: "Sorry, I encountered an error. Please try again.",
      error: error.message,
    });
  }
};

const getSuggestions = (intentName) => {
  const suggestions = {
    "college.name": [
      "Where is our college located?",
      "What courses do you offer?",
      "Tell me about admissions",
    ],
    "college.location": [
      "What is the college name?",
      "What are the facilities?",
      "How to apply?",
    ],
    "courses.available": [
      "What is the fee structure?",
      "Admission requirements?",
      "College timings?",
    ],
    "Default Fallback Intent": [
      "What is the name of our college?",
      "Where is our college located?",
      "What courses do you offer?",
      "Tell me about admissions",
      "College facilities",
    ],
  };

  return suggestions[intentName] || suggestions["Default Fallback Intent"];
};

// Get predefined questions
export const getPredefinedQuestions = async (req, res) => {
  try {
    const questions = [
      {
        id: 1,
        text: "What is the name of our college?",
        category: "General",
      },
      {
        id: 2,
        text: "Where is our college located?",
        category: "General",
      },
      {
        id: 3,
        text: "What courses do you offer?",
        category: "Academics",
      },
      {
        id: 4,
        text: "What are the admission requirements?",
        category: "Admissions",
      },
      {
        id: 5,
        text: "What facilities are available?",
        category: "Facilities",
      },
      {
        id: 6,
        text: "What are the college timings?",
        category: "General",
      },
      {
        id: 7,
        text: "How much is the fee structure?",
        category: "Fees",
      },
      {
        id: 8,
        text: "How to apply for admission?",
        category: "Admissions",
      },
    ];

    res.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching predefined questions",
    });
  }
};
