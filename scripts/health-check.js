import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const APIS_FILE = join(ROOT, 'data', 'apis.json');
const STATUS_DIR = join(ROOT, 'status');
const RESULTS_FILE = join(STATUS_DIR, 'results.json');
const HISTORY_DIR = join(STATUS_DIR, 'history');

const TIMEOUT_MS = 10_000;
const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 500;
const USER_AGENT = 'nocard-apis-health-check/1.0';

function classify(statusCode, responseTimeMs) {
  if (statusCode === 429) return 'rate-limited';
  if (statusCode >= 200 && statusCode < 400) {
    return responseTimeMs > 5000 ? 'degraded' : 'up';
  }
  return 'down';
}

async function checkApi(api) {
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(api.api_base, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json, text/plain, */*',
      },
      redirect: 'follow',
    });

    clearTimeout(timeout);
    const responseTimeMs = Math.round(performance.now() - start);

    return {
      status: classify(response.status, responseTimeMs),
      status_code: response.status,
      response_time_ms: responseTimeMs,
      checked_at: new Date().toISOString(),
    };
  } catch (err) {
    return {
      status: 'down',
      status_code: null,
      response_time_ms: null,
      checked_at: new Date().toISOString(),
      error: err.name === 'AbortError' ? 'Timeout' : err.message,
    };
  }
}

async function checkBatch(apis) {
  const results = await Promise.allSettled(apis.map(api => checkApi(api)));
  return results.map(r => r.status === 'fulfilled' ? r.value : {
    status: 'down',
    status_code: null,
    response_time_ms: null,
    checked_at: new Date().toISOString(),
    error: r.reason?.message || 'Unknown error',
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const apis = JSON.parse(readFileSync(APIS_FILE, 'utf-8'));
  console.log(`Checking ${apis.length} APIs...`);

  const results = {};
  let upCount = 0;
  let downCount = 0;
  let degradedCount = 0;

  for (let i = 0; i < apis.length; i += BATCH_SIZE) {
    const batch = apis.slice(i, i + BATCH_SIZE);
    const batchResults = await checkBatch(batch);

    for (let j = 0; j < batch.length; j++) {
      const api = batch[j];
      const result = batchResults[j];
      results[api.id] = result;

      const icon = result.status === 'up' ? '✓' : result.status === 'degraded' ? '~' : '✗';
      console.log(`  ${icon} ${api.name} (${result.status}) ${result.response_time_ms != null ? result.response_time_ms + 'ms' : result.error || ''}`);

      if (result.status === 'up') upCount++;
      else if (result.status === 'degraded') degradedCount++;
      else downCount++;
    }

    if (i + BATCH_SIZE < apis.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  const output = {
    last_run: new Date().toISOString(),
    total: apis.length,
    up: upCount,
    degraded: degradedCount,
    down: downCount,
    results,
  };

  if (!existsSync(STATUS_DIR)) mkdirSync(STATUS_DIR, { recursive: true });
  writeFileSync(RESULTS_FILE, JSON.stringify(output, null, 2) + '\n');
  console.log(`\nResults: ${upCount} up, ${degradedCount} degraded, ${downCount} down`);
  console.log(`Written to ${RESULTS_FILE}`);

  // Save daily snapshot
  if (!existsSync(HISTORY_DIR)) mkdirSync(HISTORY_DIR, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const historyFile = join(HISTORY_DIR, `${today}.json`);
  writeFileSync(historyFile, JSON.stringify(output, null, 2) + '\n');
}

run();
