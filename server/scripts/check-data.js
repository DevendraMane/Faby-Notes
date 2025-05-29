import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/faby-notes"
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

async function checkData() {
  try {
    await connectDB();

    // Check streams
    const streams = await mongoose.connection.db
      .collection("streams")
      .find({})
      .toArray();
    console.log("Streams:", streams);

    // Check branches
    const branches = await mongoose.connection.db
      .collection("branches")
      .find({})
      .toArray();
    console.log("Branches:", branches);

    // Check if branches have valid streamIds
    for (const branch of branches) {
      const matchingStream = streams.find(
        (stream) =>
          stream._id.toString() === branch.streamId ||
          stream._id.toString() === branch.streamId.toString()
      );

      console.log(
        `Branch ${branch.name} (${branch._id}) has streamId ${
          branch.streamId
        } - Matching stream: ${matchingStream ? matchingStream.name : "NONE"}`
      );
    }

    // Group branches by streamId
    const branchesByStream = {};
    branches.forEach((branch) => {
      if (!branchesByStream[branch.streamId]) {
        branchesByStream[branch.streamId] = [];
      }
      branchesByStream[branch.streamId].push(branch);
    });

    console.log("Branches by streamId:", branchesByStream);

    process.exit(0);
  } catch (error) {
    console.error("Error checking data:", error);
    process.exit(1);
  }
}

checkData();
