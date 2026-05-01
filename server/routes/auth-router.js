import express from "express";
import passport from "passport";
import authcontrollers from "../controllers/auth-controller.js";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
} from "../validators/auth-validators.js";
import { validate } from "../middleware/validate-middleware.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

export const authRouter = express.Router();

// ******  REGISTRATION ROUTE  ****** //
authRouter
  .route("/register")
  .post(validate(registerSchema), authcontrollers.register);

// ******  LOGIN ROUTE  ****** //
authRouter.route("/login").post(validate(loginSchema), authcontrollers.login);

// ******  VERIFY EMAIL ROUTE  ****** //
authRouter.route("/verify-email/:token").get(authcontrollers.verifyEmail);

// ******  RESEND VERIFICATION EMAIL ROUTE  ****** //
authRouter
  .route("/resend-verification")
  .post(authcontrollers.resendVerificationEmail);

// ******  FORGOT PASSWORD ROUTE  ****** //
authRouter
  .route("/forgot-password")
  .post(validate(forgotPasswordSchema), authcontrollers.forgotPassword);

// ******  RESET PASSWORD ROUTE  ****** //
authRouter
  .route("/reset-password/:token")
  .post(validate(resetPasswordSchema), authcontrollers.resetPassword);

// ******  GET USER ROUTE  ****** //
authRouter.route("/user").get(authMiddleware, authcontrollers.getUser);

// ******  GOOGLE AUTH ROUTES  ****** //
// Route to initiate Google OAuth(register)
authRouter
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.patch(
  "/update-profile",
  authMiddleware,
  authcontrollers.updateUserProfile,
);

authRouter.route("/google/callback").get(
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google-auth-failed`,
    session: false,
  }),
  authcontrollers.googleAuthCallback,
);
