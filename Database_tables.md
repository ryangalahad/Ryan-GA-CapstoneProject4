# PostgreSQL Database Tables - pgAdmin4 Setup Guide

This document contains all CREATE TABLE commands from your backendExpress project that you can run directly in pgAdmin4.

---

## **Files that create tables:**

1. **backendExpress/models/user.js** → `users` table
2. **backendExpress/scripts/loadNameEntities.js** → `name_entities` table (Current schema in use)
3. **backendExpress/scripts/createNameEntitiesTable.js** → `name_entities` table (Alternative schema)

---

## **TABLE 1: Users Table**

**File:** `backendExpress/models/user.js`

**Purpose:** Stores officer and manager user accounts with authentication

**Run this SQL in pgAdmin4:**

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

- `id`: Auto-incrementing primary key
- `name`: User's full name
- `email`: Unique email (must be unique)
- `password`: Hashed password
- `role`: Either 'officer' or 'manager'
- `createdAt`: Timestamp when account was created

---

## **TABLE 2: Name Entities Table (CURRENT - Used in loadNameEntities.js)**

**File:** `backendExpress/scripts/loadNameEntities.js`

**Purpose:** Stores 40,000 sanctioned Person entities with biographical data

**Run this SQL in pgAdmin4:**

```sql
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
```

**Columns:**

- `id`: Auto-incrementing primary key
- `caption`: Person's display name (searchable)
- `schema`: Always 'Person' for this table
- `entity_id`: Unique identifier from OpenSanctions
- `nationality`: Country code(s)
- `birthdate`: Birth date as text (e.g., "1979-01-01")
- `gender`: Gender from properties
- `first_name`: Extracted first name
- `last_name`: Extracted last name
- `name_aliases`: Comma-separated alternative names
- `position`: Job position/title
- `address`: Location/address
- `properties`: JSONB containing full biographical data (alias, topics, country, name, notes, programId, etc.)
- `created_at`: When record was added

**This is the ACTIVE schema used by your searches.**

---

## **TABLE 3: Name Entities Table (ALTERNATIVE - In createNameEntitiesTable.js)**

**File:** `backendExpress/scripts/createNameEntitiesTable.js`

**Purpose:** Alternative schema for name_entities (Not currently in use)

**Run this SQL in pgAdmin4 if you want the alternative schema:**

```sql
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
```

**Then create indexes:**

```sql
CREATE INDEX IF NOT EXISTS idx_name ON name_entities USING GIST (name gist_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_country ON name_entities(country);
CREATE INDEX IF NOT EXISTS idx_entity_type ON name_entities(entity_type);
```

**⚠️ NOTE:** This is an alternative schema. Your current system uses Table 2 above.

---

## **How to Use in pgAdmin4:**

1. **Open pgAdmin4** and navigate to your `capstone` database
2. **Right-click on "Schemas"** → New → Schema (if needed)
3. **Open Query Tool** (Tools → Query Tool)
4. **Copy and paste one of the CREATE TABLE commands above**
5. **Click Execute** (F5)
6. **Verify** the table was created in the left sidebar

---

## **Quick Reference:**

| Table                   | File                       | Current Use        | Columns                                                                                                                                             |
| ----------------------- | -------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **users**               | user.js                    | Authentication     | 6 (id, name, email, password, role, createdAt)                                                                                                      |
| **name_entities**       | loadNameEntities.js        | Search 40k persons | 14 (id, caption, schema, entity_id, nationality, birthdate, gender, first_name, last_name, name_aliases, position, address, properties, created_at) |
| **name_entities** (alt) | createNameEntitiesTable.js | Not used           | 15 (alternative schema)                                                                                                                             |

---

## **Current Data Status:**

- **users table**: 0 records (empty, you create via registration)
- **name_entities table**: 40,000 records (loaded from targets-40k.json)

---

## **To Delete a Table (if needed):**

```sql
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS name_entities CASCADE;
```

---

## **Useful SQL Commands for Testing:**

### Check how many records in name_entities:

```sql
SELECT COUNT(*) as total_records FROM name_entities;
```

### See sample records:

```sql
SELECT id, caption, nationality, birthdate, gender FROM name_entities LIMIT 5;
```

### Check users:

```sql
SELECT id, name, email, role FROM users;
```

### Search for a specific person:

```sql
SELECT id, caption, nationality, gender FROM name_entities WHERE caption ILIKE '%michael%';
```

---
