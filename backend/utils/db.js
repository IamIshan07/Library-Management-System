import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");

// Generic helpers to read/write a JSON "table" file.
// Not meant for production use (no locking/concurrency control),
// but perfect for a mini project / learning exercise.

export function readData(fileName) {
  const filePath = path.join(dataDir, fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export function writeData(fileName, data) {
  const filePath = path.join(dataDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function generateId(prefix) {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}
