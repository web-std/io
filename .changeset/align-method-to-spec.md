---
"@remix-run/web-fetch": patch
---

Align with [spec](https://fetch.spec.whatwg.org/#methods) for `new Request()` `method` normalization

- Only `DELETE`, `GET`, `HEAD`, `OPTIONS`, `POST`, `PUT` get automatically uppercased
- Note that `method: "patch"` will no longer be automatically uppercased
- Throw a `TypeError` for `CONNECT`, `TRACE`, and `TRACK`
