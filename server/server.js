import express from "express";
import cors from "cors";
import connectDB from "./utils/db.js";
import { authRouter } from "./routes/auth-router.js";
import { streamRouter } from "./routes/stream-router.js";
import { branchRouter } from "./routes/branch-router.js";
import feedbackRouter from "./routes/feedback-router.js";
import session from "express-session";
import passport from "passport";
import { setupPassport } from "./config/passport.js";
import "dotenv/config";
import { subjectsRouter } from "./routes/subjects-router.js";
import { notesRouter } from "./routes/notes-router.js";
import { uploadRouter } from "./routes/upload-router.js";
import { aiRouter } from "./routes/ai-router.js";
import { dialogflowRouter } from "./routes/dialogflow-router.js";
import notesSearchRouter from "./routes/search-router.js";\
import path from "path";
import { fileURLToPath } from "url";


const app = express();
const PORT = process.env.PORT || 5000;
// ----- Serving React Frontend ----- //
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files from React build
app.use(express.static(path.join(__dirname, "client", "dist")));

// ***** HANDLING CORS ***** //
const corsOptions = {
  origin: [
    "http://localhost:5173", // For local development
    // For production
  ],
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use(cors(corsOptions));

// ***** JSON Data Handling-MIDDLEWARE ***** //
app.use(express.json());

// ***** SESSION MIDDLEWARE ***** //
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // For cross-origin cookies
    },
  })
);

// ***** PASSPORT MIDDLEWARE ***** //
app.use(passport.initialize());
app.use(passport.session());

// Set up passport strategies
setupPassport();

// ***** AUTH ROUTES Handling-MIDDLEWARE ***** //
app.use("/api/auth", authRouter);

// ***** STREAM ROUTES Handling-MIDDLEWARE ***** //
app.use("/api/streams", streamRouter);

// ***** BRANCH ROUTES Handling-MIDDLEWARE ***** //
app.use("/api/branches", branchRouter);

// ***** SUBJECTS ROUTES Handling-MIDDLEWARE ***** //
app.use("/api/subjects", subjectsRouter);

// ***** NOTES ROUTES Handling-MIDDLEWARE ***** //
app.use("/api/notes", notesRouter);

// ***** FEEDBACK ROUTES Handling-MIDDLEWARE ***** //
app.use("/api/form", feedbackRouter);

// ***** UPLOAD ROUTES Handling-MIDDLEWARE ***** //
app.use("/api/upload", uploadRouter);

// ***** SEARCH ROUTES Handling-MIDDLEWARE ***** //
app.use("/api/search", notesSearchRouter);

// ***** DIALOGFLOW ROUTES Handling-MIDDLEWARE ***** //
app.use("/api/dialogflow", dialogflowRouter);

// ***** AI ROUTES Handling-MIDDLEWARE ***** //
app.use("/api/ai", aiRouter);


// Catch-all: send back React's index.html for any non-API route
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  }
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
  });
});
