# nocard-apis

> Curated catalog of free APIs that don't require a credit card, with automated health monitoring.

[![Health Check](https://github.com/thinhkhang97/nocard-apis/actions/workflows/health-check.yml/badge.svg)](https://github.com/thinhkhang97/nocard-apis/actions/workflows/health-check.yml)
[![APIs](https://img.shields.io/badge/APIs-35-blue)](https://thinhkhang97.github.io/nocard-apis/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Why?

Developers waste hours discovering that "free" APIs are either dead, require a credit card, have stealth rate limits, or changed their pricing. Every API in this catalog is:

- **Free** - no paid tier required
- **No credit card** - verified to not require payment info for signup
- **Health monitored** - automated checks every 6 hours

## Dashboard

Browse the live dashboard: **[thinhkhang97.github.io/nocard-apis](https://thinhkhang97.github.io/nocard-apis/)**

Features:
- Real-time health status for every API
- Search and filter by category, auth type, status
- Response time tracking
- Sort by any column

## Categories

| Category | APIs | Description |
|----------|------|-------------|
| Animals | 6 | Animal images, facts, and breed data |
| Dev Tools | 5 | Placeholder data, testing, and utilities |
| Entertainment | 6 | Movies, jokes, games, and trivia |
| Finance | 4 | Currency exchange and crypto prices |
| Geocoding | 4 | Maps, IP geolocation, and addresses |
| Open Data | 5 | Wikipedia, countries, government data |
| Science | 3 | Space, astronomy, and earthquake data |
| Weather | 2 | Weather forecasts and climate data |

## Data Format

API entries are stored as YAML in `data/categories/`. Each entry:

```yaml
- name: Open-Meteo
  url: https://open-meteo.com/en/docs
  api_base: https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=139.69&current=temperature_2m
  description: Free weather forecasts and climate analytics; no key required
  auth: none          # none | apiKey | oauth
  https: true
  cors: true
  credit_card_required: false
  added: "2026-03-31"
  tags: [weather, forecast]
```

## Programmatic Access

Use `data/apis.json` for programmatic access to the full catalog:

```bash
curl -s https://raw.githubusercontent.com/thinhkhang97/nocard-apis/main/data/apis.json | jq '.[0]'
```

Health check results are in `status/results.json`:

```bash
curl -s https://raw.githubusercontent.com/thinhkhang97/nocard-apis/main/status/results.json | jq '.up, .down'
```

## Run Locally

```bash
git clone https://github.com/thinhkhang97/nocard-apis.git
cd nocard-apis
npm install

# Validate YAML entries
npm run validate

# Build catalog (YAML -> JSON)
npm run build

# Run health checks
npm run health-check

# View dashboard
open docs/index.html
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to:
- Submit a new API
- Report a broken API
- Run the project locally

## License

[MIT](LICENSE)
