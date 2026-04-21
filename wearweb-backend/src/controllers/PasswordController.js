const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const mailSend = require("../utils/MailUtils");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

/**
 * POST /api/auth/forgot-password
 * Generates a reset token, hashes it, stores it, and emails the reset link.
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Don't reveal whether email exists (security best practice)
      return res.status(200).json({
        message: "If an account with that email exists, a reset link has been sent.",
      });
    }

    // Generate random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing (never store plain token in DB)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save to user document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Build reset URL (plain token in URL, hashed in DB)
    const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;

    // Build email HTML
    const resetHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #f4f4f4; font-family: Arial, sans-serif; margin: 0; padding: 0; }
    .container { width: 100%; padding: 30px 20px; }
    .card { max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0f172a, #1d6fd8); color: #fff; padding: 24px; text-align: center; font-size: 22px; font-weight: bold; }
    .content { padding: 30px 24px; color: #333; font-size: 15px; line-height: 1.6; }
    .content h2 { color: #0f172a; margin-top: 0; }
    .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #1d6fd8, #2563eb); color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; margin: 20px 0; }
    .warning { background: #fef3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 12px; font-size: 13px; color: #856404; margin-top: 16px; }
    .footer { padding: 16px 24px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #f0f0f0; }
  </style>
</head>
<body>
<div class="container">
  <div class="card">
    <div class="header">🔐 Password Reset — Wear Web</div>
    <div class="content">
      <h2>Reset Your Password</h2>
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset My Password</a>
      </div>
      <div class="warning">
        ⏰ This link expires in <strong>15 minutes</strong>. If you didn't request this, please ignore this email — your password will remain unchanged.
      </div>
    </div>
    <div class="footer">© 2026 Wear Web. All rights reserved.</div>
  </div>
</div>
</body>
</html>`;

    await mailSend(
      user.email,
      "Reset Your Password — Wear Web",
      "Password reset request",
      resetHtml
    );

    res.status(200).json({
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ message: "Error sending reset email. Please try again." });
  }
};

/**
 * POST /api/auth/reset-password/:token
 * Verifies token, updates password, clears reset fields.
 */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Password and confirm password are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Hash the token from URL to match against DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token. Please request a new reset link.",
      });
    }

    // Hash new password and save
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.status(200).json({
      message: "Password updated successfully! You can now login with your new password.",
    });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ message: "Error resetting password. Please try again." });
  }
};

/**
 * POST /user/change-password
 * Change password for logged-in user (requires old password verification).
 */
const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("changePassword error:", err);
    res.status(500).json({ message: "Failed to change password" });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
  changePassword,
};
