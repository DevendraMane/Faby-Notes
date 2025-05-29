import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpiry: {
    type: Date,
  },
  authProvider: {
    type: String,
    default: "local",
  },
  createdAt: {
    type: String,
    default: () =>
      new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
  },
});

const Feedback = new mongoose.model("Feedback", feedbackSchema);

export default Feedback;
