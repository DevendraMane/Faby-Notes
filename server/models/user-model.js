import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
  },
  streamName: {
    type: String,
    enum: ["Engineering", "Diploma", "Pharmacy", ""],
    default: "",
  },
  branchName: {
    type: String,
    default: "",
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
  profileImage: {
    type: String,
    default: "/images/user-image.png",
  },
  uploads: {
    type: Number,
    default: 0,
  },
  followers: {
    type: Number,
    default: 0,
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note", // reference to Note model
    },
  ],

  createdAt: {
    type: String,
    default: () =>
      new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
  },
  googleId: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.generateToken = function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        isAdmin: this.isAdmin,
        role: this.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.error("Token generation error:", error);
  }
};

userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
};

const User = mongoose.model("User", userSchema);
export default User;
