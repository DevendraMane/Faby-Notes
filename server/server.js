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
import notesSearchRouter from "./routes/search-router.js";
import path from "path";
import { fileURLToPath } from "url";
import { booksRouter } from "./routes/books-router.js";
import { bookMarkRouter } from "./routes/bookmark-router.js";

const app = express();
const PORT = process.env.PORT || 5000;
// ----- Serving React Frontend ----- //
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files from React build
app.use(express.static(path.join(__dirname, "client", "dist")));

// ***** HANDLING CORS ***** //
// const corsOptions = {
//   origin: [
//     "http://localhost:5173", // For local development
//     // For production
//   ],
//   methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
//   credentials: true,
//   optionsSuccessStatus: 200, // For legacy browser support
// };
const corsOptions = {
  origin: [
    "https://faby-clean-client.onrender.com", // For local development
    // For production
  ],
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
};

//* for knowing the filename of the logs
if (process.env.NODE_ENV === "development") {
  const originalLog = console.log;
  // custom clg
  console.log = (...args) => {
    const stack = new Error().stack.split("\n")[2].trim();
    originalLog(`📍 ${stack}\n`, ...args);
  };
}
//? How the above thing is working:
// 🧩 1. if (process.env.NODE_ENV === "development")

// It checks if your app is running in development mode.

// You don’t want this feature in production — only for local debugging.

// You can set it in your terminal like:

// NODE_ENV=development nodemon server.js

// 🧩 2. const originalLog = console.log;

// It saves the original console.log function before we overwrite it.

// Without this, if we redefine console.log, we’d lose the original one forever.

// So now we can still call the original function when needed.

// 🧩 3. console.log = (...args) => { ... }

// This overrides the default console.log with a custom function.

// (...args) means it accepts any number of arguments, just like the normal log.

// 🧩 4. const stack = new Error().stack.split("\n")[2].trim();

// Here’s the magic ✨:

// new Error().stack gives a stack trace string — it shows the exact file and line where the function was called.

// For example:

// Error
//     at Object.console.log (server.js:12:15)
//     at controllers/branchController.js:27:13

// split("\n") turns that big string into an array of lines.

// [2] picks the third line (because index 0 is "Error", index 1 is our override, index 2 is the actual source file).

// .trim() cleans extra spaces.

// 👉 So now stack holds something like:

// at controllers/branchController.js:27:13

// 🧩 5. originalLog(\📍 ${stack}\n`, ...args);`

// This calls the real console.log again.

// It prints the file and line number before your actual message.

// Example output:

// 📍 at controllers/branchController.js:27:13
// Fetching branch with slug: eng-cse

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

// ***** BOOKS Handling-MIDDLEWARE ***** //
app.use("/api/books", booksRouter);

app.use("/api/bookmark", bookMarkRouter);

// Catch-all: send back React's index.html for any non-API route
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
  });
});
