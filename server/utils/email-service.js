import nodemailer from "nodemailer";
import "dotenv/config";

// Create a transporter with more detailed configuration
// ?SMTP (Simple Mail Transfer Protocol)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL(Secure Sockets Layer)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true, // Show debug output
  logger: true, // Log information into the console
});

// Verify the connection configuration
const verifyConnection = async () => {
  try {
    const verification = await transporter.verify();
    console.log("SMTP server connection verified:", verification);
    return verification;
  } catch (error) {
    console.error("SMTP connection error:", error);
    return false;
  }
};

// Call the verification function
verifyConnection();

// Send verification email
export const sendVerificationEmail = async (user, verificationToken) => {
  // Use the frontend URL for the verification link
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: {
      name: "Faby Notes",
      address: process.env.EMAIL_USER,
    },
    to: user.email,
    subject: "Verify Your Email - Faby Notes",
    // Add text version for better deliverability
    text: `
Hello ${user.username},

Thank you for registering with Faby Notes. Please verify your email address by visiting the link below:

${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.

Best regards,
The Faby Notes Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Welcome to Faby Notes!</h2>
        <p>Hello ${user.username},</p>
        <p>Thank you for registering with Faby Notes. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <p>Best regards,<br>The Faby Notes Team</p>
      </div>
    `,
    // Add headers to improve deliverability(so that it doesn't go into spam)
    headers: {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      Importance: "High",
    },
  };

  try {
    console.log("Attempting to send verification email to:", user.email);
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

// Send welcome email after verification
export const sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: {
      name: "Faby Notes",
      address: process.env.EMAIL_USER,
    },
    to: user.email,
    subject: "Welcome to Faby Notes!",
    // Add text version for better deliverability
    text: `
Hello ${user.username},

Thank you for verifying your email address. Your account is now fully activated!

You can now access all features of Faby Notes.

Visit our site: ${process.env.FRONTEND_URL}

If you have any questions or need assistance, please don't hesitate to contact our support team.

Best regards,
The Faby Notes Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Welcome to Faby Notes!</h2>
        <p>Hello ${user.username},</p>
        <p>Thank you for verifying your email address. Your account is now fully activated!</p>
        <p>You can now access all features of Faby Notes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Go to Faby Notes</a>
        </div>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>The Faby Notes Team</p>
      </div>
    `,
    // Add headers to improve deliverability
    headers: {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      Importance: "High",
    },
  };

  try {
    console.log("Attempting to send welcome email to:", user.email);
    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
};
