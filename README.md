# QRWright

Free, local-first QR and barcode workshop for `https://qrcode.sritejam.com`.

- 20 QR types, 36 decode-tested design templates, 18 barcode formats
- Colors, gradients, shapes, logos, frames and real browser scan checks
- SVG, PNG, PDF, JPEG and WebP exports; A4/Letter QR print sheets
- Bulk CSV → ZIP (up to 500 Direct QR codes); camera/image QR scanner
- IndexedDB library with rename, QR restyling, re-export, backup/import
- Signed self-contained redirects; anonymous total and daily scan counts
- 61 sitemap URLs, including 20 QR pages, 18 barcode pages and 12 guides
- No accounts, ads, watermarks, uploaded files or cloud library

## Local development

Node.js 22+ and npm:

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. For local tracked-link and mini-page testing, set both `NEXT_PUBLIC_*_URL` values to that origin before starting. Development has an in-memory count store and a development-only signing secret. Production has neither fallback unless explicitly configured.

```powershell
npm test
npm run typecheck
npm run lint
npm run build
npm run test:browser
```

Browser checks start a temporary production server on port 3100 with an isolated **in-memory** counter and a test-only key, exercise the UI and APIs, and close the server. They require a local Playwright-compatible Chromium; set `BROWSER_PATH` if it isn't discoverable. `TEST_PORT` can override the port. Output goes to ignored `.artifacts/browser/`.

## Zero-cost deployment

This project has no billing integration or paid dependency. Keep the existing `qrcode.sritejam.com` subdomain; no new domain is needed. Deployment still needs the owner's hosting account, DNS access and free count database credentials. No account or deployment is created by this repository.

1. Use an eligible free Next.js hosting plan (the intended target is Vercel Hobby) and a Turso free database. Stay on free plans; do not enable paid upgrades or usage-based billing. Review the host's current eligibility and quotas before publishing. Vercel Hobby has restrictions on commercial hosting; the tool allowing commercial exports is a separate matter.
2. Push this repository to your Git provider and import it into the hosting dashboard. Framework: Next.js. Install: `npm ci`. Build: `npm run build`.
3. Set the variables from `.env.example`. Keep the two public URL values at `https://qrcode.sritejam.com` for the production build. Public environment variables are baked into client bundles and need a rebuild when changed.
4. Generate `TOKEN_SECRET` and `CRON_SECRET` with 32 random bytes each. Store them as server-only environment variables. Never prefix secrets with `NEXT_PUBLIC_`.
5. Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`. The application creates `scan_totals` and `scan_daily` on first use. No destination table exists.
6. Configure a real public contact email or GitHub URL. Without either, Contact honestly says no channel is configured.
7. Add `qrcode.sritejam.com` in the host's domain settings and apply the DNS record the host supplies in the existing domain's DNS zone. Wait for HTTPS validation.
8. Deploy and verify QR downloads, `/sitemap.xml`, a fresh tracked redirect and its daily count. Do not print production Tracked codes until the domain and signing keys are final.

The daily Vercel cron in `vercel.json` calls the authenticated prune endpoint. `CRON_SECRET` is required in production. Other hosts can call it with `Authorization: Bearer <CRON_SECRET>`. Redirects also occasionally prune old daily rows. A cron does not promise exact deletion at the 90-day boundary during outages.

Free-tier limits are finite. A database outage pauses counts; it must not block redirects. A hosting outage affects Tracked links and mini pages. Direct codes containing your own URL or offline data do not depend on this deployment. There is no automatic paid fallback.

## Data and tracking model

- **Direct:** payload inside the pattern. No expiry imposed by QRWright, no counting, no destination editing. Web links still need their destination online.
- **Tracked:** `/r/<token>` carries a version, key ID, random nonce, destination and truncated HMAC-SHA256 signature. The random nonce supplies the counter ID. Destination changes invalidate the signature. Tokens are encoded, **not encrypted**.
- **Mini pages:** `/p#<compressed-data>` renders business/contact, multiple social links or app-store choices from the URL fragment. Content is not stored on a server. Mini pages need this site online. Business/multi-profile pages are not trackable.
- **Persistence:** `scan_totals(id,total)` including `_all`; `scan_daily(id,day,n)`. No IP, user-agent, device, location, destination, content or design columns.
- **Filtering:** bots, HEAD requests and prefetch/preview hints are excluded. Short-lived in-memory hashes suppress double opens. This is approximate link-open counting, not unique visitor analytics.
- **Failure isolation:** verification and redirect creation do not query the database. Counting runs in Next.js `after()` and catches failures, including client initialization.
- **Local library:** IndexedDB `qrwright`, store `codes`. Import validates and sanitizes the entire backup before writing. Existing IDs are kept. Deleting a local item doesn't disable its link or remove the server counter.

All public counter endpoints are read-only. Anyone with a tracked link/count ID can see its anonymous count. The signing endpoint is rate-limited in process memory; serverless instances do not share the limiter. For production abuse controls, use any included host controls without adding paid services. `BLOCKED_COUNT_IDS` can disable reported abusive links; redeploy/restart after changing it.

Application code does not log payloads. A host still processes IP addresses and requested URLs and may keep operational logs; signed URLs carry encoded destinations. Review hosting log settings and retention. Optional Safe Browsing sends destinations to Google only when a key is configured.

## Signing-key rotation

`TOKEN_SECRET` is key 0. Add `TOKEN_SECRET_1` through `TOKEN_SECRET_7` and set `TOKEN_ACTIVE_KEY_ID` to the new key number for new links. **Keep all old keys**: deleting/replacing one breaks every printed code signed with it. Back up keys securely outside this repository.

## Structure

```text
src/app/                   Public pages, API routes, /r and /p
src/components/studio/     QR and barcode generators, design controls
src/components/tools/      Bulk, scanner and local code library
src/content/               Typed tool content and Markdown guides
src/lib/qr/                Shared SVG/canvas scene engine
src/lib/payload/           Content encoders and mini-page packing
src/lib/tracking/          Tokens, URL validation and client API
src/lib/server/            Counter adapters, filtering and keys
src/lib/export/            Download and print helpers
tests/                     Decoder, encoder, token, route and data tests
scripts/                   Reproducible brand assets and browser checks
```

The UI is English. Tool definitions, labels and content are centralized for future translation; routes and metadata currently declare English only. `npm run assets` regenerates icons and the social preview from local vector source without external services.

The previous app remains at `E:\QR-Code-and-Barcode-Generator-main`. Keep that backup until production deployment has been verified.
