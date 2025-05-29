import mongoose from "mongoose";
import "dotenv/config"; // Automatically loads .env variables

// const URI = `mongodb://127.0.0.1:27017/faby-notes`;
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
