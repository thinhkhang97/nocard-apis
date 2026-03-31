import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

const SOURCE_FILE = new URL('../data/apis.yaml', import.meta.url).pathname;

const REQUIRED_FIELDS = ['name', 'url', 'api_base', 'description', 'auth', 'https', 'cors', 'credit_card_required', 'added', 'tags'];
const VALID_AUTH = ['none', 'apiKey', 'oauth'];

function validateEntry(entry, index) {
  const errors = [];
  const prefix = `[${index}] (${entry.name || 'unnamed'})`;

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

  if (entry.tags && Array.isArray(entry.tags) && entry.tags.length === 0) {
    errors.push(`${prefix}: tags must have at least one tag`);
  }

  return errors;
}

function validate() {
  const content = readFileSync(SOURCE_FILE, 'utf-8');
  let entries;

  try {
    entries = yaml.load(content);
  } catch (e) {
    console.error(`Invalid YAML: ${e.message}`);
    process.exit(1);
  }

  if (!entries || !Array.isArray(entries)) {
    console.log('Validation passed: 0 APIs');
    return;
  }

  const allErrors = [];
  const allNames = new Set();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const name = entry.name?.toLowerCase();

    if (allNames.has(name)) {
      allErrors.push(`[${i}]: duplicate API "${entry.name}"`);
    }
    allNames.add(name);

    allErrors.push(...validateEntry(entry, i));
  }

  if (allErrors.length > 0) {
    console.error(`Validation failed with ${allErrors.length} error(s):\n`);
    for (const err of allErrors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  const allTags = [...new Set(entries.flatMap(e => e.tags || []))].sort();
  console.log(`Validation passed: ${entries.length} APIs, ${allTags.length} unique tags`);
  console.log(`Tags: ${allTags.join(', ')}`);
}

validate();
