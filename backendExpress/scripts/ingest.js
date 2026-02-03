import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "../data");
const FILE_PATH = path.join(DATA_DIR, "targets.nested.json");
const URL =
  "https://data.opensanctions.org/datasets/20260202/default/targets.nested.json";

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

console.log("Starting download of OpenSanctions targets data...");
console.log(`URL: ${URL}`);
console.log(`Saving to: ${FILE_PATH}\n`);

const file = fs.createWriteStream(FILE_PATH);
let downloadedBytes = 0;
let startTime = Date.now();

https
  .get(URL, (response) => {
    if (response.statusCode !== 200) {
      console.error(`Download failed with status ${response.statusCode}`);
      fs.unlink(FILE_PATH, () => {});
      process.exit(1);
    }

    const totalSize = parseInt(response.headers["content-length"], 10);

    response.on("data", (chunk) => {
      downloadedBytes += chunk.length;
      const percent = ((downloadedBytes / totalSize) * 100).toFixed(2);
      const elapsed = (Date.now() - startTime) / 1000;
      const mbps = downloadedBytes / (1024 * 1024) / elapsed;
      process.stdout.write(
        `\rDownloaded: ${(downloadedBytes / (1024 * 1024)).toFixed(2)} MB / ${(totalSize / (1024 * 1024)).toFixed(2)} MB (${percent}%) - Speed: ${mbps.toFixed(2)} MB/s`,
      );
    });

    response.pipe(file);

    file.on("finish", () => {
      file.close();
      const finalSize = fs.statSync(FILE_PATH).size;
      const elapsed = (Date.now() - startTime) / 1000;
      console.log(
        `\n\n✓ Download complete! File size: ${(finalSize / (1024 * 1024)).toFixed(2)} MB`,
      );
      console.log(`Time elapsed: ${elapsed.toFixed(2)} seconds`);
    });
  })
  .on("error", (err) => {
    fs.unlink(FILE_PATH, () => {});
    console.error("Error downloading file:", err.message);
    process.exit(1);
  });
