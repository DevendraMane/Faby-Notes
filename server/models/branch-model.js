import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    shortform: {
      type: String,
      required: true,
    },
    streamName: {
      type: String,
      required: true,
    },
    slug: String,
    branchName: {
      type: String,
      required: true,
    },
    streamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stream",
      required: true,
    },
  },
  { collection: "branches" }
);

// Add this before creating the model
branchSchema.pre("save", function (next) {
  if (!this.slug && this.shortform) {
    this.slug = this.shortform.toLowerCase();
  }
  next();
});

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;
