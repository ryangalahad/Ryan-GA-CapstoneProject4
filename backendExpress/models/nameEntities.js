import { query } from "../database/db.js";
import { getCountryCode } from "../utils/countryMapping.js";

// Search by name (caption)
export async function searchByName(name) {
  const result = await query(
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

// Search by nationality (accepts both country code and country name)
export async function searchByNationality(nationality) {
  // If user provides a country name, convert to code
  let countryCode = nationality;
  if (nationality.length > 2) {
    // Assume it's a country name, convert to code
    countryCode = getCountryCode(nationality) || nationality;
  }

  const result = await query(
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
    WHERE (properties->>'country')::text ILIKE $1 
       OR (properties->'country'->>0)::text ILIKE $1`,
    [`%${countryCode}%`],
  );
  return result.rows;
}
