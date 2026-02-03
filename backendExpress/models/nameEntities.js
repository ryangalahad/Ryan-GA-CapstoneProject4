import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "capstone",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Search by name
export async function searchByName(name) {
  const result = await pool.query(
    "SELECT * FROM name_entities WHERE name ILIKE $1 LIMIT 10",
    [`%${name}%`]
  );
  return result.rows;
}

// Search by country
export async function searchByCountry(country) {
  const result = await pool.query(
    "SELECT * FROM name_entities WHERE country = $1",
    [country]
  );
  return result.rows;
}