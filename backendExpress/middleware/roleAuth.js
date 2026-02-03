// Role-based access control middleware

const PERMISSIONS = {
  manager: [
    "create_case",
    "update_case",
    "delete_case",
    "assign_case",
    "view_case",
    "search_entity",
  ],
  officer: [
    "view_case",
    "search_entity",
    "create_case",
    "update_case",
    "delete_case",
  ],
};

// Check if user can assign cases (manager only)
export function requireAssignPermission(req, res, next) {
  const userRole = req.headers["x-user-role"];

  if (!userRole) {
    return res.status(401).json({
      success: false,
      error: "User role not provided",
    });
  }

  if (userRole !== "manager") {
    return res.status(403).json({
      success: false,
      error: `Permission denied - ${userRole} cannot assign cases`,
    });
  }

  next();
}

// Check if user is manager
export function requireManager(req, res, next) {
  const userRole = req.headers["x-user-role"];

  if (userRole !== "manager") {
    return res.status(403).json({
      success: false,
      error: "Manager access required",
    });
  }

  next();
}
