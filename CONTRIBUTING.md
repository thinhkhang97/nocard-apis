# Contributing to nocard-apis

Thanks for helping keep this catalog accurate and growing!

## Submit a New API

### Option 1: GitHub Issue (easiest)

1. Go to [Submit API](https://github.com/thinhkhang97/nocard-apis/issues/new?template=submit-api.yml)
2. Fill out the form
3. A maintainer will verify and add it

### Option 2: Pull Request

1. Fork the repo and clone it
2. Add your API to the appropriate YAML file in `data/categories/`
3. Follow this format:

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
  tags: [category, relevant, tags]
```

4. Run validation:

```bash
npm install
npm run validate
```

5. Submit a PR

### Requirements

Every API must:
- Be **free** to use (free tier is fine)
- **Not require a credit card** for signup or usage
- Have a working `api_base` endpoint that returns a response
- Support **HTTPS** (strongly preferred)

## Report a Broken API

If an API is down, now requires a credit card, or has been discontinued:

1. Go to [Report Broken API](https://github.com/thinhkhang97/nocard-apis/issues/new?template=report-broken.yml)
2. Fill out the form

Or open a PR removing/updating the entry.

## Add a New Category

1. Create a new YAML file in `data/categories/` (e.g., `music.yaml`)
2. Add the category to `data/meta.yaml`
3. Add at least 3 APIs to the new category
4. Submit a PR

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
open docs/index.html
```

## Code of Conduct

Be respectful and constructive. We're all here to help developers find free APIs.
