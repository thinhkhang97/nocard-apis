# Contributing to nocard-apis

Thanks for helping keep this catalog accurate and growing!

## Submit a New API

### Option 1: GitHub Issue (easiest)

1. Go to [Submit API](https://github.com/thinhkhang97/nocard-apis/issues/new?template=submit-api.yml)
2. Fill out the form
3. A maintainer will verify and add it

### Option 2: Pull Request

1. Fork the repo and clone it
2. Add your API to `data/apis.yaml`:

```yaml
- name: API Name
  url: https://docs.example.com
  api_base: https://api.example.com/v1/endpoint
  description: One-line description of the API
  auth: none          # none | apiKey | oauth
  https: true
  cors: true
  credit_card_required: false
  added: "YYYY-MM-DD"
  tags: [use-case, tags, here]
```

3. Run validation:

```bash
npm install
npm run validate
```

4. Submit a PR

### Tags

Tags describe **use cases** — what you can build with the API. An API can have many tags. Use existing tags when possible, or introduce new ones if needed.

Examples: `travel`, `maps`, `weather`, `search`, `images`, `food`, `shopping`, `news`, `finance`

### Requirements

Every API must:
- Be **free** to use (free tier is fine)
- **Not require a credit card** for signup or usage
- Have a working `api_base` endpoint that returns a response
- Support **HTTPS** (strongly preferred)
- Be **personally tested** by the submitter

## Report a Broken API

If an API is down, now requires a credit card, or has been discontinued:

1. Go to [Report Broken API](https://github.com/thinhkhang97/nocard-apis/issues/new?template=report-broken.yml)
2. Fill out the form

Or open a PR removing/updating the entry.

## Development

```bash
# Install dependencies
npm install

# Validate all YAML entries
npm run validate

# Build catalog (YAML -> JSON)
npm run build

# Run health checks locally
npm run health-check

# View dashboard
npm run dev
```

## Code of Conduct

Be respectful and constructive. We're all here to help developers find free APIs.
