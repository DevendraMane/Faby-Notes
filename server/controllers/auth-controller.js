import User from "../models/user-model.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../utils/email-service.js";
import jwt from "jsonwebtoken";

// ****** REGISTER CONTROLLER ****** //
const register = async (req, res) => {
  try {
    const { username, email, phone, password, isAdmin } = req.body;

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Automatically assign 'teacher' role for ftccoe.ac.in domain, else 'student'
    const emailDomain = email.split("@")[1]; //taking out only the domain
    const role = emailDomain === "ftccoe.ac.in" ? "teacher" : "student";

    // Create new user
    const userCreated = await User.create({
      username,
      email,
      phone,
      password: password,
      role: role || "student",
      isAdmin: isAdmin || false,
      emailVerified: false,
      streamName: "",
      branchName: "",
    });

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: userCreated._id.toString() },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    // Store the token in the user document
    userCreated.verificationToken = verificationToken;
    userCreated.verificationTokenExpiry = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ); // 24 hours
    await userCreated.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(
      userCreated,
      verificationToken
    );

    // Send response
    res.status(201).json({
      message:
        "Registration Successful ✅ Please check your email to verify your account.",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
      emailVerificationSent: emailSent,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// ------ REGISTER CONTROLLER ------- //

// ****** LOGIN CONTROLLER ****** //
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ message: "Register First😅" });
    }

    // Check if email is verified
    if (!userExist.emailVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in.",
        emailVerified: false,
      });
    }

    const isPasswordValid = await userExist.comparePassword(password);

    if (isPasswordValid) {
      res.status(200).json({
        msg: "Login Successful😄",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
        emailVerified: true,
      });
    } else {
      res.status(401).json({ msg: "Invalid Email or Password" });
    }
  } catch (error) {
    res.status(404).json({ msg: "Wrong Credentials 🚫" });
  }
};
// ------ LOGIN CONTROLLER ------ //

// ****** VERIFY EMAIL CONTROLLER ****** //
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    // Update user as verified
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user);

    // Send success response
    res.status(200).json({
      message: "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Email verification failed" });
  }
};
// ------ VERIFY EMAIL CONTROLLER ------ //

// ****** RESEND VERIFICATION EMAIL CONTROLLER ****** //
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(400).json({
        message: "Email already verified",
      });
    }

    // Generate new verification token
    const verificationToken = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    // Update user with new token
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(user, verificationToken);

    if (emailSent) {
      res.status(200).json({
        message: "Verification email resent successfully",
      });
    } else {
      res.status(500).json({
        message: "Failed to send verification email",
      });
    }
  } catch (error) {
    console.error("Resend verification email error:", error);
    res.status(500).json({ message: "Failed to resend verification email" });
  }
};
// ------ RESEND VERIFICATION EMAIL CONTROLLER ------ //

// ****** GET USER CONTROLLER ****** //
const getUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        emailVerified: user.emailVerified,
        profileImage: user.profileImage,
        authProvider: user.authProvider,
        createdAt: user.createdAt,
        likesCount: user.likesCount,
        followers: user.followers,
        uploads: user.uploads,

        streamName: user.streamName,
        branchName: user.branchName,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ------ GET USER CONTROLLER ------ //

// ****** GOOGLE AUTH CALLBACK CONTROLLER ****** //
const googleAuthCallback = async (req, res) => {
  try {
    // User is already authenticated by passport
    const user = req.user;

    // Generate JWT token
    const token = await user.generateToken();

    // Redirect to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/success?token=${token}`
    );
  } catch (error) {
    console.error("Google auth callback error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server-error`);
  }
};
// ------ GOOGLE AUTH CALLBACK CONTROLLER ------ //

// ****** UPDATE USER PROFILE CONTROLLER ****** //
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // Extracted from auth middleware
    const { streamName, branchName } = req.body;

    if (!streamName || !branchName) {
      return res
        .status(400)
        .json({ message: "Stream and Branch are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!["student", "teacher"].includes(user.role)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this information" });
    }

    user.streamName = streamName;
    user.branchName = branchName;
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully ✅",
      user: {
        username: user.username,
        streamName: user.streamName,
        branchName: user.branchName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  getUser,
  googleAuthCallback,
  updateUserProfile,
};
