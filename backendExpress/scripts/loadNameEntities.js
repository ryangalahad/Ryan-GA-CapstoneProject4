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
    console.log("Starting to load name entities into PostgreSQL...");
    console.log(
      `Connecting to database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    );

    if (!fs.existsSync(TARGET_PATH)) {
      console.error(`File not found: ${TARGET_PATH}`);
      process.exit(1);
    }

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
      `✓ Successfully loaded ${insertedCount} entities into name_entities! (${errorCount} skipped)`,
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
        const offset = idx * 11;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10}, $${offset + 11})`;
      })
      .join(",");

    const params = batch.flatMap((entity) => [
      entity.id || null,
      entity.name || "Unknown",
      entity.firstName || null,
      entity.lastName || null,
      entity.aliases ? JSON.stringify(entity.aliases) : null,
      entity.birthDate || null,
      entity.country || null,
      entity.schema || null,
      entity.datasets ? entity.datasets.join(", ") : null,
      entity.riskLevel || null,
      JSON.stringify(entity),
    ]);

    const sql = `
      INSERT INTO name_entities (entity_id, name, first_name, last_name, aliases, birth_date, country, entity_type, sanctions_list, risk_level, raw_json)
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
    throw error;
  }
}

loadNameEntities();
