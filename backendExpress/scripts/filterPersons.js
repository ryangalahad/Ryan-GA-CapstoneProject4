import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_PATH = path.join(__dirname, "../data/targets.nested.json");
const OUTPUT_PATH = path.join(__dirname, "../data/targets-100k.json");

// Function to check if name contains English letters (non-Cyrillic)
function hasEnglishName(name) {
  if (!name) return false;
  // Check if name contains Latin characters
  return /[a-zA-Z]/.test(name);
}

// Function to filter non-Cyrillic names (exclude Russian names)
function isNonCyrillic(name) {
  if (!name) return false;
  // If it has Cyrillic characters, it's likely Russian/Cyrillic
  const cyrillicRegex = /[\u0400-\u04FF]/;
  return !cyrillicRegex.test(name);
}

async function filterPersonData() {
  try {
    console.log("Starting to filter Person entities with English names...");

    const fileStream = fs.createReadStream(INPUT_PATH);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const writeStream = fs.createWriteStream(OUTPUT_PATH);
    let count = 0;
    let personCount = 0;
    let maxPersons = 100000;

    console.log("Reading and filtering entities...");

    for await (const line of rl) {
      if (line.trim()) {
        try {
          const entity = JSON.parse(line);
          count++;

          // Only include Person schema
          if (entity.schema === "Person" && personCount < maxPersons) {
            const caption = entity.caption || "";

            // Check if name has English characters and is not Cyrillic
            if (hasEnglishName(caption) && isNonCyrillic(caption)) {
              writeStream.write(JSON.stringify(entity) + "\n");
              personCount++;

              if (personCount % 5000 === 0) {
                console.log(`Filtered ${personCount} persons so far...`);
              }
            }
          }

          if (count % 50000 === 0) {
            console.log(`Processed ${count} total entities...`);
          }
        } catch (e) {
          console.warn(`Failed to parse line: ${line.substring(0, 100)}`);
        }
      }
    }

    writeStream.end();

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    console.log(
      `✓ Successfully filtered ${personCount} Person entities with English names!`,
    );
    console.log(`Output saved to: ${OUTPUT_PATH}`);
    process.exit(0);
  } catch (error) {
    console.error("Error filtering data:", error.message);
    process.exit(1);
  }
}

filterPersonData();
