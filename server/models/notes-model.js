import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  notesTitle: {
    type: String,
    required: true,
  },
  notesType: {
    type: String,
    enum: ["Notes", "Assignment", "PYQ", "MCQ", "Books", "Other"],
    required: true,
  },
  subjectName: {
    type: String,
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  branchName: {
    type: String,
    required: true,
  },
  streamName: {
    type: String,
    required: true,
  },
  semesterNumber: {
    type: Number,
    required: true,
  },
  cloudinaryUrl: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: String,
    default: () =>
      new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Notes = mongoose.model("Note", notesSchema);

export default Notes;
