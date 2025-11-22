import mongoose from "mongoose";

const subjectsSchema = mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
    },
    subjectCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    streamName: {
      type: String,
      required: true,
    },
    branchName: {
      type: String,
      required: true,
    },
    semesterNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    availableDocs: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    slug: {
      type: String,
      required: true,
      // unique: true,
      lowercase: true,
    },
  },
  {
    collection: "subjects",
    timestamps: true,
  }
);

const Subject = mongoose.model("Subject", subjectsSchema);

export default Subject;
