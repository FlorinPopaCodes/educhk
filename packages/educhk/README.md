# educhk

Lightweight academic domain checker for edge workers. O(1) lookups across 25,000+ educational institution domains sourced from [JetBrains Swot](https://github.com/JetBrains/swot).

Zero dependencies. Works in Node.js, Cloudflare Workers, Deno, Bun, and browsers.

## Install

```bash
npm install educhk
```

## Usage

```js
import { isAcademic, isAbused } from 'educhk';

isAcademic('stanford.edu');          // true
isAcademic('cs.stanford.edu');       // true (walks up subdomains)
isAcademic('gmail.com');             // false
isAcademic('alumni.stanford.edu');   // false (stoplist excluded)

isAbused('gmail.com');               // true
isAbused('stanford.edu');            // false
```

## API

| Export | Description |
|---|---|
| `isAcademic(domain)` | `true` if the domain is a known academic institution. Automatically excludes stoplist domains (e.g. alumni emails). Walks up subdomains. |
| `isAbused(domain)` | `true` if the domain is flagged as commonly abused for fake signups. |
| `academicDomains` | `ReadonlySet<string>` — 25k+ academic domains |
| `abusedDomains` | `ReadonlySet<string>` — abused domains |
| `stoplistDomains` | `ReadonlySet<string>` — stoplist domains |

## How it works

Three flat JSON arrays are loaded into `Set` objects at import time for O(1) lookups. `isAcademic` walks up subdomains — `cs.stanford.edu` checks `cs.stanford.edu`, then `stanford.edu`, then `edu` — and excludes stoplist entries.

Data is synced daily from [JetBrains Swot](https://github.com/JetBrains/swot) via GitHub Actions.

## License

MIT
