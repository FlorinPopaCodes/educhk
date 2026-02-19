# educhk

Lightweight academic domain checker for edge workers. Fast lookups across 25,000+ educational institution domains sourced from .

Zero dependencies. Works in Node.js, Cloudflare Workers, Deno, Bun, and browsers.

This package wouldn't be possible without the work of the contributor of [JetBrains Swot](https://github.com/JetBrains/swot).

## Why another package?

The are more than 10 packages that take the data from [JetBrains Swot](https://github.com/JetBrains/swot) and package it for distribution under npmjs.com.

What I found lacking about them was that they were either stale or old. This not might be very important if you target the big institutions, but if you target anything else you might have a few surprises.

Freshness of this package is important because it is also distributing the "abuse" list. Which some of you might find useful.
I did try to reduce the size as much as possible, but 490kB was the best I could do.

I optimized this package for deployment to CloudFlare, because it didn't make sense to have the whole domain list compiled for the frontend, when a milisecond request can be made

## What is different from others

- The 'stoplist' is integrated in the `isAcademic` check
- Built every morning at around 6 UTC
- Loads all the domains in memory using sets
- Optimized for speed, not memory

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
