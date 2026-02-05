// User model for Compliance Case Officer
// Schema: name, email, password, createdAt
import { query } from "../database/db.js"; // Your database connection
import jwt from "jsonwebtoken";

export const userSchema = {
  name: {
    type: "string",
    required: true,
    description: "Full name of the compliance case officer",
  },
  email: {
    type: "string",
    required: true,
    unique: true,
    description: "Email address for login and contact",
  },
  password: {
    type: "string",
    required: true,
    description: "Hashed password for authentication",
  },
  createdAt: {
    type: "timestamp",
    default: "CURRENT_TIMESTAMP",
    description: "Account creation timestamp",
  },
  gender: {
    type: "string",
    enum: ["male", "female"],
    required: true,
  },
  role: {
    type: "string",
    enum: ["officer", "manager"],
    default: "officer",
    required: true,
  },
};

// User table creation SQL (PostgreSQL)
export const createUserTableSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Create a new user
export async function createUser({ name, email, password, role }) {
  const sql = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await query(sql, [name, email, password, role]);
  const user = result.rows[0];

  // Generate tokens for the new user
  const tokens = generateTokens(user.id, user.role);

  return { user, tokens };
}

// Generate JWT tokens
export function generateTokens(userId, role) {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "1h" },
  );

  const refreshToken = jwt.sign(
    { userId, role },
    process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
    { expiresIn: "7d" },
  );

  return { accessToken, refreshToken };
}

// Get all users
export async function getAllUsers() {
  const sql = `SELECT id, name, email, role, createdAt FROM users;`;
  const result = await query(sql);
  return result.rows;
}

// Get user by ID
export async function getUserById(id) {
  const sql = `SELECT id, name, email, role, createdAt FROM users WHERE id = $1;`;
  const result = await query(sql, [id]);
  return result.rows[0];
}

// Delete user
export async function deleteUser(id) {
  const sql = `DELETE FROM users WHERE id = $1 RETURNING id;`;
  const result = await query(sql, [id]);
  return result.rows[0];
}

// Login user (verify password)
export async function loginUser(email, password) {
  const sql = `SELECT id, name, email, role, password FROM users WHERE email = $1;`;
  const result = await query(sql, [email]);
  const user = result.rows[0];

  if (!user) {
    return null; // User not found
  }

  // Simple password check (in production, use bcrypt)
  if (user.password !== password) {
    return null; // Wrong password
  }

  // Generate tokens
  const tokens = generateTokens(user.id, user.role);
  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    tokens,
  };
}
