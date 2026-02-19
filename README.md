# educhk

Lightweight academic domain checker for edge workers. Fast lookups across 25,000+ educational institution domains sourced from [JetBrains Swot](https://github.com/JetBrains/swot).

This package wouldn't be possible without the work of the contributor of [JetBrains Swot](https://github.com/JetBrains/swot).

## Demo

https://educhk.florin-popa-codes.workers.dev is available for testing, side-projects or startups for a reasonable amount of records.

Deploying this to your account should cost almost nothing.

## Install

```bash
npm install educhk
```

## Usage

```js
import { isAcademic } from 'educhk';

isAcademic('stanford.edu');          // true
isAcademic('cs.stanford.edu');       // true (walks up subdomains)
isAcademic('gmail.com');             // false
isAcademic('alumni.stanford.edu');   // false (stoplist domains are excluded)
```

### Raw Sets

If you need direct access to the domain sets:

```js
import { academicDomains, abusedDomains, stoplistDomains } from 'educhk';

academicDomains.has('stanford.edu'); // true
```

## API

| Export | Description |
|---|---|
| `isAcademic(domain)` | Returns `true` if the domain is a known academic institution (automatically excludes stoplist domains like alumni emails) |
| `isAbused(domain)` | Returns `true` if the domain is flagged as commonly abused for fake signups |
| `academicDomains` | `ReadonlySet<string>` of all academic domains |
| `abusedDomains` | `ReadonlySet<string>` of all abused domains |
| `stoplistDomains` | `ReadonlySet<string>` of all stoplist domains (e.g. alumni subdomains) |

## Live API

A Cloudflare Worker is deployed at:

```
GET https://educhk.florin-popa-codes.workers.dev/<domain>
```

```bash
curl https://educhk.florin-popa-codes.workers.dev/stanford.edu
# {"domain":"stanford.edu","academic":true}

curl https://educhk.florin-popa-codes.workers.dev/gmail.com
# {"domain":"gmail.com","academic":false}
```

## How it works

Domain data is sourced from the [JetBrains Swot](https://github.com/JetBrains/swot) repository and flattened into three JSON arrays (academic, abused, stoplist). At runtime these are loaded into `Set` objects for O(1) lookups. The helper functions walk up subdomains automatically — `cs.stanford.edu` checks `cs.stanford.edu`, then `stanford.edu`, then `edu`.

A daily GitHub Action syncs the latest Swot data, publishes a new npm version, and deploys the worker.

## Project structure

```
packages/educhk/    # npm package (the library)
worker/             # Cloudflare Worker (live API)
scripts/            # Data sync from JetBrains Swot
```

## Development

```bash
pnpm install
pnpm sync           # Pull latest Swot data and generate JSON files
pnpm build          # Build the npm package
pnpm test           # Run worker tests
pnpm deploy         # Deploy the Cloudflare Worker
```

## License

MIT
