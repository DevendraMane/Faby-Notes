import mongoose from "mongoose";
import "dotenv/config";

const URI = process.env.MONGODB_URI;
// mongoose.connect(URI);

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log(`Connection Successful to DB ✅`);
  } catch (error) {
    console.error(`DB connection failed 😬...`);
    console.log(error);
    process.exit(1); //!<-- It tells Node.js to Stop running immediately and report that something went wrong.
  }
};

export default connectDB;
