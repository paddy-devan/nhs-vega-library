import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const specsDir = path.join(repoRoot, "specs");
const outputDir = path.join(repoRoot, "site", "src", "generated");
const outputFile = path.join(outputDir, "catalog.json");

const requiredMetaFields = ["title", "category", "description", "tags"];

function fail(message) {
  throw new Error(message);
}

function stripJsonComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function stripTrailingCommas(source) {
  return source.replace(/,\s*([}\]])/g, "$1");
}

async function readJson(filePath) {
  const raw = await readFile(filePath, "utf8");
  const normalized = stripTrailingCommas(stripJsonComments(raw));

  try {
    return JSON.parse(normalized);
  } catch (error) {
    fail(`Invalid JSON in ${path.relative(repoRoot, filePath)}: ${error.message}`);
  }
}

function validateMeta(meta, folderName) {
  for (const field of requiredMetaFields) {
    if (!(field in meta)) {
      fail(`Missing "${field}" in specs/${folderName}/meta.json`);
    }
  }

  if (!Array.isArray(meta.tags) || meta.tags.some((tag) => typeof tag !== "string")) {
    fail(`meta.tags must be an array of strings for specs/${folderName}`);
  }
}

function validateSpec(spec, folderName) {
  if (!spec || typeof spec !== "object") {
    fail(`spec.json must contain an object for specs/${folderName}`);
  }

  if (!Array.isArray(spec.data)) {
    fail(`spec.json must contain a data array for specs/${folderName}`);
  }

  const hasDatasetSource = spec.data.some(
    (entry) => entry && typeof entry === "object" && entry.name === "dataset",
  );

  if (!hasDatasetSource) {
    fail(`spec.json must define a data source named "dataset" for specs/${folderName}`);
  }
}

function validateSampleData(sampleData, folderName) {
  if (!Array.isArray(sampleData)) {
    fail(`sample-data.json must contain an array for specs/${folderName}`);
  }
}

function sortByTitle(items) {
  return [...items].sort((a, b) => a.title.localeCompare(b.title));
}

async function main() {
  const dirents = await readdir(specsDir, { withFileTypes: true });
  const folders = dirents.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);

  if (folders.length === 0) {
    fail("No spec folders found in specs/");
  }

  const seenSlugs = new Set();
  const specs = [];

  for (const folderName of folders) {
    const baseDir = path.join(specsDir, folderName);
    const metaPath = path.join(baseDir, "meta.json");
    const specPath = path.join(baseDir, "spec.json");
    const sampleDataPath = path.join(baseDir, "sample-data.json");

    const [meta, spec, sampleData] = await Promise.all([
      readJson(metaPath),
      readJson(specPath),
      readJson(sampleDataPath),
    ]);

    validateMeta(meta, folderName);
    validateSpec(spec, folderName);
    validateSampleData(sampleData, folderName);

    const slug = folderName;

    if (seenSlugs.has(slug)) {
      fail(`Duplicate slug "${slug}" in specs/${folderName}`);
    }

    seenSlugs.add(slug);
    specs.push({
      ...meta,
      slug,
      sampleSize: sampleData.length,
      spec,
      sampleData,
    });
  }

  const categories = [...new Set(specs.map((item) => item.category))].sort((a, b) =>
    a.localeCompare(b),
  );

  const catalog = {
    generatedAt: new Date().toISOString(),
    categories,
    specs: sortByTitle(specs),
  };

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  console.log(`Generated ${path.relative(repoRoot, outputFile)} with ${specs.length} spec(s).`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
