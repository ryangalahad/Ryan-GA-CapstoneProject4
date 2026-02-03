// Validation middleware - checks if request data is valid

// Validate case creation
export function validateCase(req, res, next) {
  const { name, description, status } = req.body;

  // Check name is not empty
  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Case name cannot be empty",
    });
  }

  // Check name length
  if (name.length > 255) {
    return res.status(400).json({
      success: false,
      error: "Case name too long (max 255 characters)",
    });
  }

  // Check status is valid
  const validStatuses = ["open", "closed", "pending"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: `Invalid status. Must be: ${validStatuses.join(", ")}`,
    });
  }

  next();
}

// Validate user creation
export function validateUser(req, res, next) {
  const { name, email, role } = req.body;

  // Check name
  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "User name cannot be empty",
    });
  }

  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email format",
    });
  }

  // Check role if provided
  const validRoles = ["user", "admin", "analyst"];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      error: `Invalid role. Must be: ${validRoles.join(", ")}`,
    });
  }

  next();
}
