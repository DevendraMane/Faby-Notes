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
      uppercase: true,
      trim: true,
    },
    streamName: {
      type: String,
      required: true,
    },

    // CHANGES START HERE 👇👇
    isCommon: {
      type: Boolean,
      default: false,
    },

    branchName: {
      type: String,
      required: function () {
        return !this.isCommon;
      },
    },

    slug: {
      type: String,
      required: function () {
        return !this.isCommon;
      },
      lowercase: true,
    },
    // CHANGES END HERE 👆👆

    semesterNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    availableDocs: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "subjects",
    timestamps: true,
  }
);

export default mongoose.model("Subject", subjectsSchema);
