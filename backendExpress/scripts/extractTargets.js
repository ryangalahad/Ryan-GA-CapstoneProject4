import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_PATH = path.join(__dirname, "../data/targets.nested.json");
const OUTPUT_PATH = path.join(__dirname, "../data/targets-40k.json");
const LIMIT = 40000;

async function extractTargets() {
  try {
    console.log(
      `Extracting first ${LIMIT} targets from targets.nested.json...`,
    );

    const fileStream = fs.createReadStream(INPUT_PATH, {
      encoding: "utf8",
      highWaterMark: 64 * 1024,
    });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const entities = [];
    let buffer = "";
    let braceDepth = 0;
    let inString = false;
    let escapeNext = false;

    for await (const line of rl) {
      for (const char of line) {
        if (escapeNext) {
          escapeNext = false;
          buffer += char;
          continue;
        }

        if (char === "\\") {
          escapeNext = true;
          buffer += char;
          continue;
        }

        if (char === '"' && !escapeNext) {
          inString = !inString;
        }

        if (!inString) {
          if (char === "{") braceDepth++;
          if (char === "}") braceDepth--;
        }

        buffer += char;

        // When we close a top-level object
        if (braceDepth === 0 && buffer.trim().endsWith("}")) {
          const trimmed = buffer.trim();
          if (trimmed.startsWith("{")) {
            try {
              const entity = JSON.parse(trimmed);
              entities.push(entity);

              if (entities.length % 5000 === 0) {
                console.log(`Extracted ${entities.length} targets...`);
              }

              if (entities.length >= LIMIT) {
                break;
              }

              buffer = "";
            } catch (e) {
              buffer = "";
            }
          }
        }
      }

      if (entities.length >= LIMIT) {
        break;
      }
    }

    // Write to file as NDJSON (newline-delimited JSON) to avoid large string issues
    const writeStream = fs.createWriteStream(OUTPUT_PATH);
    entities.slice(0, LIMIT).forEach((entity, index) => {
      writeStream.write(JSON.stringify(entity) + "\n");
    });
    writeStream.end();

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    console.log(
      `✓ Successfully extracted ${entities.length} targets to ${OUTPUT_PATH}`,
    );

    // Show sample
    if (entities.length > 0) {
      console.log("\nSample target:");
      console.log(JSON.stringify(entities[0], null, 2).substring(0, 500));
    }
  } catch (error) {
    console.error("Error extracting targets:", error.message);
    process.exit(1);
  }
}

extractTargets();
