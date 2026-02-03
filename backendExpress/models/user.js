// User model for Compliance Case Officer
// Schema: name, email, password, createdAt
import { query } from '../database/db.js'; // Your database connection

export const userSchema = {
  name: {
    type: 'string',
    required: true,
    description: 'Full name of the compliance case officer'
  },
  email: {
    type: 'string',
    required: true,
    unique: true,
    description: 'Email address for login and contact'
  },
  password: {
    type: 'string',
    required: true,
    description: 'Hashed password for authentication'
  },
  createdAt: {
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
    description: 'Account creation timestamp'
  },
  gender: {
    type: 'string',
    enum: ["male", "female"],
    required: true
  },
  role: {
    type: 'string',
    enum: ['officer', 'manager'],
    default: 'officer',
    required: true
  }
};

// User table creation SQL (PostgreSQL)
export const createUserTableSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
