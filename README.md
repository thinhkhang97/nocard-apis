# nocard-apis

> Curated catalog of free APIs that don't require a credit card, with automated health monitoring.

[![Health Check](https://github.com/thinhkhang97/nocard-apis/actions/workflows/health-check.yml/badge.svg)](https://github.com/thinhkhang97/nocard-apis/actions/workflows/health-check.yml)
[![APIs](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fthinhkhang97%2Fnocard-apis%2Fmain%2Fdata%2Fapis.json&query=%24.length&label=APIs&color=blue)](https://thinhkhang97.github.io/nocard-apis/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Our Philosophy

There are plenty of "free API" lists out there. Most of them are copy-pasted from other lists, full of dead links, APIs that quietly started requiring a credit card, or services that disappeared years ago. Nobody checked. Nobody verified. The list just keeps getting longer.

**This project is different.** We value honesty over size, quality over quantity.

- **Every API is personally verified.** No copy-pasting from other lists. If it's listed here, someone has signed up, tested the endpoint, and confirmed: no credit card required.
- **We'd rather have 10 verified APIs than 1,000 unverified ones.** A smaller catalog you can trust is more valuable than a massive list you can't.
- **If an API breaks or changes its policy, we remove it.** Automated health checks run every 6 hours. We don't keep dead links around for the numbers.
- **We say what we know, and nothing more.** If we haven't tested it, it's not in the catalog.

The catalog starts empty and grows one verified API at a time. That's intentional.

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

## Browse by Use Case

APIs are tagged by what you can build with them, not by rigid categories. One API can serve many use cases.

Filter by tags like `travel`, `maps`, `weather`, `search`, `images`, `food`, `shopping`, and more on the [dashboard](https://thinhkhang97.github.io/nocard-apis/).

## Data Format

All APIs live in a single file `data/apis.yaml`:

```yaml
- name: SerpAPI
  url: https://serpapi.com/
  api_base: https://serpapi.com/status
  description: Access Google Search, Images, Maps, Places via unified API
  auth: apiKey
  https: true
  cors: false
  credit_card_required: false
  added: "2026-03-31"
  tags: [search, maps, images, places, travel, food, shopping]
```

Tags describe use cases — an API can have as many tags as applicable.

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

# View dashboard (requires a local server, file:// won't work)
npm run dev
```

## Contributing

We welcome contributions, but every API must be verified before it's accepted. See [CONTRIBUTING.md](CONTRIBUTING.md) for how to:
- Submit a new API
- Report a broken API
- Run the project locally

## License

[MIT](LICENSE)
