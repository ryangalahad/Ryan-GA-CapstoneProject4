// Auth middleware - checks JWT token or headers
import jwt from "jsonwebtoken";

export function checkAuth(req, res, next) {
  // First try JWT token from Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
      (err, decoded) => {
        if (err) {
          return res.status(401).json({
            success: false,
            error: "Invalid or expired token",
          });
        }
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
      },
    );
  } else {
    // Fallback to header-based auth (for testing)
    const userId = req.headers["x-user-id"];
    const userRole = req.headers["x-user-role"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        error:
          "Unauthorized - Provide Authorization header with token or x-user-id header",
      });
    }

    req.userId = userId;
    req.userRole = userRole;
    next();
  }
}

// Check if user is manager
export function checkManager(req, res, next) {
  const userRole = req.userRole || req.headers["x-user-role"];

  if (userRole !== "manager") {
    return res.status(403).json({
      success: false,
      error: "Forbidden - Manager access required",
    });
  }
  next();
}
