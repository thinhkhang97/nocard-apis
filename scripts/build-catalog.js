import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

const DATA_DIR = new URL('../data', import.meta.url).pathname;
const SOURCE_FILE = join(DATA_DIR, 'apis.yaml');
const OUTPUT_FILE = join(DATA_DIR, 'apis.json');

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function buildCatalog() {
  const content = readFileSync(SOURCE_FILE, 'utf-8');
  const entries = yaml.load(content);

  if (!Array.isArray(entries)) {
    writeFileSync(OUTPUT_FILE, '[]\n');
    console.log('Built catalog: 0 APIs → ' + OUTPUT_FILE);
    return;
  }

  const apis = entries.map(entry => ({
    id: slugify(entry.name),
    name: entry.name,
    url: entry.url,
    api_base: entry.api_base,
    description: entry.description,
    auth: entry.auth,
    https: entry.https,
    cors: entry.cors,
    tags: entry.tags || [],
    added: entry.added,
  }));

  apis.sort((a, b) => a.name.localeCompare(b.name));

  writeFileSync(OUTPUT_FILE, JSON.stringify(apis, null, 2) + '\n');
  console.log(`Built catalog: ${apis.length} APIs → ${OUTPUT_FILE}`);
}

buildCatalog();
