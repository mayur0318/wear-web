const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "wearweb_super_secret_key_2026";

/**
 * Generates a JWT token for a user.
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" } // Token valid for 7 days
  );
};

/**
 * Middleware: Verify JWT token from Authorization header.
 * If valid, attaches req.user = { userId, email, role }
 * If invalid/missing, returns 401.
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user info to request
    req.user = decoded;
    // Backward compat: also set userId and user-id for older middleware
    req.userId = decoded.userId;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please login again.", expired: true });
    }
    return res.status(401).json({ message: "Invalid token. Access denied." });
  }
};

/**
 * Middleware: Require specific role(s).
 * Usage: requireRole("admin") or requireRole("admin", "vendor")
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Required role: ${roles.join(" or ")}` });
    }
    next();
  };
};

module.exports = {
  generateToken,
  verifyToken,
  requireRole,
  JWT_SECRET,
};
