import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    shortform: {
      type: String,
      required: true,
    },
    streamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stream",
      required: true,
    },
    slug: String,
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
