---
"@remix-run/web-fetch": minor
---

Fixes redirects failing when response is chunked but empty. This is backported from https://github.com/node-fetch/node-fetch/pull/1222
