import fs from "fs";

const data = JSON.parse(
  fs.readFileSync("./backendExpress/data/watchlist-5k.json", "utf8"),
);

console.log("=== SAMPLE ENTITIES FROM WATCHLIST ===\n");

data.slice(0, 5).forEach((entity, index) => {
  console.log(`[${index + 1}] ${entity.caption || entity.id}`);
  console.log(`    Schema: ${entity.schema}`);
  console.log(`    ID: ${entity.id}`);
  console.log(`    Target (Sanctioned): ${entity.target}`);
  console.log(`    Datasets: ${entity.datasets.join(", ")}`);

  if (entity.properties?.name) {
    console.log(`    Name Property: ${entity.properties.name[0]}`);
  }
  if (entity.properties?.country) {
    console.log(`    Country: ${entity.properties.country[0]}`);
  }
  if (entity.properties?.birthDate) {
    console.log(`    Birth Date: ${entity.properties.birthDate[0]}`);
  }
  console.log("");
});

// Show statistics
console.log("=== ENTITY STATISTICS ===");
console.log(`Total entities: ${data.length}`);
console.log(`Sanctioned (target=true): ${data.filter((e) => e.target).length}`);
console.log(
  `Entity types: ${[...new Set(data.map((e) => e.schema))].join(", ")}`,
);
