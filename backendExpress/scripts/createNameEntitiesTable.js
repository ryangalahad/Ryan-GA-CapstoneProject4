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

async function createNameEntitiesTable() {
  try {
    console.log("Dropping existing name_entities table if it exists...");
    await pool.query("DROP TABLE IF EXISTS name_entities CASCADE;");

    console.log("Creating name_entities table...");

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS name_entities ( 
        id SERIAL PRIMARY KEY,
        entity_id VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(1000) NOT NULL,
        first_name VARCHAR(500),
        last_name VARCHAR(500),
        aliases TEXT,
        birth_date DATE,
        country VARCHAR(255),
        entity_type VARCHAR(255),
        sanctions_list TEXT,
        risk_level VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        raw_json JSONB,
        CONSTRAINT idx_entity_id UNIQUE (entity_id)
      );
    `;

    await pool.query(createTableSQL);
    console.log("✓ Table name_entities created successfully!");

    // Create indexes for faster searching
    console.log("Creating indexes...");

    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_name ON name_entities USING GIST (name gist_trgm_ops);",
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_country ON name_entities(country);",
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_entity_type ON name_entities(entity_type);",
    );

    console.log("✓ Indexes created successfully!");
    await pool.end();
  } catch (error) {
    console.error("Error creating table:", error.message);
    await pool.end();
    process.exit(1);
  }
}

createNameEntitiesTable();
