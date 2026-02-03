// Simple auth middleware - checks if user is logged in
// In a real app, you'd use JWT tokens or sessions

export function checkAuth(req, res, next) {
  // Check if user is authenticated
  // For now, we'll check if userId is provided in headers
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized - Please provide x-user-id header",
    });
  }

  // Attach user info to request
  req.userId = userId;
  next();
}

// Check if user is manager
export function checkManager(req, res, next) {
  const userRole = req.headers["x-user-role"];

  if (userRole !== "manager") {
    return res.status(403).json({
      success: false,
      error: "Forbidden - Manager access required"});
    }
}
