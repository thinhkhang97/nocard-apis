import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import yaml from 'js-yaml';

const DATA_DIR = new URL('../data', import.meta.url).pathname;
const CATEGORIES_DIR = join(DATA_DIR, 'categories');
const OUTPUT_FILE = join(DATA_DIR, 'apis.json');

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function buildCatalog() {
  const files = readdirSync(CATEGORIES_DIR).filter(f => f.endsWith('.yaml'));
  const apis = [];

  for (const file of files) {
    const category = basename(file, '.yaml');
    const content = readFileSync(join(CATEGORIES_DIR, file), 'utf-8');
    const entries = yaml.load(content);

    if (!Array.isArray(entries)) {
      console.warn(`Skipping ${file}: not an array`);
      continue;
    }

    for (const entry of entries) {
      apis.push({
        id: `${category}/${slugify(entry.name)}`,
        category,
        name: entry.name,
        url: entry.url,
        api_base: entry.api_base,
        description: entry.description,
        auth: entry.auth,
        https: entry.https,
        cors: entry.cors,
        tags: entry.tags || [],
        added: entry.added,
      });
    }
  }

  apis.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

  writeFileSync(OUTPUT_FILE, JSON.stringify(apis, null, 2) + '\n');
  console.log(`Built catalog: ${apis.length} APIs from ${files.length} categories → ${OUTPUT_FILE}`);
}

buildCatalog();
