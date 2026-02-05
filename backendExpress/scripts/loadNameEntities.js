import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_PATH = path.join(__dirname, "../data/targets-40k.json");
const BATCH_SIZE = 100;

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "capstone",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function loadNameEntities() {
  try {
    console.log("Starting to load Person entities into PostgreSQL...");
    console.log(
      `Connecting to database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    );

    if (!fs.existsSync(TARGET_PATH)) {
      console.error(`File not found: ${TARGET_PATH}`);
      process.exit(1);
    }

    // Drop existing table
    console.log("Dropping existing name_entities table...");
    await pool.query("DROP TABLE IF EXISTS name_entities CASCADE;");

    // Create table with comprehensive Person schema
    console.log("Creating name_entities table for Persons...");
    await pool.query(`
      CREATE TABLE name_entities (
        id SERIAL PRIMARY KEY,
        caption VARCHAR(500) NOT NULL,
        schema VARCHAR(50) NOT NULL DEFAULT 'Person',
        entity_id VARCHAR(500) UNIQUE,
        nationality VARCHAR(255),
        birthdate TEXT,
        gender VARCHAR(50),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        name_aliases TEXT,
        position TEXT,
        address TEXT,
        properties JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Reading NDJSON file...");
    const fileStream = fs.createReadStream(TARGET_PATH);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let entities = [];
    for await (const line of rl) {
      if (line.trim()) {
        try {
          const entity = JSON.parse(line);
          entities.push(entity);
        } catch (e) {
          console.warn(`Failed to parse line: ${line.substring(0, 100)}`);
        }
      }
    }

    console.log(`Found ${entities.length} entities to insert...`);

    let insertedCount = 0;
    let errorCount = 0;

    // Insert in batches
    for (let i = 0; i < entities.length; i += BATCH_SIZE) {
      const batch = entities.slice(i, i + BATCH_SIZE);
      try {
        const result = await insertBatch(batch);
        insertedCount += result.inserted;
        errorCount += result.errors;
        console.log(
          `Inserted ${insertedCount} of ${entities.length} entities (${errorCount} errors)...`,
        );
      } catch (batchError) {
        console.error(`Batch insert failed:`, batchError.message);
        throw batchError;
      }
    }

    console.log(
      `✓ Successfully loaded ${insertedCount} Person entities into name_entities! (${errorCount} skipped)`,
    );
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("Error loading name entities:", error.message);
    console.error("Full error:", error);
    await pool.end();
    process.exit(1);
  }
}

async function insertBatch(batch) {
  if (batch.length === 0) return { inserted: 0, errors: 0 };

  try {
    const values = batch
      .map((_, idx) => {
        const offset = idx * 13;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10}, $${offset + 11}, $${offset + 12}, $${offset + 13})`;
      })
      .join(",");

    const params = batch.flatMap((entity) => {
      const props = entity.properties || {};

      // Extract birthdate as string (store as-is from JSON)
      const birthdate = props.birthDate || null;

      // Extract nationality from properties
      const nationality = props.nationality || props.country || null;

      // Extract gender
      const gender = props.gender || null;

      // Extract position
      const position = props.position || null;

      // Extract address
      const address = props.address || null;

      // Extract name aliases - use 'alias' field from properties if available
      let nameAliases = null;
      if (props.alias && Array.isArray(props.alias)) {
        nameAliases = props.alias.join(", ");
      }

      // Split name into first and last
      const caption = entity.caption || "";
      const nameParts = caption.trim().split(/\s+/);
      const lastName = nameParts[nameParts.length - 1] || "";
      const firstName = nameParts.slice(0, -1).join(" ") || "";

      return [
        caption, // caption
        "Person", // schema
        entity.id || null, // entity_id
        nationality, // nationality
        birthdate, // birthdate (as string)
        gender, // gender
        firstName, // first_name
        lastName, // last_name
        nameAliases, // name_aliases
        position, // position
        address, // address
        JSON.stringify(props), // properties
        new Date().toISOString(), // created_at
      ];
    });

    const sql = `
      INSERT INTO name_entities (
        caption, schema, entity_id, nationality, birthdate, gender,
        first_name, last_name, name_aliases, position, address, properties, created_at
      )
      VALUES ${values}
      ON CONFLICT (entity_id) DO NOTHING
      RETURNING id;
    `;

    const result = await pool.query(sql, params);
    return {
      inserted: result.rowCount || 0,
      errors: batch.length - (result.rowCount || 0),
    };
  } catch (error) {
    console.error("Error inserting batch:", error.message);
    return { inserted: 0, errors: batch.length };
  }
}

loadNameEntities();
