import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Use a Pool for better performance in a web app
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('connect', () => {
  console.log('Connected to the capstone database successfully!');
});

export const query = (text, params) => pool.query(text, params);