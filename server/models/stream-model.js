import mongoose from "mongoose";

const streamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { collection: "streams" }
);

const Stream = mongoose.model("Stream", streamSchema);

export default Stream;
