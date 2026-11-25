import type { GuideMeta } from "./types";

export interface Guide extends GuideMeta {
  /** Markdown body. Rendered at build time. */
  body: string;
}

export const GUIDES: Guide[] = [
  {
    slug: "how-to-create-a-qr-code",
    title: "How to Create a QR Code That Works",
    description:
      "A practical walkthrough: choose the right content type, decide between a permanent and a tracked code, design it, test it, and print it at the right size.",
    published: "2026-11-18",
    updated: "2026-11-18",
    readingMinutes: 7,
    body: `
A QR code is a printed instruction. Done well, it takes someone from a poster, a menu, or a business card to exactly the right place in one scan. Done badly, it leads to a broken link, a blurry pattern, or a page nobody wanted.

This guide walks through the decisions in the order they matter: what goes in the code, whether it should be permanent or counted, how to design it, and how to test before you print a thousand of them.

## 1. Decide what the code should do

The content type matters more than the design. A code that opens the wrong thing cannot be rescued by a nice gradient.

| Goal | Use | Notes |
| --- | --- | --- |
| Open a web page | Website URL | The most common and most flexible |
| Save a contact | vCard | Works offline; details are fixed once printed |
| Join a Wi-Fi network | Wi-Fi | Saves typing; the password is readable by anyone who scans |
| Open a menu or PDF | Menu or PDF | Links to a file you host elsewhere |
| Start a message | Email, SMS, or WhatsApp | Opens the app with a draft ready |
| Add an event | Event | Standard calendar entry, works offline |
| Open a map location | Location | Address or exact coordinates |
| Get paid | UPI or Crypto | Payment details are inside the code |

If you are unsure, a **Website URL** code is usually the right answer. Point it at a page you control, and you can change what that page says without changing the code.

## 2. Choose permanent or tracked

There are two honest options.

A **Direct** code stores the content inside the pattern. Reading the pattern needs no server. Text, contacts and Wi-Fi details can be read offline; web links still need a connection and a working destination. QRWright mini pages also need this site online. The pattern has no expiry, but it cannot be edited or count scans.

A **Tracked** code stores a signed QRWright short link. Scanning it forwards to your destination and adds one to an anonymous counter. You get a total and a daily graph. The destination is packed into the link itself, not stored in a database, and bots and link previews are filtered out. The tradeoff is that the code depends on \`qrcode.sritejam.com\` staying online, and it still cannot be edited after printing.

For anything that must survive for years — a plaque, a machine label, a tattoo, a permanent sign — choose Direct. For a campaign where the count matters, choose Tracked. The [static vs. dynamic guide](/guides/static-vs-dynamic-qr-codes) goes deeper.

## 3. Keep the content short

Every character becomes modules in the pattern. A short URL produces a sparse, easy-to-scan code. A 300-character URL with tracking parameters produces a dense grid of tiny squares that needs a bigger print and a better camera.

- Use the shortest address that will stay stable.
- Remove campaign parameters you don't need.
- For a vCard, fill in only the fields people actually use.
- For Wi-Fi, the network name and password are unavoidable; keep the rest simple.

## 4. Design for scanning, not for a design award

Contrast is the first rule: dark modules on a light background. Inverted codes (light modules on dark) fail on many older scanners. The second rule is the quiet zone, the blank border around the symbol. Keep at least four modules of it, and never crop it off.

You can change the shape of the modules, the eyes, and the frame, add a logo, and use gradients, as long as contrast stays high and the logo stays small. The generator's scan check runs a real decoder at several sizes. Use it, then test with real phones.

## 5. Test before you print

A screen test is not a print test. Print one copy at the final size, on the final material, and scan it with at least two phones. Try it in the lighting where it will live: a dim restaurant, a sunny window, a warehouse aisle.

Check the destination as well as the code. Open the link in a private browser window, signed out of your accounts, to catch a file that is still private or a page that only works for you.

## 6. Export the right format

- **SVG** for professional print. It stays sharp at any size.
- **PNG** at 2048 px or larger for most office printing and web use.
- **PDF** for a ready-to-print page at a measured width.
- **Print sheet** for multiple copies with cut guides.

## Common mistakes

- Printing too small for the viewing distance.
- Placing the code on a curved or reflective surface.
- Using a low-contrast color pair because it matches the brand.
- Linking to a file that is still private.
- Changing the destination after printing, which is impossible.
- Forgetting that a tracked code needs the redirect domain to stay online.

Make the content useful, keep the pattern simple, test at the final size, and a QR code becomes one of the cheapest pieces of infrastructure you own.
`,
  },
  {
    slug: "static-vs-dynamic-qr-codes",
    title: "Static vs. Dynamic QR Codes: What the Labels Really Mean",
    description:
      "Static codes store content in the pattern. Dynamic codes use a redirect. Here is what that means for permanence, editing, scan counts, privacy, and cost.",
    published: "2026-11-18",
    updated: "2026-11-18",
    readingMinutes: 6,
    body: `
The phrase "dynamic QR code" is used loosely. Sometimes it means a code whose destination can be edited. Sometimes it means a code that counts scans. Sometimes it means a subscription product. Those are different things, and mixing them up leads to bad purchasing decisions.

QRWright uses two clear labels: **Direct** and **Tracked**.

## Direct codes

A Direct code stores the content in the pattern itself. A URL, a vCard, a Wi-Fi password, a phone number — the phone reads it directly, with no redirect.

**Strengths**

- The pattern can be read offline; opening a web destination still needs a connection.
- Never expires.
- A code containing your own URL or offline data does not depend on QRWright staying online. Mini pages do.
- Cannot be silently changed by a third party.
- No privacy questions, because nothing is transmitted to a redirect service.

**Limits**

- Cannot be edited after printing.
- Cannot count scans.
- The content length affects the pattern density.

Direct is the right choice for permanent objects: signs, plaques, machine labels, product packaging, business cards, and anything that might outlive a startup.

## Tracked codes

A Tracked code stores a signed link on \`qrcode.sritejam.com\`. When someone scans, the server verifies the signature, redirects immediately, and then counts the scan in the background. The destination is inside the signed link, not in a database.

**Strengths**

- Anonymous total and daily scan counts.
- Bots and link previews are filtered out.
- The destination is not stored server-side.
- The redirect still works if the count database is down.

**Limits**

- Needs the redirect domain to stay online.
- Cannot be edited after printing. This is important: many commercial "dynamic" QR codes let you change the destination; QRWright's tracked links do not. The signature covers the destination, so editing it would break the security model.
- Counts are aggregate, not per-person analytics.

## The editing question

If you need to change where a printed code goes, you have three options:

1. **Use a URL you control.** Print a Direct code pointing at \`example.com/table-4\`, then change what that page shows or where it redirects on your own server. The QR code never changes.
2. **Replace the file at the same address.** For a PDF menu or price list, overwrite the file and keep the URL. The code opens the new version.
3. **Print a new code.** Honest, simple, and sometimes the only option.

A commercial dynamic QR service solves this by storing a short redirect in a database and letting you edit the target. That is a real convenience, but it comes with a subscription, a dependency, and a privacy cost. QRWright chooses not to store destinations, which is why tracked links are fixed.

## What about scan counts?

A Direct code cannot count scans, because there is no server in the loop. A Tracked code can count them, but only as anonymous totals. You will not see who scanned, where they were, what device they used, or whether they bought anything.

That is a deliberate trade. Aggregate counts answer "is this poster working?" without turning a restaurant menu into a tracking device.

## A simple decision table

| Situation | Recommendation |
| --- | --- |
| Permanent sign, plaque, or machine label | Direct |
| Product packaging that must work for years | Direct |
| Business card or vCard | Direct |
| Wi-Fi sign | Direct |
| Campaign poster where you want a count | Tracked |
| Menu or price list you update at the same URL | Direct, with a stable link |
| Regulated or safety-critical content | Direct |

## The bottom line

"Dynamic" is not automatically better. A static code that works forever is often more valuable than a dynamic code tied to a subscription. Choose the simplest option that meets the requirement, and be suspicious of any QR code that stops working when a company's billing fails.
`,
  },
  {
    slug: "qr-code-size-for-print",
    title: "What Size Should a QR Code Be for Print?",
    description:
      "A practical sizing guide for business cards, menus, posters, and signs, with a distance table, minimum sizes, and the print details that decide whether a code scans.",
    published: "2026-11-18",
    updated: "2026-11-18",
    readingMinutes: 6,
    body: `
There is no single correct size for a QR code. The right size depends on how far away the scanner is, how much data the code holds, and how good the contrast is. A code that fills a business card can be too small for a poster viewed from three metres, and a code that looks huge on a flyer can be too dense to scan because the URL is long.

## The distance rule

A useful starting point: the printed code should be at least one tenth of the expected scanning distance.

| Scanning distance | Minimum code width |
| --- | --- |
| 15 cm (6 in) | 1.5 cm (0.6 in) |
| 30 cm (12 in) | 3 cm (1.2 in) |
| 1 m (3 ft) | 10 cm (4 in) |
| 3 m (10 ft) | 30 cm (12 in) |
| 10 m (33 ft) | 100 cm (39 in) |

These are minimums for a clean, high-contrast code with a moderate amount of data. Add margin for dim light, a dirty surface, or a dense URL.

## Practical sizes by use

- **Business card:** 2–2.5 cm (0.8–1 in). Keep the vCard short.
- **Table tent or menu:** 3–5 cm (1.2–2 in). People scan from arm's length.
- **Flyer or poster:** 4–8 cm (1.6–3 in) for a close poster; larger for a window.
- **Shop window:** 15–30 cm (6–12 in), depending on pavement distance.
- **Yard sign:** 30–60 cm (12–24 in).
- **Trade show backdrop:** 30 cm or more, tested from the aisle.
- **Product packaging:** follow the retailer's specification; often 2.5–4 cm.

## Density matters as much as width

A code with a short URL might be 21×21 modules. A code with a long URL and high error correction might be 57×57 or more. At the same printed width, the denser code has much smaller modules, and small modules are the first thing a camera loses.

If a code must be small, shorten the content. Use a short domain, remove tracking parameters, and avoid unnecessary text. If you need a logo, keep it small and use a higher error-correction level, which also increases density. There is a real tradeoff between robustness and data.

## The quiet zone

The blank border around the symbol is part of the specification. It gives the scanner room to find the code. The standard asks for four modules; for print, keep at least that and never let a design element touch the first dark module. A code crammed against a colored edge often fails.

## Contrast and material

Dark modules on a light background are safest. A contrast ratio of at least 4:1 is a reasonable target; pure black on white is about 21:1. Avoid:

- Light gray on white.
- Yellow, lime, or pastel modules on white.
- White or light modules on a dark background (inverted codes).
- Busy photos or gradients behind the code.
- Glossy laminate that reflects scanner light.
- Curved surfaces that distort the bars.

Matte paper, uncoated card, and matte laminate usually scan better than gloss.

## Test at the final size

Print one proof at the exact final dimensions, on the exact material, and scan it with two phones from the expected distance. Then test in the actual lighting. A code that scans on a bright desk can fail under a dim pendant light or in direct sun.

If the code is on a screen, the same logic applies: make it large enough, turn up the brightness, and avoid reflections. The [scan failure guide](/guides/why-qr-codes-fail-to-scan) has a diagnostic checklist if a printed code misbehaves.
`,
  },
  {
    slug: "why-qr-codes-fail-to-scan",
    title: "Why QR Codes Fail to Scan, and How to Fix Them",
    description:
      "A diagnostic checklist for QR codes that won't scan: size, contrast, quiet zone, damage, curvature, density, logos, screen brightness, and broken links.",
    published: "2026-11-18",
    updated: "2026-11-18",
    readingMinutes: 7,
    body: `
Most QR failures are physical, not digital. The phone sees a pattern it cannot decode, or decodes it to a URL that no longer works. Work through these causes in order; the first few explain most problems.

## 1. The code is too small for the distance

A code that scans from 20 cm may fail from a metre. Use the [print size guide](/guides/qr-code-size-for-print): roughly one tenth of the scanning distance, with extra margin for dim light or dense data.

**Fix:** print larger, or shorten the content so the modules are bigger at the same width.

## 2. Contrast is too low

Cameras need a clear difference between dark and light modules. Pale brand colors, light gray text, and low-contrast gradients are common culprits. Inverted codes (light modules on a dark background) fail on many scanners, especially older ones.

**Fix:** use near-black modules on a near-white background. If you must use a brand color, test it at the final size and check the contrast ratio.

## 3. The quiet zone is missing

The blank border around the symbol is part of the specification. Designers often crop it to make the code fit a layout, or place text and graphics right against the edge.

**Fix:** keep at least four modules of clear space on every side. Don't let a frame, photo, or border touch the dark modules.

## 4. The code is damaged or dirty

Scratches, folds, smudges, stickers, and water damage all remove information. Error correction can recover some damage, but not a torn corner or a crease through the middle.

**Fix:** reprint. For outdoor signs, use weather-resistant material and a protective cover that doesn't glare.

## 5. The surface is curved or reflective

A code wrapped around a bottle or printed on glossy laminate distorts from the camera's point of view. Reflections can wipe out whole sections.

**Fix:** place the code on the flattest area, use matte material, and angle the code slightly away from direct light. On a curved object, keep the code small enough that it doesn't wrap around the curve.

## 6. The data is too dense

Long URLs, long vCards, and high error correction all increase the number of modules. At a fixed print size, more modules means smaller squares.

**Fix:** shorten the content, reduce unnecessary fields, and avoid error correction levels higher than you need. A logo already justifies a higher level; don't add H on top of a long URL "just in case."

## 7. The logo covers too much

A logo in the center removes modules. Error correction can recover a small area, but a large logo, especially one with a busy background, can push the code past its limit.

**Fix:** keep the logo under about 25% of the width, use a clean plate behind it, and test. The [logo guide](/guides/qr-codes-with-logos) has specifics.

## 8. The screen is dim or the image is blurry

A code shown on a phone depends on screen brightness, reflections, and focus. A dirty lens or a cracked screen protector can be enough to break a scan.

**Fix:** turn up the brightness, clean the lens, hold still, and move closer. If you're displaying a code at an event, print it as well.

## 9. The scanner app is the problem

Some apps only read URLs, not vCards or Wi-Fi. Some older scanners don't support inverted codes or certain 2D formats. A phone's built-in camera is usually the most capable.

**Fix:** try the native camera app, then a second app. If a dedicated scanner fails but a phone works, the scanner may have the format disabled.

## 10. The link is broken

The code can be perfect and still lead nowhere. Private files, expired domains, renamed pages, and redirect services that have gone offline are common.

**Fix:** open the destination in a private browser window, signed out. Check that the file is public, the domain resolves, and the path is correct. For tracked codes, check that the redirect domain is online.

## A quick diagnostic order

1. Scan with the native camera at the intended distance.
2. Move closer; if it works, the code is too small.
3. Try a different phone; if it works, the first phone or app is the issue.
4. Check the destination in a private window.
5. Reprint one copy larger and with more contrast.

If a code fails after all of that, regenerate it. A corrupted export or a design that pushed the encoder too far is rare, but it happens.
`,
  },
  {
    slug: "wifi-qr-code-format",
    title: "The Wi-Fi QR Code Format, Explained",
    description:
      "How Wi-Fi QR codes encode the network name, password, security type, and hidden flag, with escaping rules, examples, and the security tradeoffs.",
    published: "2026-11-18",
    updated: "2026-11-18",
    readingMinutes: 5,
    body: `
A Wi-Fi QR code lets a guest join a network without typing a long password. The phone reads a short text string, recognizes the format, and offers to connect. No app is needed on modern iOS and Android.

## The format

A Wi-Fi code contains a string like this:

\`\`\`
WIFI:T:WPA;S:My Network;P:correct horse battery staple;;
\`\`\`

The fields are:

- **T** — security type: \`WPA\`, \`WEP\`, or \`nopass\`.
- **S** — the network name (SSID).
- **P** — the password.
- **H** — \`true\` if the network is hidden; omit it otherwise.

The string ends with two semicolons. The first closes the last field, and the second terminates the record.

## Escaping special characters

The format uses semicolons and colons as separators, so those characters inside a network name or password must be escaped with a backslash:

- \`;\` becomes \`\\;\`
- \`,\` becomes \`\\,\`
- \`:\` becomes \`\\:\`
- \`"\` becomes \`\\"\`
- \`\\\` becomes \`\\\\\`

A password like \`tea;time\` is encoded as \`tea\\;time\`. The generator handles this for you, but it matters if you're building the string by hand.

## Security types

- **WPA/WPA2/WPA3:** use \`WPA\`. This is the normal choice for a password-protected network.
- **WEP:** use \`WEP\`. WEP is obsolete and insecure; avoid it if you can.
- **Open network:** use \`nopass\` and leave the password field out.

Some phones are stricter than others about WPA3 and enterprise networks. A WPA3 network may still work with \`WPA\`, but test with the phones your guests use. Enterprise networks with a username and certificate usually cannot be joined from a simple QR code.

## Hidden networks

If the SSID is hidden, add \`H:true;\`. The phone will try to join the hidden network by name. Hidden networks are not more secure; they mainly add friction, and a QR code removes some of that friction for guests.

## What the code cannot do

- **It cannot connect automatically.** The phone shows a prompt, and the person taps to join.
- **It cannot handle a captive portal.** If the network requires a browser login, the QR code only joins the Wi-Fi; the portal still appears.
- **It cannot grant access to a network the phone cannot reach.** Check the signal where the code is displayed.
- **It cannot hide the password.** Anyone who scans the code can read it with a decoder. Treat the password as public to everyone who can see the sign.

## Security advice

A Wi-Fi QR code is convenient, but it publishes the password. Use a guest network with client isolation, a separate password, and a plan to rotate it. Don't put the main office or home network password on a public sign.

If you need to change the password, print a new code. Wi-Fi codes are Direct only; there is no redirect and no scan count.

## Testing

Generate the code, scan it with an iPhone and an Android phone, and confirm the network name and security type. Join the network, then forget it and try again. If the code fails, check the escaping first, then the security type. A single unescaped semicolon in a password is enough to break the format.
`,
  },
  {
    slug: "qr-codes-with-logos",
    title: "QR Codes with Logos: How to Stay Scannable",
    description:
      "Logo size, error correction, plates, and placement. A practical guide to branded QR codes that still decode on cheap phones and printed menus.",
    published: "2026-11-18",
    updated: "2026-11-18",
    readingMinutes: 5,
    body: `
A logo in the middle of a QR code makes it recognizable. It also removes modules that the scanner needs. The trick is to remove few enough that error correction can reconstruct them, and to keep the rest of the design clean.

## How much can a logo cover?

QR codes include Reed-Solomon error correction. At level H, the code can recover about 30% of its data if part of the symbol is damaged. A logo is deliberate damage, so it should stay well inside that budget.

A practical limit is **20–25% of the code's width**, measured across the logo. At 25%, the logo covers about 6% of the area, which is comfortably inside H's budget. Larger logos can work, but the margin for print defects, glare, and cheap cameras shrinks quickly.

The generator raises error correction to H automatically when a logo is large, but that also makes the pattern denser. A dense code with a big logo is not automatically safer than a simpler code with a small logo.

## Keep the logo simple

A logo with fine text, thin lines, or a transparent background can disappear into the modules. Use a solid mark, a simple wordmark, or an icon. If the logo has a light background, add a plate behind it so the modules don't show through.

The plate options are:

- **None:** the logo sits directly on the modules. Only use this for a mark with strong, simple shapes.
- **Square or rounded:** a solid block behind the logo. Good for wordmarks.
- **Circle:** a round plate. Good for icons and profile photos.

Choose a plate color with strong contrast against the modules. A white plate on a dark code, or a dark plate on a light code, keeps the logo readable.

## Don't cover the eyes or alignment patterns

The three large squares in the corners are finder patterns. The smaller square near the bottom right is an alignment pattern. Scanners use them to locate and straighten the code. A logo in the center is safe; a logo that overlaps a corner or the alignment pattern is not.

QRWright always draws alignment patterns solid, even when the modules are styled, because a decorative alignment pattern is a common cause of scan failures.

## Test with the logo in place

The built-in scan check decodes the final design at several sizes. Use it, then test with real phones. A design that works on a flagship phone may fail on a cheaper camera or in low light.

Print a proof at the final size. A logo that looks small on a 2048 px PNG can be large on a 2 cm printed code.

## Logo file advice

- Use a PNG, SVG, or WebP with a transparent background if the mark is simple.
- Keep the file under a few megabytes; the generator downsamples it.
- Avoid photographs with lots of detail. A face works better as a circular plate than as a full-bleed image.
- Don't use a logo you don't have permission to use.

## When to skip the logo

If the code will be printed small, scanned from a distance, or placed on a curved surface, a plain code is more reliable. A logo is a branding choice, not a functional improvement. The safest code is still dark squares on a light background with a clear quiet zone.
`,
  },
  {
    slug: "qr-code-error-correction",
    title: "QR Code Error Correction: L, M, Q, and H",
    description:
      "What the four QR error-correction levels mean, how much damage they can recover, and when to use each one without making the code too dense.",
    published: "2026-11-18",
    updated: "2026-11-18",
    readingMinutes: 4,
    body: `
Every QR code contains redundant data. If part of the symbol is damaged, dirty, or covered, the scanner can use the redundancy to reconstruct the missing modules. The amount of redundancy is the error-correction level.

## The four levels

| Level | Approximate recovery | Best for |
| --- | --- | --- |
| L | About 7% | Clean digital screens and perfect print |
| M | About 15% | General use; the default |
| Q | About 25% | Print wear, small logos, outdoor use |
| H | About 30% | Large logos, harsh environments, maximum resilience |

The percentages refer to the codewords that can be restored, not a simple fraction of the physical area. Real-world damage that exceeds the level will still fail.

## The tradeoff: density

Higher error correction adds more data, which means more modules for the same content. A URL that fits in a 25×25 grid at M might need a 33×33 grid at H. At the same print size, the modules are smaller, which can make the code harder to scan.

This is why "just use H" is not always the right advice. A clean code at M with large modules can be more reliable than a dense code at H with tiny modules. The best choice depends on the print size, the surface, and the amount of damage you expect.

## What QRWright does

- **Auto** uses M by default.
- Adding a logo raises Auto to Q or H, depending on the logo size.
- You can override the level in the Advanced panel.

If a code stops scanning after you increase the level, the extra density may have hurt more than the redundancy helped. Go back to Auto and test again.

## What error correction cannot fix

- A torn-off corner that removes a finder pattern.
- A crease through the middle of the symbol.
- A logo that covers more than the level can recover.
- A print so faint that the camera sees no contrast.
- A code that is simply too small for the distance.

Error correction is a safety margin, not a license to print badly.

## Practical recommendations

- **Business cards and flyers:** Auto/M, unless you add a logo.
- **Menus and table tents:** Q if they will be handled or laminated.
- **Outdoor signs:** Q or H, with weather-resistant material.
- **Logos:** H for a large logo, Q for a small one, and test.
- **Digital screens:** M is usually enough; screen brightness matters more.

## Test the final design

The scan check in the generator decodes the actual rendered design, including your logo and colors, at several sizes. Use it as a first pass, then print a proof and test with real phones. Error correction is measured in a lab; your menu is measured in a dim restaurant.
`,
  },
  {
    slug: "vcard-qr-codes",
    title: "vCard QR Codes: Digital Business Cards That Work Offline",
    description:
      "How vCard QR codes store contact details, which fields matter, how phones handle them, and why they cannot be edited or tracked.",
    published: "2026-11-18",
    updated: "2026-11-18",
    readingMinutes: 5,
    body: `
A vCard QR code puts a contact card inside the pattern. When someone scans it, the phone offers to save the name, phone number, email, and other details to the address book. No website, no app, and no internet connection are required.

## What is inside

The code contains plain text in vCard 3.0 format:

\`\`\`
BEGIN:VCARD
VERSION:3.0
FN:Ada Lovelace
ORG:Analytical Engines
TITLE:Mathematician
TEL;TYPE=CELL:+44 20 7946 0958
EMAIL:ada@example.com
URL:https://example.com
END:VCARD
\`\`\`

Each field has a label. \`FN\` is the full name, \`ORG\` the organization, \`TEL\` a phone number, \`EMAIL\` an address, \`URL\` a website, and \`ADR\` a postal address. The generator writes the structure for you.

## Fewer fields, better codes

Every field adds characters, and every character adds modules. A card with a name, mobile number, email, and website stays compact. A card with a full address, a long note, and three phone numbers becomes dense and harder to scan at business-card size.

Choose the fields a stranger actually needs:

- Name and organization.
- One phone number and one email.
- A website or portfolio.
- A short title.

Leave out the note, the fax number, and the second address unless they earn their space.

## What happens on a phone

Modern iPhones and Android phones recognize vCard data in a QR code and show a contact preview. The person taps to save it. Some phones save directly; others ask first. Older phones may need a scanner app.

The exact labels and formatting can vary between contact apps. That is why testing on both iPhone and Android matters, especially if you're printing a box of cards.

## No editing, no tracking

A vCard code is Direct only. The details are part of the printed pattern, so:

- You cannot change a phone number after printing.
- You cannot count scans.
- You cannot redirect the code to a hosted profile.

If you need to update details or measure interest, use a **Website URL** code pointing to a contact page you control. That URL can be tracked, and you can update your own page without reprinting. QRWright **Business page** codes are fixed and cannot be tracked.

## Privacy

A vCard code is public to anyone who scans it. Don't include a personal mobile number, a home address, or an internal email unless you're comfortable with it being copied and shared. A work number and a role-based email are safer.

## Printing advice

- Put the code on the back of the card, not over a busy photo.
- Keep it at least 2 cm wide; 2.5 cm is safer.
- Use dark modules on a light background.
- Add a line like "Scan to save my contact" so people know what it does.
- Test a printed proof at actual size before ordering.

A vCard code is one of the few QR codes that works entirely offline and never expires. That makes it a good fit for a physical card, a name badge, or a conference lanyard — as long as the details are stable.
`,
  },
  {
    slug: "upc-vs-ean",
    title: "UPC vs. EAN: Which Retail Barcode Do You Need?",
    description:
      "The difference between UPC-A, UPC-E, EAN-8, and EAN-13, how the numbers relate, and what GS1 allocation means for selling a product in stores.",
    published: "2026-11-18",
    updated: "2026-11-18",
    readingMinutes: 6,
    body: `
UPC and EAN are the two retail barcode families you see at a checkout. They look similar, use the same check-digit math, and are part of one global numbering system. The differences are in length, region, and packaging.

## The short version

- **UPC-A** is a 12-digit code used mainly in the United States and Canada.
- **EAN-13** is a 13-digit code used in most other countries.
- **EAN-8** is a shorter 8-digit code for small packages.
- **UPC-E** is a compressed form of UPC-A for very small packages.

A UPC-A number can be represented as an EAN-13 by adding a leading zero. That is why many scanners read both without special handling.

## The numbers come from GS1

Retail barcodes are not arbitrary. The number is a GTIN (Global Trade Item Number) allocated through GS1 or a national member organization. It contains a company prefix, an item reference, and a check digit.

You cannot invent a GTIN for a product you sell in stores. A made-up number can collide with a real product, causing pricing, inventory, and recall problems. For internal labels, use Code 128 instead.

## Check digits

All of these formats use a modulo-10 check digit. The generator calculates it from the data digits, or verifies it if you enter the full number. A wrong check digit makes the number invalid even if the bars print perfectly.

The check digit catches typing errors, not counterfeiting. It is not a security feature.

## UPC-A vs. EAN-13

| Feature | UPC-A | EAN-13 |
| --- | --- | --- |
| Digits | 12 | 13 |
| Main region | US and Canada | Most other markets |
| Leading zero | No | Yes, for a UPC-A equivalent |
| Nominal width | 37.29 mm | 37.29 mm |
| Check digit | Modulo 10 | Modulo 10 |

If a retailer asks for UPC-A, use UPC-A. If it asks for EAN-13, use EAN-13. If you're selling internationally, check each market's requirement; some accept either, some don't.

## EAN-8 and UPC-E

EAN-8 is a separate allocation for small packages, not a truncated EAN-13. UPC-E compresses a UPC-A by removing zeros according to fixed rules; the scanner expands it back to the full number.

Use these only when the package genuinely cannot fit the full symbol, and verify the expanded number before printing. Compression is a compromise.

## ISBN and ITF-14

- **ISBN** barcodes are EAN-13 symbols built from an ISBN. They start with 978 or 979.
- **ITF-14** is a 14-digit carton code with a bearer bar, used on corrugated boxes. It is not a retail checkout code.

## Printing retail barcodes

- Keep the symbol within the allowed size range; the nominal width is about 37 mm.
- Leave the quiet zone clear.
- Print dark bars on a light background.
- Avoid curved, glossy, or textured surfaces where possible.
- Test with a real retail scanner, not just a phone.

## The bottom line

Choose the format your market and retailer require, get the number from GS1, and let the generator handle the check digit. A beautiful barcode with an unallocated number is still unusable at the till.
`,
  },
  {
    slug: "qr-code-safety",
    title: "QR Code Safety: How to Scan Without Getting Burned",
    description:
      "QR codes can hide malicious links, payment switches, and fake parking signs. Learn how to preview a destination, spot tampering, and report abuse.",
    published: "2026-11-18",
    updated: "2026-11-18",
    readingMinutes: 6,
    body: `
A QR code is a link you can't read. That is its convenience and its risk. Most codes are honest, but a sticker over a parking meter or a fake poster can send people to a phishing page or a payment address they don't control.

## The main risks

- **Phishing:** a code opens a page that looks like a bank, delivery company, or login screen.
- **Payment switching:** a sticker covers a legitimate payment code with one that pays someone else.
- **Malware:** a code opens a download or asks for permissions it doesn't need.
- **Fake notices:** a code on a parking sign, utility notice, or fine that leads to a payment page.
- **Data collection:** a code opens a form that asks for more personal information than the situation warrants.

## Before you scan

1. **Look at the physical code.** Is it a sticker on top of another sticker? Is it crooked, bubbled, or a different material from the sign? Tampering often looks slightly off.
2. **Check the context.** A code on a restaurant table should open a menu, not a login page. A code on a parking meter should lead to the city's payment site, not a random short link.
3. **Use your phone's preview.** Many camera apps show the URL before opening it. Read the domain, not just the page title.
4. **Be suspicious of shortened links.** A short link hides the destination. That isn't automatically bad, but it removes your ability to judge.

## On the page

- Check the domain in the address bar. \`paypa1.com\` is not \`paypal.com\`.
- Don't enter passwords, card numbers, or one-time codes on a page you reached from a random code.
- Don't install an app or profile just because a code asked.
- If a page asks for more data than the task requires, close it.

HTTPS is not a guarantee of honesty. Anyone can get a certificate. It only means the connection is encrypted.

## Payment codes deserve extra care

A UPI, crypto, or mobile-payment code can be replaced with a sticker. Before paying:

- Check the payee name shown by the app, not just the logo on the sign.
- Compare the UPI ID or wallet address with the one printed in text.
- Ask staff if the code looks new or unusual.
- Keep the receipt and check that the payment went to the expected name.

Crypto payments are irreversible. A wrong address is gone.

## If you run a public code

- Print on tamper-evident material or place the code behind a counter.
- Check it regularly for stickers or damage.
- Put the destination domain in text beside the code.
- Use a Direct code for permanent signs so it doesn't depend on a redirect service.
- Provide a human-readable alternative, such as a phone number or a short URL.

## How QRWright handles safety

- Direct codes never touch a server. The content is in the pattern.
- Tracked links are signed so a destination cannot be changed without invalidating the signature. Anyone can request a link to an allowed destination; a signature is not an endorsement of that website.
- Tracked destinations are checked for private addresses and invalid schemes.
- An optional Google Safe Browsing check can flag known malicious destinations when the operator configures an API key.
- Scan counts are anonymous. Destinations are not stored in the count database.
- Abusive tracked links can be disabled by count ID without affecting anyone else's codes.

No system can make every QR code safe. The best defense is a moment of skepticism before you tap.
`,
  },
  {
    slug: "qr-code-marketing-ideas",
    title: "QR Code Marketing Ideas That Actually Get Scanned",
    description:
      "Practical placements for QR codes in retail, restaurants, events, print, and packaging, with advice on offers, measurement, and avoiding QR fatigue.",
    published: "2026-11-18",
    updated: "2026-11-18",
    readingMinutes: 7,
    body: `
A QR code is not a campaign. It is a bridge between a physical moment and a digital one. The campaigns that work give people a reason to cross the bridge and make crossing it easy.

Here are placements and patterns that tend to earn scans, plus the mistakes that waste them.

## Restaurants and cafés

- **Table tents:** "Scan for the menu" at eye level, not flat on the table.
- **Specials cards:** a temporary code that counts scans, so you can compare tables or weeks.
- **Receipts:** a review request or a loyalty signup.
- **Window signs:** an after-hours menu or ordering page.
- **Takeaway packaging:** reorder link or allergy information.

Keep the menu link stable. If it changes every season, use a page you control rather than reprinting the code.

## Retail and packaging

- **Shelf talkers:** product details, sizing, or reviews.
- **Packaging inserts:** setup videos, warranty registration, or a reorder link.
- **Window decals:** "Shop online" or "Book a fitting."
- **Loyalty cards:** a code that opens the signup page.
- **Price tags:** a link to the full spec sheet for complex products.

A code on packaging has to survive shipping and handling. Test on the actual material, and don't place it across a fold.

## Events and venues

- **Badges:** a link to the schedule or speaker bios.
- **Posters:** tickets, directions, or the full programme.
- **Table cards:** a feedback form or a photo album.
- **Slides:** a code on the last slide is easier than reading a URL aloud.
- **Signage:** a map of the venue or the next session.

For events, test the venue's Wi-Fi and mobile signal. A code that opens a heavy page on a congested network is a bad experience.

## Print and direct mail

- **Flyers:** a landing page with the offer, not the homepage.
- **Magazine ads:** a product page or a video.
- **Business cards:** a vCard or a portfolio.
- **Postcards:** a booking page or a map.
- **Catalogues:** a reorder or sizing page.

Print codes at a size that matches the reading distance. A code in a magazine is often scanned from 30–40 cm; a poster from a metre or more.

## Give people a reason

"Scan here" is not a reason. A specific promise works better:

- "Scan for today's specials."
- "Scan to save 10% on your next order."
- "Scan to see the full menu and allergens."
- "Scan to book a table."
- "Scan to add the event to your calendar."

If the reward is a discount, say so. If it's information, say what information. Vague codes get ignored.

## Make it easy

- Put the code where a phone can reach it, at a comfortable height.
- Avoid glare, curves, and busy backgrounds.
- Keep the code at least 3 cm wide for arm's-length scanning.
- Add a short instruction and, if relevant, a fallback URL.
- Don't require an app install for a simple task.

## Measure what you can

Use a Tracked code when you need to compare placements or campaigns. A daily scan count is enough to answer "is this working?" without collecting personal data.

Be careful with attribution. A scan is not a sale. If you need to connect scans to revenue, use a dedicated landing page with its own offer or a promo code, and compare the results.

## Avoid QR fatigue

Not every surface needs a code. A code on a moving vehicle, a dark menu, or a crowded poster is often wasted. Choose the one place where someone is most likely to act, and make that code excellent.

A good rule: if you can't explain in one sentence what the scan gives the person, don't print it.
`,
  },
  {
    slug: "barcode-types-explained",
    title: "Barcode Types Explained: A Practical Guide",
    description:
      "1D vs. 2D barcodes, retail vs. logistics formats, check digits, and a comparison of Code 128, EAN, UPC, Data Matrix, QR, PDF417, and more.",
    published: "2026-11-18",
    updated: "2026-11-18",
    readingMinutes: 8,
    body: `
Barcodes are not interchangeable. A format that is perfect for a shipping label can be rejected at a retail checkout, and a code that holds a URL may be the wrong choice for a laser-marked metal part.

This guide groups the common formats by job, explains the difference between 1D and 2D, and gives a practical way to choose.

## 1D vs. 2D

**1D (linear)** barcodes are a single row of bars and spaces. They hold a short string, usually digits or a compact alphanumeric ID. They are fast to scan, cheap to print, and easy to understand. Examples: Code 128, EAN-13, UPC-A, Code 39, ITF-14.

**2D** barcodes use a grid of modules. They hold much more data and can include error correction. Examples: QR Code, Data Matrix, PDF417, Aztec.

A 1D code is usually the right choice for a product number or asset ID. A 2D code is better when you need a URL, a contact card, a long serial, or data that must survive damage.

## Retail formats

- **UPC-A:** 12 digits, US and Canada.
- **UPC-E:** compressed UPC-A for tiny packages.
- **EAN-13:** 13 digits, most other markets.
- **EAN-8:** short code for small packages.
- **ISBN:** EAN-13 built from a book number, starting 978 or 979.

Retail numbers come from GS1. Don't invent one for a product sold in stores. Use the check digit the generator calculates, and follow the retailer's size and placement rules.

## Logistics and industrial formats

- **Code 128:** full ASCII, compact, mandatory check character. The general-purpose workhorse.
- **GS1-128:** Code 128 with GS1 Application Identifiers for batches, dates, and serials.
- **ITF-14:** 14-digit carton code with a bearer bar, for corrugated boxes.
- **Interleaved 2 of 5:** numeric, even-length, common in warehouses. No mandatory check digit.
- **Data Matrix:** tiny 2D code for parts, electronics, and medical devices.
- **GS1 Data Matrix:** Data Matrix with GS1 AIs, used for healthcare UDI.
- **PDF417:** stacked 2D code for IDs, licences, and documents.
- **Aztec:** compact 2D code for tickets and transit, no quiet zone needed.

## Legacy and niche formats

- **Code 39:** uppercase and digits, self-checking, wide. Still used on badges and older systems.
- **Code 93:** denser than Code 39, two check characters.
- **Codabar:** numeric with start/stop letters, used in labs and libraries.
- **MSI Plessey:** numeric shelf and inventory code, no built-in check digit.
- **Pharmacode:** a number from 3 to 131070, used on pharmaceutical packaging lines.

These formats exist because older systems still use them. For a new project, Code 128 or a 2D code is usually a better choice.

## Check digits

A check digit is a calculated digit that catches typing and scanning errors. Retail formats (EAN, UPC, ITF-14) require one. Code 128 and Code 93 include check characters automatically. Code 39, Codabar, MSI, and Interleaved 2 of 5 do not require one by default.

If your data is safety-critical, use a format with built-in checking or add a check digit at the system level. A barcode that scans is not necessarily a barcode that scanned correctly.

## How to choose

1. **What does the receiving system require?** Start here. A warehouse or retailer may specify the format.
2. **How much data?** A short ID fits a 1D code; a URL or a long record needs 2D.
3. **What surface?** Paper labels suit most formats; direct part marking needs Data Matrix or a durable 2D mark.
4. **How much damage?** 2D codes with error correction are more resilient, but print quality still matters.
5. **Who owns the number?** Retail GTINs come from GS1; internal IDs can be your own.

## Printing basics

- Keep bars dark and the background light.
- Leave the quiet zone clear.
- Print at 300 dpi or use SVG.
- Test with the scanner used in production, not just a phone.
- Avoid glossy, curved, or textured surfaces when possible.

The best barcode is the one the receiving system can read, printed cleanly at the right size. Everything else is decoration.
`,
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
