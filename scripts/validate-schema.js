import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import yaml from 'js-yaml';

const CATEGORIES_DIR = new URL('../data/categories', import.meta.url).pathname;

const REQUIRED_FIELDS = ['name', 'url', 'api_base', 'description', 'auth', 'https', 'cors', 'credit_card_required', 'added', 'tags'];
const VALID_AUTH = ['none', 'apiKey', 'oauth'];

function validateEntry(entry, file, index) {
  const errors = [];
  const prefix = `${file}[${index}] (${entry.name || 'unnamed'})`;

  for (const field of REQUIRED_FIELDS) {
    if (entry[field] === undefined || entry[field] === null) {
      errors.push(`${prefix}: missing required field "${field}"`);
    }
  }

  if (entry.auth && !VALID_AUTH.includes(entry.auth)) {
    errors.push(`${prefix}: invalid auth "${entry.auth}", must be one of: ${VALID_AUTH.join(', ')}`);
  }

  if (entry.credit_card_required !== false) {
    errors.push(`${prefix}: credit_card_required must be false`);
  }

  if (entry.url && !/^https?:\/\//.test(entry.url)) {
    errors.push(`${prefix}: url must start with http:// or https://`);
  }

  if (entry.api_base && !/^https?:\/\//.test(entry.api_base)) {
    errors.push(`${prefix}: api_base must start with http:// or https://`);
  }

  if (entry.added && !/^\d{4}-\d{2}-\d{2}$/.test(entry.added)) {
    errors.push(`${prefix}: added must be YYYY-MM-DD format`);
  }

  if (entry.tags && !Array.isArray(entry.tags)) {
    errors.push(`${prefix}: tags must be an array`);
  }

  return errors;
}

function validate() {
  const files = readdirSync(CATEGORIES_DIR).filter(f => f.endsWith('.yaml'));
  const allErrors = [];
  const allIds = new Set();
  let totalApis = 0;

  for (const file of files) {
    const content = readFileSync(join(CATEGORIES_DIR, file), 'utf-8');
    let entries;

    try {
      entries = yaml.load(content);
    } catch (e) {
      allErrors.push(`${file}: invalid YAML - ${e.message}`);
      continue;
    }

    if (!Array.isArray(entries)) {
      allErrors.push(`${file}: must be a YAML array`);
      continue;
    }

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      totalApis++;

      const id = `${basename(file, '.yaml')}/${entry.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      if (allIds.has(id)) {
        allErrors.push(`${file}[${i}]: duplicate API "${entry.name}"`);
      }
      allIds.add(id);

      allErrors.push(...validateEntry(entry, file, i));
    }
  }

  if (allErrors.length > 0) {
    console.error(`Validation failed with ${allErrors.length} error(s):\n`);
    for (const err of allErrors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log(`Validation passed: ${totalApis} APIs in ${files.length} categories`);
}

validate();
