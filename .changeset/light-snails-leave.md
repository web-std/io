---
"@remix-run/web-fetch": patch
---

If you create a FormData object on the browser with empty file input, a default empty file entry (i.e. new File([], '')) would be generated. However, this is currently presented as an empty string instead when you read it on the server. This should fix the discrepancy.
