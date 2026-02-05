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

// Search by name (caption)
export async function searchByName(name) {
  const result = await pool.query(
    `SELECT 
      id, caption, schema, entity_id, nationality, birthdate,
      gender, first_name, last_name, name_aliases, position, address, 
      jsonb_build_object(
        'alias', properties->'alias',
        'gender', properties->'gender',
        'topics', properties->'topics',
        'address', properties->'address',
        'country', properties->'country',
        'birthDate', properties->'birthDate',
        'firstName', properties->'firstName',
        'lastName', properties->'lastName',
        'createdAt', properties->'createdAt',
        'name', properties->'name',
        'notes', properties->'notes',
        'programId', properties->'programId'
      ) as properties,
      created_at
    FROM name_entities 
    WHERE caption ILIKE $1 
    LIMIT 20`,
    [`%${name}%`],
  );
  return result.rows;
}

// Search by nationality
export async function searchByNationality(nationality) {
  const result = await pool.query(
    `SELECT 
      id, caption, schema, entity_id, nationality, birthdate,
      gender, first_name, last_name, name_aliases, position, address, 
      jsonb_build_object(
        'alias', properties->'alias',
        'gender', properties->'gender',
        'topics', properties->'topics',
        'address', properties->'address',
        'country', properties->'country',
        'birthDate', properties->'birthDate',
        'firstName', properties->'firstName',
        'lastName', properties->'lastName',
        'createdAt', properties->'createdAt',
        'name', properties->'name',
        'notes', properties->'notes',
        'programId', properties->'programId'
      ) as properties,
      created_at
    FROM name_entities 
    WHERE nationality = $1`,
    [nationality],
  );
  return result.rows;
}

// Search by topic (sanction/debarment/wanted)
export async function searchByTopic(topic) {
  const result = await pool.query(
    `SELECT 
      id, caption, schema, entity_id, nationality, birthdate,
      gender, first_name, last_name, name_aliases, position, address, 
      jsonb_build_object(
        'alias', properties->'alias',
        'gender', properties->'gender',
        'topics', properties->'topics',
        'address', properties->'address',
        'country', properties->'country',
        'birthDate', properties->'birthDate',
        'firstName', properties->'firstName',
        'lastName', properties->'lastName',
        'createdAt', properties->'createdAt',
        'name', properties->'name',
        'notes', properties->'notes',
        'programId', properties->'programId'
      ) as properties,
      created_at
    FROM name_entities 
    WHERE properties->>'topics' ILIKE $1`,
    [`%${topic}%`],
  );
  return result.rows;
}
