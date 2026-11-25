import type { BarcodePage } from "./types";

export const barcodePages: BarcodePage[] = [
  {
    slug: "code-128",
    metaTitle: "Code 128 Barcode Generator, Free and Customizable",
    metaDescription:
      "Create Code 128 barcodes for labels, assets, and shipping. Full ASCII support, automatic check character, PNG, SVG, and PDF downloads. Free, no sign-up.",
    h1: "Code 128 Barcode Generator",
    lede:
      "Code 128 packs the full printable ASCII set into a compact barcode, which is why it is the default choice for shipping labels, asset tags, and internal tracking.",
    steps: [
      { title: "Enter your data", text: "Type or paste up to 80 printable ASCII characters. Uppercase, lowercase, digits, and punctuation are all supported." },
      { title: "Adjust the look", text: "Set the module width, bar height, colors, and whether to print the data as text below the bars." },
      { title: "Download and test", text: "Export PNG, SVG, or PDF, then scan the printed proof with the scanner your team actually uses." },
    ],
    sections: [
      {
        heading: "Why Code 128 is everywhere",
        body: [
          "Code 128 is a linear symbology that encodes the full 128-character ASCII set, including lowercase letters. That makes it far more flexible than older codes such as Code 39, which only cover uppercase and a handful of symbols.",
          "It is also dense. Code 128 uses three character sets and switches between them automatically, so a mixed string like `SKU-2026-A19` takes fewer bars than the same data in Code 39. Fewer bars means a narrower label or a larger module width in the same space.",
          "Every Code 128 symbol includes a mandatory modulo-103 check character. The encoder calculates it, so you only enter the data. The check character is part of the symbol and is not printed as readable text.",
        ],
      },
      {
        heading: "Where to use it, and where not to",
        body: ["Code 128 is a general-purpose code, not a retail product code. Use it for internal and logistics data:"],
        list: [
          "**Asset tags:** `IT-LAPTOP-0042` on equipment",
          "**Shipping labels:** order numbers, parcel IDs, and routing codes",
          "**Inventory:** bin locations, batch numbers, and serials",
          "**Tickets:** booking references that mix letters and digits",
          "**Documents:** file numbers for scanning and archiving",
        ],
      },
      {
        heading: "Printing Code 128 so it scans",
        body: [
          "Keep the bars dark and the background light. A quiet zone of at least ten narrow modules on each side is part of the specification; the generator adds a margin, but don't crop it off in a design tool.",
          "Module width matters more than overall size. A long Code 128 symbol printed 2 cm wide has very thin bars and may fail on a cheap laser scanner. If the label is small, shorten the data before shrinking the bars.",
          "Test at the final size, on the final material. A code that scans on a bright screen can fail on a glossy label or a curved bottle. If you print on corrugated cardboard, avoid placing the code across a fold.",
        ],
      },
    ],
    tips: [
      "Keep data under about 20 characters when the label is small; shorter symbols have wider bars.",
      "Use uppercase and digits for asset tags to make them easier to read and type.",
      "Leave the quiet zone intact. Don't let a design element touch the first or last bar.",
      "Print at 300 dpi or use the SVG for professional printing.",
      "Scan the final printed label with the same scanner model your staff use.",
    ],
    faqs: [
      { q: "Does Code 128 need a check digit?", a: "Yes, a modulo-103 check character is required. The generator adds it automatically, so you only enter your data." },
      { q: "Can Code 128 encode lowercase letters?", a: "Yes. It supports the full printable ASCII set, including lowercase, digits, and punctuation." },
      { q: "Is Code 128 the same as GS1-128?", a: "No. GS1-128 is a variant that uses Code 128 symbology with GS1 Application Identifiers for supply-chain data. Use GS1-128 when trading partners require GS1 standards." },
      { q: "How long can a Code 128 barcode be?", a: "The symbology can hold more, but practical labels keep it under about 40 characters. This generator caps input at 80 characters so the bars stay printable." },
      { q: "Why won't my printed Code 128 scan?", a: "The usual causes are bars that are too thin, a missing quiet zone, low contrast, or a glossy surface. Increase the module width and test again." },
    ],
    facts: [
      { label: "Characters", value: "95 printable ASCII characters in this tool" },
      { label: "Length", value: "Variable; practical limit about 40 characters" },
      { label: "Check character", value: "Modulo 103, required" },
      { label: "Quiet zone", value: "At least 10 narrow modules each side" },
      { label: "Typical use", value: "Shipping, assets, inventory, tickets" },
    ],
  },
  {
    slug: "gs1-128",
    metaTitle: "GS1-128 Barcode Generator with Application Identifiers",
    metaDescription:
      "Make GS1-128 barcodes with Application Identifiers for batches, dates, and serial numbers. Enter AIs in parentheses and download PNG, SVG, or PDF. Free.",
    h1: "GS1-128 Barcode Generator",
    lede:
      "GS1-128 is the supply-chain version of Code 128. It carries structured data such as batch numbers, expiry dates, and serials using GS1 Application Identifiers.",
    steps: [
      { title: "Enter the data with AIs", text: "Write each Application Identifier in parentheses, for example `(01)09521234543213(17)261231(10)ABC123`." },
      { title: "Check the structure", text: "The generator validates parentheses and the AI pattern. Confirm the GTIN, date, and batch values against your source data." },
      { title: "Print and verify", text: "Download the symbol, print a proof, and scan it with a GS1-capable scanner to confirm the AIs parse correctly." },
    ],
    sections: [
      {
        heading: "What the parentheses mean",
        body: [
          "Application Identifiers are numeric prefixes that tell a scanner what the following data means. `(01)` is a GTIN, `(17)` is an expiry date in YYMMDD form, `(10)` is a batch or lot number, and `(21)` is a serial number.",
          "The parentheses are for humans. They are not encoded in the barcode. The encoder converts each AI into the correct GS1 function character and data structure. Entering the parentheses is how you tell the generator where each field starts.",
          "Fixed-length fields don't need a separator. Variable-length fields, such as a batch number followed by another AI, are terminated with a special function character. The encoder handles that when you write the AIs in order.",
        ],
      },
      {
        heading: "You need GS1-issued numbers",
        body: [
          "A GS1-128 barcode is only meaningful if the numbers inside it are allocated properly. GTINs come from GS1 or your national member organization, and company prefixes are licensed. Inventing a GTIN can collide with a real product and cause serious supply-chain errors.",
          "If you are learning the format or building an internal test, use clearly fake data and label it as a test. Don't send a test symbol to a trading partner or print it on saleable goods.",
          "The check digit inside a GTIN is part of the number. If you enter a GTIN with a wrong check digit, scanners and trading partners may reject it even if the barcode itself renders.",
        ],
      },
      {
        heading: "Where GS1-128 fits",
        body: ["GS1-128 is common wherever a trading partner needs more than a product number:"],
        list: [
          "**Logistics labels:** SSCC, ship-to, and handling units",
          "**Food and pharma:** batch, production date, expiry, and quantity",
          "**Serialized goods:** unique serial numbers for warranty or traceability",
          "**Returns:** original order and return authorization references",
          "**Healthcare:** UDI and lot tracking, often alongside GS1 Data Matrix",
        ],
      },
    ],
    tips: [
      "Get GTINs and company prefixes from GS1; never make them up for real products.",
      "Write AIs in a consistent order and check the date format: YYMMDD for `(17)`.",
      "Use a scanner that reports AIs separately, not just a raw string.",
      "Test the symbol with your trading partner's label specification before a print run.",
      "For healthcare, check whether the recipient requires GS1 Data Matrix instead of GS1-128.",
    ],
    faqs: [
      { q: "Do I type the parentheses into the barcode?", a: "You type them in the generator to mark the AIs. They are not encoded as characters in the symbol; the encoder converts them into the GS1 structure." },
      { q: "Do I need a GS1 company prefix?", a: "For real products, yes. GTINs and company prefixes are licensed through GS1. Invented numbers can collide with real products." },
      { q: "What is the difference between GS1-128 and Code 128?", a: "GS1-128 uses Code 128 symbology but follows GS1 rules for Application Identifiers, data formatting, and separators." },
      { q: "Can I encode an expiry date?", a: "Yes. Use `(17)` followed by six digits in YYMMDD form, for example `(17)261231` for 31 December 2026." },
      { q: "Why does my scanner show odd characters?", a: "Variable-length AIs are separated by a GS1 function character. Some scanners display it as a symbol or hide it. Use a GS1-aware scanner or parser." },
    ],
    facts: [
      { label: "Symbology", value: "Code 128 with GS1 Application Identifiers" },
      { label: "Data", value: "Structured AIs, e.g. (01), (17), (10), (21)" },
      { label: "Check character", value: "Modulo 103, required" },
      { label: "Separators", value: "GS1 function character after variable-length fields" },
      { label: "Typical use", value: "Logistics, food, pharma, traceability" },
    ],
  },
  {
    slug: "code-39",
    metaTitle: "Code 39 Barcode Generator, Free and Simple",
    metaDescription:
      "Create Code 39 barcodes for badges, assets, and legacy systems. Supports A-Z, digits, and a few symbols, with no mandatory check digit. Free, no sign-up.",
    h1: "Code 39 Barcode Generator",
    lede:
      "Code 39 is one of the oldest and simplest barcodes. It is self-checking, easy to print, and still common in badges, libraries, and older industrial systems.",
    steps: [
      { title: "Enter uppercase data", text: "Type letters, digits, spaces, and the symbols `- . $ / + %`. Lowercase is converted to uppercase." },
      { title: "Choose the text option", text: "Keep the human-readable text below the bars for labels that people read and scan." },
      { title: "Download and test", text: "Export a PNG or SVG, print at the final size, and scan with the reader used by the system you're feeding." },
    ],
    sections: [
      {
        heading: "Simple by design",
        body: [
          "Code 39 encodes 43 characters: A to Z, 0 to 9, space, and the symbols `- . $ / + %`. Each character is made of five bars and four spaces, with three of the nine elements wide. That simple pattern is why it was adopted so widely in the 1970s and 1980s.",
          "It is self-checking: a single printing defect usually makes the symbol invalid rather than silently changing one character into another. A modulo-43 check character is optional, and many legacy systems don't use one.",
          "The tradeoff is size. Code 39 is much wider than Code 128 for the same data, so it suits short strings such as `A-1042` rather than long URLs or sentences.",
        ],
      },
      {
        heading: "Where Code 39 still makes sense",
        body: ["You'll still find Code 39 in systems that were built around it and don't need to change:"],
        list: [
          "**ID badges:** employee or membership numbers",
          "**Library and archive labels:** short accession codes",
          "**Asset tags:** department plus a sequence number",
          "**Legacy inventory:** systems that expect Code 39 specifically",
          "**Manufacturing:** work orders and bin labels",
        ],
      },
      {
        heading: "Printing tips for older readers",
        body: [
          "Older laser scanners can be picky. Print with crisp edges, avoid thermal transfer smudging, and keep the quiet zone clear. Code 39's wide-to-narrow ratio matters: if the printer distorts the bars, a reader may reject the symbol.",
          "Don't shrink a long Code 39 symbol to fit a tiny label. Shorten the data or use Code 128, which packs the same characters into less space. If a system requires Code 39, it usually also has a maximum length in mind.",
          "Test with the exact reader model in use. A modern phone camera may read a Code 39 symbol that an old fixed-mount scanner rejects, or the other way around.",
        ],
      },
    ],
    tips: [
      "Keep data short; Code 39 is wide.",
      "Use uppercase only. Lowercase is converted, so `ab12` becomes `AB12`.",
      "Include the check character only if the receiving system expects it.",
      "Print at 300 dpi or use SVG for labels.",
      "Test with the legacy scanner, not just a phone app.",
    ],
    faqs: [
      { q: "Does Code 39 require a check digit?", a: "No. A modulo-43 check character is optional. Many systems omit it, and this generator does not add one." },
      { q: "Can Code 39 encode lowercase?", a: "The standard Code 39 character set is uppercase only. This generator converts lowercase input to uppercase." },
      { q: "Why is my Code 39 so wide?", a: "Code 39 uses more space per character than Code 128. Shorten the data or switch formats if the receiving system allows it." },
      { q: "What characters are allowed?", a: "A-Z, 0-9, space, and `- . $ / + %`. Other punctuation is rejected." },
      { q: "Is Code 39 still used?", a: "Yes, in badges, libraries, asset tags, and older industrial systems that were designed around it." },
    ],
    facts: [
      { label: "Characters", value: "A-Z, 0-9, space, - . $ / + %" },
      { label: "Length", value: "Variable; practical limit about 43 characters" },
      { label: "Check character", value: "Optional modulo 43" },
      { label: "Quiet zone", value: "At least 10 narrow modules each side" },
      { label: "Typical use", value: "Badges, assets, libraries, legacy systems" },
    ],
  },
  {
    slug: "code-93",
    metaTitle: "Code 93 Barcode Generator, Free and Compact",
    metaDescription:
      "Generate Code 93 barcodes with two built-in check characters. Denser than Code 39 and supported by many industrial scanners. Free PNG, SVG, and PDF exports.",
    h1: "Code 93 Barcode Generator",
    lede:
      "Code 93 is a compact, self-checking barcode that fits more data than Code 39 in the same space. It is common in industrial labels and older inventory systems.",
    steps: [
      { title: "Enter uppercase data", text: "Use A-Z, digits, spaces, and `- . $ / + %`. Lowercase is converted to uppercase." },
      { title: "Pick a size", text: "Set the module width and bar height for your label, and keep the quiet zone clear." },
      { title: "Export and verify", text: "Download the symbol, print a proof, and scan with a reader that supports Code 93." },
    ],
    sections: [
      {
        heading: "Smaller than Code 39, stricter than Code 128",
        body: [
          "Code 93 uses the same 43-character set as Code 39 but encodes each character more efficiently, so the symbol is noticeably narrower. It always includes two check characters, called C and K, which are calculated by the encoder.",
          "That built-in checking makes it reliable for short labels. It is not as flexible as Code 128, which handles lowercase and the full ASCII set, but it can be a good fit when a system already expects Code 93.",
          "Like Code 39, it is a linear symbology: bars and spaces in one row. It needs a clean print and a clear quiet zone to read reliably.",
        ],
      },
      {
        heading: "Where Code 93 appears",
        body: ["Code 93 is less common than Code 128, but it still shows up in specific industries:"],
        list: [
          "**Industrial labels:** part numbers and work orders",
          "**Electronics:** component and assembly tracking",
          "**Automotive:** internal production labels",
          "**Inventory:** short SKUs in legacy systems",
          "**Documents:** file references for scanning",
        ],
      },
      {
        heading: "Code 93 versus Code 128",
        body: [
          "Choose Code 93 when a receiving system requires it or when you want a compact uppercase-only symbol with built-in checking. Choose Code 128 when you need lowercase, punctuation, or the smallest possible symbol for mixed data.",
          "Neither format is a retail product code. For items sold at a checkout, use EAN-13 or UPC-A with numbers issued by GS1.",
          "If you're unsure, ask the system owner what they scan. Guessing wrong means reprinting labels.",
        ],
      },
    ],
    tips: [
      "Use Code 93 only if the scanner or system supports it.",
      "Keep data short to preserve wide bars.",
      "The two check characters are added automatically; don't type them.",
      "Print crisp edges; thin bars are the first thing to fail.",
      "Test with the production scanner before a large label run.",
    ],
    faqs: [
      { q: "Does Code 93 need check digits?", a: "It always has two check characters, C and K. The encoder calculates and adds them, so you don't enter them." },
      { q: "Can Code 93 encode lowercase?", a: "No, the standard character set is uppercase. This generator converts lowercase input to uppercase." },
      { q: "Is Code 93 better than Code 128?", a: "It is smaller than Code 39 but less flexible than Code 128. Use Code 93 when a system requires it; otherwise Code 128 is usually the better general choice." },
      { q: "What characters can I use?", a: "A-Z, 0-9, space, and `- . $ / + %`. Other punctuation is rejected." },
      { q: "Why won't my scanner read Code 93?", a: "Some scanners ship with Code 93 disabled. Enable it in the scanner settings, or confirm the reader supports the symbology." },
    ],
    facts: [
      { label: "Characters", value: "A-Z, 0-9, space, - . $ / + %" },
      { label: "Length", value: "Variable; practical limit about 48 characters" },
      { label: "Check characters", value: "Two, C and K, always included" },
      { label: "Quiet zone", value: "At least 10 narrow modules each side" },
      { label: "Typical use", value: "Industrial labels, electronics, legacy inventory" },
    ],
  },
  {
    slug: "codabar",
    metaTitle: "Codabar Barcode Generator for Labs and Libraries",
    metaDescription:
      "Create Codabar barcodes for lab samples, library cards, and photo labs. Start and stop characters are added automatically. Free PNG, SVG, and PDF downloads.",
    h1: "Codabar Barcode Generator",
    lede:
      "Codabar is a simple numeric barcode with start and stop characters, still used in laboratories, libraries, blood banks, and photo labs.",
    steps: [
      { title: "Enter the data", text: "Type digits and the allowed symbols `- $ : / . +`. The generator adds `A` and `B` as start and stop characters." },
      { title: "Set the label size", text: "Choose a module width and height that suit the label, and leave room for the quiet zone." },
      { title: "Print and test", text: "Export the symbol and scan it with the reader used by your lab or library system." },
    ],
    sections: [
      {
        heading: "The start and stop characters",
        body: [
          "Every Codabar symbol begins and ends with one of four letters: A, B, C, or D. They are not data; they tell the scanner where the symbol starts and stops. Many systems use A and B by default.",
          "If you type a string that already starts and ends with a letter, the generator keeps it. Otherwise it wraps your data in `A` and `B`. The readable text under the bars usually shows those letters too.",
          "Codabar's character set is limited to digits and a few punctuation marks. It is not suitable for free text, URLs, or mixed-case data.",
        ],
      },
      {
        heading: "Why labs still use it",
        body: ["Codabar is old, but it is cheap and well understood in several niche workflows:"],
        list: [
          "**Blood banks:** sample and bag identification",
          "**Laboratories:** specimen tracking",
          "**Libraries:** older membership and item cards",
          "**Photo labs:** envelope and order numbers",
          "**Access control:** simple badge numbers",
        ],
      },
      {
        heading: "Printing Codabar reliably",
        body: [
          "Codabar has no mandatory check digit. Some systems add one, but many don't, so a misread can produce a valid-looking but wrong number. If your workflow is safety-critical, use a system that adds and verifies a check digit, or switch to a symbology with built-in checking.",
          "Print the bars cleanly and keep the quiet zone. Avoid glossy labels that reflect scanner light, and test on the actual label stock. In a lab, make sure the label material survives spills and cleaning.",
          "Scan a proof with the production reader. A phone app may accept a symbol that a fixed scanner rejects.",
        ],
      },
    ],
    tips: [
      "Let the generator add A and B unless your system specifies different start and stop letters.",
      "Don't use Codabar for new free-text or URL applications; choose Code 128 or a QR code.",
      "Check whether your system expects a check digit; the generator does not add one.",
      "Use labels that survive the environment, especially in labs.",
      "Test with the actual scanner and label stock.",
    ],
    faqs: [
      { q: "What are the start and stop characters?", a: "Codabar symbols begin and end with A, B, C, or D. They mark the edges of the symbol and are not part of your data." },
      { q: "Does Codabar have a check digit?", a: "No, a check digit is not required by the standard. Some systems add one, but this generator does not." },
      { q: "Can Codabar encode letters?", a: "Only the start and stop letters A to D. The data itself is limited to digits and `- $ : / . +`." },
      { q: "Is Codabar still used?", a: "Yes, especially in blood banks, laboratories, libraries, and photo labs with older systems." },
      { q: "Why does my data start with A?", a: "The generator wraps data in A and B by default so the symbol is valid. If your system needs different letters, include them yourself." },
    ],
    facts: [
      { label: "Characters", value: "0-9 and - $ : / . +, plus A-D start/stop" },
      { label: "Length", value: "Variable; practical limit about 40 characters" },
      { label: "Check digit", value: "Not required" },
      { label: "Quiet zone", value: "At least 10 narrow modules each side" },
      { label: "Typical use", value: "Labs, blood banks, libraries, photo labs" },
    ],
  },
  {
    slug: "ean-13",
    metaTitle: "EAN-13 Barcode Generator with Check Digit",
    metaDescription:
      "Create EAN-13 retail barcodes with automatic check digit calculation. Enter 12 digits and download print-ready PNG, SVG, or PDF. Free, no sign-up.",
    h1: "EAN-13 Barcode Generator",
    lede:
      "EAN-13 is the standard retail barcode in most of the world. It carries a 13-digit number: a company prefix, an item reference, and a check digit.",
    steps: [
      { title: "Enter 12 digits", text: "Type the first 12 digits of your EAN-13 number. The generator calculates the 13th check digit." },
      { title: "Confirm the number", text: "Check the encoded number against your GS1 allocation. A barcode is only valid if the number is properly issued." },
      { title: "Download for print", text: "Export SVG or a high-resolution PNG, and test the printed symbol with a retail scanner." },
    ],
    sections: [
      {
        heading: "What the 13 digits mean",
        body: [
          "An EAN-13 number has three parts: a GS1 company prefix, an item reference, and a check digit. The prefix identifies the company that licensed the number, not the country of manufacture. The item reference is assigned by the company, and the check digit is calculated from the other twelve.",
          "The check digit catches typing errors and some printing errors. It is not a security feature. A wrong check digit makes the number invalid, even if the bars render perfectly.",
          "EAN-13 is used on retail products across Europe, Asia, Australia, and much of the world. The United States and Canada primarily use UPC-A, which is a subset of the same numbering system.",
        ],
      },
      {
        heading: "You can't invent a retail number",
        body: [
          "To sell a product in a retail store, you need a GTIN allocated through GS1 or your national member organization. Making up a number can collide with a real product, causing stock, pricing, and recall problems.",
          "For internal use, you can encode a number that looks like an EAN-13, but don't put it on a product that will be sold through normal retail channels. Use Code 128 for internal identifiers instead.",
          "If you already have a GTIN, enter its first 12 digits. If you have the full 13, enter all of them and the generator will verify the check digit.",
        ],
      },
      {
        heading: "Print size and placement",
        body: [
          "Retail scanners expect a certain size and contrast. The nominal size for EAN-13 is about 37.29 mm wide by 25.93 mm high, and the symbol can be scaled down to about 80% or up to 200% depending on the packaging.",
          "Keep the quiet zone clear and don't wrap the symbol around a sharp corner. On a curved can or bottle, orient the bars so they stay vertical and keep the symbol in the flattest area.",
          "Retailers may reject labels that are too small, too glossy, or placed where they can't be scanned. Check your retailer's packaging specification before a print run.",
        ],
      },
    ],
    tips: [
      "Enter 12 digits and let the generator add the check digit.",
      "Use numbers allocated by GS1 for products sold at retail.",
      "Print at the nominal size or within your retailer's allowed range.",
      "Keep the white space at both ends; don't crop it.",
      "Test with a retail scanner, not just a phone camera.",
    ],
    faqs: [
      { q: "How many digits does EAN-13 need?", a: "Thirteen including the check digit. Enter the first 12 and the generator calculates the 13th, or enter all 13 and it verifies the check digit." },
      { q: "Can I make my own EAN-13 number?", a: "Not for retail products. GTINs are allocated through GS1. Invented numbers can collide with real products." },
      { q: "What is the difference between EAN-13 and UPC-A?", a: "UPC-A is a 12-digit code used mainly in the US and Canada. EAN-13 is a 13-digit code used elsewhere. A UPC-A number can be represented as an EAN-13 by adding a leading zero." },
      { q: "Does the check digit matter?", a: "Yes. A wrong check digit makes the number invalid. The generator calculates or verifies it for you." },
      { q: "Why won't a store accept my barcode?", a: "The number may not be allocated to you, the symbol may be the wrong size or contrast, or the packaging may not meet the retailer's specification. Check with the retailer and GS1." },
    ],
    facts: [
      { label: "Digits", value: "13, including the check digit" },
      { label: "Check digit", value: "Modulo 10, required" },
      { label: "Nominal size", value: "37.29 × 25.93 mm" },
      { label: "Numbering", value: "GS1 company prefix + item reference + check" },
      { label: "Typical use", value: "Retail products outside the US and Canada" },
    ],
  },
  {
    slug: "ean-8",
    metaTitle: "EAN-8 Barcode Generator for Small Packages",
    metaDescription:
      "Create EAN-8 barcodes for small retail packages. Enter 7 digits and the check digit is calculated automatically. Free PNG, SVG, and PDF downloads.",
    h1: "EAN-8 Barcode Generator",
    lede:
      "EAN-8 is the short version of the retail barcode, designed for packages too small for an EAN-13 symbol, such as sweets, cosmetics, and small stationery.",
    steps: [
      { title: "Enter 7 digits", text: "Type the first seven digits of your EAN-8 number. The generator adds the check digit." },
      { title: "Check the allocation", text: "Use a number issued through GS1. EAN-8 numbers are limited and usually reserved for very small items." },
      { title: "Print and scan", text: "Export the symbol at the size your packaging allows and test it with a retail scanner." },
    ],
    sections: [
      {
        heading: "A shorter retail code",
        body: [
          "EAN-8 carries an eight-digit GTIN allocated through GS1, including a check digit. Its allocation structure differs from a company-prefix EAN-13. It is not simply a truncated EAN-13, and it has fewer available numbers.",
          "Because it is shorter, the symbol is narrower and can fit on small packages. The tradeoff is that the number range is limited, and GS1 member organizations control who gets an EAN-8 prefix.",
          "The check digit works the same way as EAN-13: a modulo-10 calculation over the first seven digits. The generator calculates it for you.",
        ],
      },
      {
        heading: "When EAN-8 is the right choice",
        body: ["Use EAN-8 only when an EAN-13 symbol genuinely won't fit and the retailer accepts EAN-8:"],
        list: [
          "**Small confectionery:** individual sweets and small boxes",
          "**Cosmetics:** lipsticks, sample sizes, and travel bottles",
          "**Stationery:** pens, erasers, and small accessories",
          "**Promotional items:** tiny giveaways with a retail number",
          "**Multi-packs:** small inner units that need their own code",
        ],
      },
      {
        heading: "Size and printing",
        body: [
          "The nominal EAN-8 size is about 26.73 mm wide by 21.64 mm high. It can be scaled, but stay within your retailer's allowed range and keep the quiet zone clear.",
          "Small packages often mean curved surfaces and tight spaces. Keep the bars vertical and avoid placing the code over a seam or a sharp curve. If the package is glossy, use a matte label or adjust the print to reduce glare.",
          "Test with a real retail scanner at the checkout, not only with a phone. Some phone scanners are more forgiving than the fixed scanners in stores.",
        ],
      },
    ],
    tips: [
      "Use EAN-8 only if your GS1 member organization has allocated an EAN-8 number.",
      "Enter 7 digits; the generator adds the check digit.",
      "Check the retailer's minimum size before printing small.",
      "Keep the quiet zone clear on tiny labels.",
      "Test on the actual packaging, not on flat paper.",
    ],
    faqs: [
      { q: "How many digits does EAN-8 need?", a: "Eight including the check digit. Enter seven digits and the generator calculates the eighth." },
      { q: "Can I shorten an EAN-13 to EAN-8?", a: "No. EAN-8 is a separate allocation with its own number range. You need an EAN-8 number issued through GS1." },
      { q: "Where is EAN-8 used?", a: "On small retail packages where an EAN-13 symbol won't fit, such as sweets, cosmetics, and stationery." },
      { q: "Does EAN-8 have a check digit?", a: "Yes, a modulo-10 check digit. The generator adds or verifies it." },
      { q: "Why is my EAN-8 rejected at the till?", a: "The number may not be allocated to you, or the symbol may be too small, low-contrast, or damaged. Check with your retailer and reprint a test." },
    ],
    facts: [
      { label: "Digits", value: "8, including the check digit" },
      { label: "Check digit", value: "Modulo 10, required" },
      { label: "Nominal size", value: "26.73 × 21.64 mm" },
      { label: "Numbering", value: "GS1-issued EAN-8 prefix" },
      { label: "Typical use", value: "Small retail packages" },
    ],
  },
  {
    slug: "upc-a",
    metaTitle: "UPC-A Barcode Generator with Check Digit",
    metaDescription:
      "Create UPC-A barcodes for products sold in the US and Canada. Enter 11 digits and the check digit is added automatically. Free PNG, SVG, and PDF.",
    h1: "UPC-A Barcode Generator",
    lede:
      "UPC-A is the 12-digit retail barcode used on most products in the United States and Canada. It identifies a product at the point of sale.",
    steps: [
      { title: "Enter 11 digits", text: "Type the first 11 digits of your UPC-A number. The generator calculates the 12th check digit." },
      { title: "Verify your GS1 number", text: "Use a GTIN allocated to your company. Don't invent a number for a product sold in stores." },
      { title: "Download and test", text: "Export SVG or a high-resolution PNG, and scan the printed symbol with a retail scanner." },
    ],
    sections: [
      {
        heading: "The 12 digits",
        body: [
          "A UPC-A symbol encodes a 12-digit GTIN, including a check digit. The split between a GS1 company prefix and an item reference varies with the allocation; it is not always five manufacturer digits and five product digits. GS1 also offers individual GTIN allocations in some markets.",
          "The check digit is calculated from the first 11 digits using a modulo-10 formula. It catches typing errors and some print defects, but it is not a security feature.",
          "UPC-A is a subset of the EAN-13 system. An EAN-13 starting with a zero is equivalent to a UPC-A, which is why many scanners can read both.",
        ],
      },
      {
        heading: "Don't invent a UPC",
        body: [
          "Retailers and marketplaces expect a GTIN that belongs to your company. Inventing a number can collide with an existing product, leading to wrong prices, inventory errors, or delistings.",
          "If you're selling through Amazon, a retail chain, or a distributor, check their requirements. Some accept EAN-13, some require UPC-A, and some require a specific GTIN format.",
          "For internal labels, use Code 128 instead. It is more flexible and doesn't consume a retail number.",
        ],
      },
      {
        heading: "Printing for the checkout",
        body: [
          "The nominal UPC-A size is about 37.29 mm wide by 25.93 mm high, and the symbol can be scaled within a limited range. Keep the quiet zone clear and print with crisp edges.",
          "Avoid placing the symbol on a curved surface where the bars bend. On small packages, orient the bars vertically and keep the symbol in the flattest area. Glossy film can reflect scanner light; a matte label often works better.",
          "Test at the actual checkout scanner. A phone camera may read a symbol that a fixed laser scanner rejects, especially at small sizes.",
        ],
      },
    ],
    tips: [
      "Enter 11 digits and let the generator add the check digit.",
      "Use a GS1 US-issued company prefix for retail products.",
      "Check whether your buyer wants UPC-A or EAN-13.",
      "Print within the allowed size range and keep the quiet zone.",
      "Test on the final packaging with a retail scanner.",
    ],
    faqs: [
      { q: "How many digits does UPC-A need?", a: "Twelve including the check digit. Enter 11 and the generator calculates the 12th, or enter 12 and it verifies the check digit." },
      { q: "Can I use a UPC-A in Europe?", a: "EAN-13 is the standard in Europe. A UPC-A can be represented as an EAN-13 with a leading zero, but check the retailer's requirements." },
      { q: "Do I need a GS1 US membership?", a: "For a retail product, you need a company prefix allocated through GS1 US or the appropriate GS1 member organization." },
      { q: "What is the difference between UPC-A and UPC-E?", a: "UPC-E is a compressed version of UPC-A for very small packages. It removes zeros according to specific rules and is not simply a shorter number." },
      { q: "Why won't my UPC scan at the store?", a: "The number may not be in the retailer's system, the symbol may be the wrong size or contrast, or the check digit may be wrong. Verify the number and reprint a test." },
    ],
    facts: [
      { label: "Digits", value: "12, including the check digit" },
      { label: "Check digit", value: "Modulo 10, required" },
      { label: "Nominal size", value: "37.29 × 25.93 mm" },
      { label: "Numbering", value: "GS1 US company prefix + item reference" },
      { label: "Typical use", value: "Retail products in the US and Canada" },
    ],
  },
  {
    slug: "upc-e",
    metaTitle: "UPC-E Barcode Generator for Small Packages",
    metaDescription:
      "Create UPC-E barcodes for tiny retail packages. Enter 6, 7, or 8 digits and download a print-ready symbol. Free, no sign-up, with PNG, SVG, and PDF.",
    h1: "UPC-E Barcode Generator",
    lede:
      "UPC-E is a compressed retail barcode for packages too small for a full UPC-A symbol. It removes zeros from a UPC-A number according to fixed rules.",
    steps: [
      { title: "Enter the short number", text: "Type 6, 7, or 8 digits. The generator accepts the common UPC-E forms and encodes the symbol." },
      { title: "Confirm the expansion", text: "Check which UPC-A number the short code expands to. The zero-suppression rules are not obvious." },
      { title: "Print at size", text: "Export the symbol and test it on the actual small package with a retail scanner." },
    ],
    sections: [
      {
        heading: "A compressed UPC-A",
        body: [
          "UPC-E is not a separate product numbering system. It is a way to print a UPC-A number in less space by removing zeros according to a set of rules. A scanner expands the short symbol back to the full UPC-A before looking up the product.",
          "Because the expansion rules are specific, the same six digits can mean different things depending on the number system and the position of the zeros. This generator accepts 6, 7, or 8 digits and lets the encoder handle the common forms.",
          "If you already have a UPC-A, check with your label software or GS1 guidance before converting it to UPC-E. Not every UPC-A number can be compressed, and the wrong short code will scan as a different product.",
        ],
      },
      {
        heading: "When to use UPC-E",
        body: ["UPC-E is for genuinely tiny packages where a full symbol won't fit:"],
        list: [
          "**Confectionery:** small boxes and single items",
          "**Cosmetics:** sample sizes and slim bottles",
          "**Pharmacy:** small boxes with limited label space",
          "**Stationery:** pens and small accessories",
          "**Promotional packs:** tiny seasonal items",
        ],
      },
      {
        heading: "Printing tiny retail codes",
        body: [
          "Small symbols are less forgiving. Keep the bars crisp, avoid curved surfaces, and leave the quiet zone clear. A matte label is usually safer than a glossy one.",
          "Test at the checkout, not just with a phone. Some fixed scanners struggle with very small UPC-E symbols, especially if the packaging reflects light.",
          "If the package can fit a UPC-A or EAN-13, use the full symbol. Compression is a compromise, not a default.",
        ],
      },
    ],
    tips: [
      "Use UPC-E only when the package cannot fit a full UPC-A.",
      "Verify the expanded UPC-A number before printing.",
      "Enter 6, 7, or 8 digits depending on the form you have.",
      "Test with a retail scanner on the actual package.",
      "Keep the quiet zone clear, even on tiny labels.",
    ],
    faqs: [
      { q: "How many digits does UPC-E need?", a: "The compressed symbol carries 6 data digits plus a number system and check digit. This generator accepts 6, 7, or 8 digits." },
      { q: "Is UPC-E a different product number?", a: "No. It is a compressed representation of a UPC-A number. The scanner expands it to the full number." },
      { q: "Can every UPC-A be converted to UPC-E?", a: "No. Only numbers that fit the zero-suppression rules can be compressed. Check the expansion before printing." },
      { q: "Where is UPC-E used?", a: "On very small retail packages in the US and Canada where a full UPC-A symbol won't fit." },
      { q: "Why does my UPC-E scan as a different product?", a: "The short code may expand to a different UPC-A than you intended. Verify the full number and regenerate the symbol." },
    ],
    facts: [
      { label: "Digits", value: "6 data digits plus number system and check" },
      { label: "Check digit", value: "Modulo 10, required" },
      { label: "Relationship", value: "Compressed form of UPC-A" },
      { label: "Quiet zone", value: "At least 9 narrow modules each side" },
      { label: "Typical use", value: "Very small retail packages" },
    ],
  },
  {
    slug: "itf-14",
    metaTitle: "ITF-14 Barcode Generator for Shipping Cartons",
    metaDescription:
      "Create ITF-14 carton barcodes with a bearer bar and automatic check digit. Enter 13 digits and download print-ready PNG, SVG, or PDF. Free.",
    h1: "ITF-14 Barcode Generator",
    lede:
      "ITF-14 is the standard carton code for corrugated boxes. It carries a 14-digit GTIN and is printed with a thick bearer bar that protects the symbol during rough handling.",
    steps: [
      { title: "Enter 13 digits", text: "Type the first 13 digits of the carton GTIN. The generator calculates the 14th check digit." },
      { title: "Check the packaging number", text: "Use the GTIN assigned to the case or outer pack, not the individual item's retail code." },
      { title: "Print on the carton", text: "Export a high-resolution symbol and test it on the actual corrugated board, across any flutes or folds." },
    ],
    sections: [
      {
        heading: "Built for cardboard",
        body: [
          "ITF-14 uses Interleaved 2 of 5 symbology with bearer bars. These help distribute printing pressure and reduce partial scans that could otherwise look like a shorter, valid number. Keep them intact on the printed carton.",
          "The 14 digits are a GTIN: a packaging indicator, the company prefix, an item reference, and a check digit. The packaging indicator distinguishes a case from the individual item, so a carton of 12 and a single unit don't share the same code.",
          "ITF-14 is designed for direct printing on corrugated board, where fine bars would fill in. The bars are relatively wide and the symbol is larger than a retail barcode.",
        ],
      },
      {
        heading: "Carton codes need GS1 numbers",
        body: [
          "The GTIN on a carton must be allocated through GS1. The packaging indicator is part of that allocation, not something you choose at random. Using the wrong indicator can make a case look like a single item to a warehouse system.",
          "If you're shipping to a retailer or distributor, ask for their labeling guide. Some require a specific symbol placement, size, and accompanying human-readable text.",
          "For internal cartons that never leave your warehouse, you can use Code 128 with your own numbering. Use ITF-14 when a trading partner expects a GTIN.",
        ],
      },
      {
        heading: "Printing on corrugated board",
        body: [
          "Corrugated board absorbs ink and has a texture. Fine bars can close up, so print larger than you would on paper and test on the actual material. Avoid printing across a fold or a seam.",
          "The bearer bar is part of the symbol, not decoration. Don't crop it or cover it with tape. Keep the quiet zone clear and orient the bars vertically.",
          "Scan a production sample with the warehouse scanner. A symbol that reads on a desk may fail on a pallet wrapped in stretch film.",
        ],
      },
    ],
    tips: [
      "Use the GTIN allocated to the case, not the item.",
      "Keep the bearer bar intact and uncropped.",
      "Print larger on corrugated board; fine bars fill in.",
      "Avoid folds, seams, and tape over the symbol.",
      "Test a production carton with the warehouse scanner.",
    ],
    faqs: [
      { q: "What is the bearer bar for?", a: "Bearer bars help distribute printing pressure and prevent a partial scan from being accepted as a shorter number. They are part of the symbol, so don't crop them." },
      { q: "How many digits does ITF-14 need?", a: "Fourteen including the check digit. Enter 13 and the generator adds the 14th." },
      { q: "Can I use ITF-14 for a single product?", a: "ITF-14 is intended for cases and outer packs. Single retail items usually use UPC-A or EAN-13." },
      { q: "Do I need a GS1 number?", a: "Yes, for cartons that move through retail or distribution. The GTIN and packaging indicator are allocated through GS1." },
      { q: "Why won't my carton barcode scan?", a: "Corrugated texture, folds, tape, or too-small bars are common causes. Print larger, avoid seams, and test on the real board." },
    ],
    facts: [
      { label: "Digits", value: "14, including the check digit" },
      { label: "Check digit", value: "Modulo 10, required" },
      { label: "Symbology", value: "Interleaved 2 of 5 with bearer bar" },
      { label: "Material", value: "Corrugated cartons and outer packs" },
      { label: "Typical use", value: "Cases, pallets, and distribution" },
    ],
  },
  {
    slug: "interleaved-2-of-5",
    metaTitle: "Interleaved 2 of 5 Barcode Generator",
    metaDescription:
      "Create Interleaved 2 of 5 barcodes for warehouse and distribution labels. Numeric only, even-length, with an optional leading zero. Free downloads.",
    h1: "Interleaved 2 of 5 Barcode Generator",
    lede:
      "Interleaved 2 of 5 is a compact numeric barcode for warehouse labels, cartons, and distribution. Digits are paired, so the data length must be even.",
    steps: [
      { title: "Enter digits", text: "Type a numeric string. If the length is odd, the generator adds a leading zero so the pairs work." },
      { title: "Choose the size", text: "Set the module width and height for the label, and keep the quiet zone clear." },
      { title: "Test the label", text: "Export the symbol and scan it with the warehouse reader on the actual label stock." },
    ],
    sections: [
      {
        heading: "Why the length must be even",
        body: [
          "Interleaved 2 of 5 encodes pairs of digits: the first digit in the bars, the second in the spaces. An odd number of digits leaves one digit without a partner, so the encoder adds a leading zero or rejects the data.",
          "This generator adds the zero and tells you it did. The readable text shows the padded number, which is what the scanner will return. Make sure your system expects that leading zero.",
          "The symbology is numeric only. It has no built-in check digit, though some systems add one. Without a check digit, a partial scan can produce a valid-looking but wrong number.",
        ],
      },
      {
        heading: "Where it is used",
        body: ["Interleaved 2 of 5 is common in logistics and manufacturing because it is compact and easy to print:"],
        list: [
          "**Carton labels:** case and pallet numbers",
          "**Warehouse bins:** location codes",
          "**Manufacturing:** work orders and batch numbers",
          "**Shipping:** tracking references that are all digits",
          "**Legacy systems:** fixed-length numeric IDs",
        ],
      },
      {
        heading: "Use a check digit for safety",
        body: [
          "Because Interleaved 2 of 5 has no mandatory check digit, it is more vulnerable to misreads than Code 128. For anything safety-critical or financially important, use a system that adds and verifies a check digit, or choose a symbology with built-in checking.",
          "Fixed-length data helps. If every label has the same number of digits, the scanner can reject short reads. Variable-length data is riskier because a partial scan can look complete.",
          "Print clean bars and test with the production scanner. Warehouse labels often live on surfaces that are dusty, curved, or poorly lit.",
        ],
      },
    ],
    tips: [
      "Keep the digit count fixed if your system allows it.",
      "Add a check digit at the system level for critical data.",
      "Remember that an odd length gets a leading zero.",
      "Print larger on corrugated or textured labels.",
      "Test with the warehouse scanner, not a phone.",
    ],
    faqs: [
      { q: "Why did a zero appear at the start?", a: "Interleaved 2 of 5 encodes pairs of digits. An odd-length number gets a leading zero so every digit has a partner." },
      { q: "Does it support letters?", a: "No. Interleaved 2 of 5 is numeric only." },
      { q: "Does it have a check digit?", a: "Not by default. Some systems add one, but this generator does not. Use a check digit for critical data." },
      { q: "How is it different from Code 128?", a: "It is numeric only and has no mandatory check character. Code 128 is more flexible and safer for mixed data." },
      { q: "Why won't my warehouse scanner read it?", a: "The symbol may be too small, low-contrast, or printed on a textured surface. Check that the scanner has Interleaved 2 of 5 enabled." },
    ],
    facts: [
      { label: "Characters", value: "Digits 0-9 only" },
      { label: "Length", value: "Even number of digits" },
      { label: "Check digit", value: "Optional, not added by default" },
      { label: "Quiet zone", value: "At least 10 narrow modules each side" },
      { label: "Typical use", value: "Warehouse, cartons, manufacturing" },
    ],
  },
  {
    slug: "msi-plessey",
    metaTitle: "MSI Plessey Barcode Generator, Free",
    metaDescription:
      "Create MSI Plessey barcodes for shelf labels and inventory. Numeric only, no check digit added. Download PNG, SVG, or PDF. Free, no sign-up.",
    h1: "MSI Plessey Barcode Generator",
    lede:
      "MSI Plessey is a numeric barcode used on shelf labels, inventory tags, and some legacy retail systems. It is simple to print but has no built-in check digit.",
    steps: [
      { title: "Enter digits", text: "Type a numeric string for the item or shelf label. MSI Plessey does not encode letters." },
      { title: "Set the label size", text: "Choose a module width and height that suit the shelf edge or tag, and leave the quiet zone clear." },
      { title: "Test in place", text: "Export the symbol and scan it with the handheld reader used in the store or warehouse." },
    ],
    sections: [
      {
        heading: "A simple numeric code",
        body: [
          "MSI Plessey encodes digits using a pattern of bars and spaces. It is not as dense as Code 128 and not as widely supported, but it appears in shelf-edge labels and older inventory systems.",
          "The basic symbology has no mandatory check digit. Some implementations add a mod-10 or mod-11 check, but this generator encodes the digits you enter without adding one.",
          "Because there is no built-in checking, a misread can return a valid-looking number. If your system relies on MSI, make sure it validates the number against a database rather than trusting the scan alone.",
        ],
      },
      {
        heading: "Where MSI shows up",
        body: ["MSI is a niche format, usually found where a system was built around it:"],
        list: [
          "**Shelf labels:** price and stock codes",
          "**Inventory tags:** internal item numbers",
          "**Library systems:** older patron or item IDs",
          "**Retail legacy:** store-specific codes",
          "**Asset labels:** simple numeric IDs",
        ],
      },
      {
        heading: "Printing and verification",
        body: [
          "Print MSI at a size that keeps the bars crisp. Shelf labels are small, so avoid squeezing a long number into a narrow label; shorten the data or use a more compact symbology.",
          "Test with the store's handheld scanner. Some modern scanners have MSI disabled by default, and a phone app may not support it at all.",
          "If you're choosing a format for a new system, Code 128 is usually a better choice: it is more widely supported, handles mixed data, and includes a check character.",
        ],
      },
    ],
    tips: [
      "Use MSI only when an existing system requires it.",
      "Keep the number short for small shelf labels.",
      "Add a check digit at the system level if accuracy matters.",
      "Confirm the scanner supports MSI before a rollout.",
      "For new projects, prefer Code 128.",
    ],
    faqs: [
      { q: "Does MSI Plessey have a check digit?", a: "The basic symbology does not require one, and this generator does not add one. Some systems add a mod-10 or mod-11 check separately." },
      { q: "Can MSI encode letters?", a: "No. It is a numeric-only symbology." },
      { q: "Where is MSI used?", a: "Shelf labels, inventory tags, library systems, and some legacy retail applications." },
      { q: "Is MSI better than Code 128?", a: "No, for new systems Code 128 is more flexible and includes a mandatory check character. MSI is mainly for compatibility with existing systems." },
      { q: "Why won't my scanner read MSI?", a: "Many scanners ship with MSI disabled. Enable it in the scanner configuration or use a reader that supports the symbology." },
    ],
    facts: [
      { label: "Characters", value: "Digits 0-9 only" },
      { label: "Length", value: "Variable" },
      { label: "Check digit", value: "Not added by default" },
      { label: "Quiet zone", value: "At least 10 narrow modules each side" },
      { label: "Typical use", value: "Shelf labels, inventory, legacy systems" },
    ],
  },
  {
    slug: "pharmacode",
    metaTitle: "Pharmacode Barcode Generator for Packaging",
    metaDescription:
      "Create Pharmacode barcodes for pharmaceutical packaging control. Encodes a number from 3 to 131070 as a compact bar pattern. Free, no sign-up.",
    h1: "Pharmacode Barcode Generator",
    lede:
      "Pharmacode is a small numeric code used on pharmaceutical packaging to control print runs and verify that the right artwork is on the line.",
    steps: [
      { title: "Enter a number", text: "Type a whole number from 3 to 131070. Pharmacode encodes the number itself, not a string of digits." },
      { title: "Print at production size", text: "Export the symbol and place it where the packaging specification requires, usually in a margin or edge area." },
      { title: "Verify on the line", text: "Test with the packaging line's Pharmacode reader, not a general-purpose barcode app." },
    ],
    sections: [
      {
        heading: "A number, not a string",
        body: [
          "Pharmacode encodes a single integer between 3 and 131070 using a pattern of bars. Leading zeros don't exist in the value; the number 42 is encoded as 42, not as the characters `4` and `2`.",
          "It is deliberately small and simple, designed to be printed in a margin where a full barcode would not fit. It is a control code, not a product identifier for retail sale.",
          "The format is used in pharmaceutical packaging to confirm that the correct carton or leaflet is running on the line. A mismatch can stop the line before a bad batch is packed.",
        ],
      },
      {
        heading: "Where Pharmacode is used",
        body: ["Pharmacode is a production tool, usually invisible to the end customer:"],
        list: [
          "**Carton printing:** verifying the correct artwork",
          "**Leaflet folding:** matching the leaflet to the carton",
          "**Print inspection:** confirming a print run",
          "**Packaging lines:** changeover checks",
          "**Quality control:** batch documentation",
        ],
      },
      {
        heading: "Don't treat it as a retail code",
        body: [
          "Pharmacode does not identify a product to a pharmacy or a patient. It is not a replacement for a GTIN, a Data Matrix, or a prescription label. Use it alongside the codes your regulatory system requires.",
          "If you're building packaging artwork, get the number and placement from the packaging specification or the line engineer. A Pharmacode in the wrong place can be worse than none.",
          "Test with the line's reader. Consumer barcode apps generally don't support Pharmacode, so a phone test proves very little.",
        ],
      },
    ],
    tips: [
      "Enter the integer value, not a zero-padded string.",
      "Keep the number within 3 to 131070.",
      "Follow the packaging specification for placement and size.",
      "Test with the production line reader.",
      "Don't use Pharmacode as a product identifier.",
    ],
    faqs: [
      { q: "What numbers can Pharmacode encode?", a: "Whole numbers from 3 to 131070. The value is encoded directly, not as decimal digits." },
      { q: "Is Pharmacode the same as a retail barcode?", a: "No. It is a packaging control code used on pharmaceutical production lines, not a product identifier for checkout." },
      { q: "Can a phone scan Pharmacode?", a: "Most consumer barcode apps don't support it. Use the packaging line's dedicated reader." },
      { q: "Does it have a check digit?", a: "No. The value itself is encoded, and the reader compares it with the expected value for the run." },
      { q: "Why does my number get rejected?", a: "Pharmacode only accepts 3 to 131070. Values outside that range, decimals, or leading text are invalid." },
    ],
    facts: [
      { label: "Value range", value: "3 to 131070" },
      { label: "Data type", value: "Integer, encoded directly" },
      { label: "Check digit", value: "None" },
      { label: "Typical use", value: "Pharmaceutical packaging control" },
      { label: "Reader", value: "Dedicated packaging line scanner" },
    ],
  },
  {
    slug: "isbn",
    metaTitle: "ISBN Barcode Generator for Books and Ebooks",
    metaDescription:
      "Create an ISBN barcode for a printed book cover. Enter ISBN-10 or ISBN-13 and get an EAN-13 symbol with the correct check digit. Free, no sign-up.",
    h1: "ISBN Barcode Generator",
    lede:
      "Books use an EAN-13 barcode built from the ISBN. Enter an ISBN-10 or ISBN-13 and get a print-ready symbol with the correct check digit and 978 or 979 prefix.",
    steps: [
      { title: "Enter the ISBN", text: "Type an ISBN-10 or ISBN-13, with or without hyphens. ISBN-10 is converted to its 978-prefixed ISBN-13 equivalent." },
      { title: "Check the check digit", text: "The generator verifies the check digit and rejects a number that doesn't add up. Fix any typo before printing." },
      { title: "Place it on the cover", text: "Download SVG or a high-resolution PNG and follow your printer's specification for the barcode area on the back cover." },
    ],
    sections: [
      {
        heading: "How an ISBN becomes a barcode",
        body: [
          "An ISBN-13 is a 13-digit number that starts with 978 or 979. It is structurally a GTIN, so the barcode on a book is an EAN-13 symbol. The number encodes the registration group, registrant, publication, and a check digit.",
          "ISBN-10 is the older format. To convert it, the generator drops the ISBN-10 check character, adds the 978 prefix, and calculates a new ISBN-13 check digit. The result is the number printed in the barcode.",
          "The human-readable text under the bars is usually the ISBN, sometimes with the price code above it. That text is added by the cover designer or printer, not by the barcode itself.",
        ],
      },
      {
        heading: "Get the number right",
        body: [
          "ISBNs are issued by national agencies, and each edition and format needs its own number. A paperback, a hardback, and an ebook are separate products with separate ISBNs.",
          "A wrong check digit makes the number invalid. The generator catches that, but it can't tell whether the ISBN belongs to your book. Check the number against your agency record or the copyright page.",
          "For a book sold in retail, the barcode needs to meet the retailer's or distributor's specification. Many printers provide a template with the correct size and placement.",
        ],
      },
      {
        heading: "Printing the book barcode",
        body: [
          "Use SVG or a high-resolution PNG. The barcode usually sits in the lower-right area of the back cover, in a white box with a clear quiet zone. Don't print it over artwork or a dark background.",
          "Check the final cover proof at actual size. A barcode that looks fine on screen can be too small or too low-contrast on a matte laminated cover.",
          "If you're uploading a cover to a print-on-demand service, use their template. They may add the price code and human-readable text themselves.",
        ],
      },
    ],
    tips: [
      "Enter the ISBN without hyphens if you're unsure; the generator handles both.",
      "Use the ISBN for the exact format: paperback, hardback, and ebook differ.",
      "Keep the barcode in its white box with a clear quiet zone.",
      "Don't add your own check digit; let the generator calculate it.",
      "Check the printer's cover template before exporting the final file.",
    ],
    faqs: [
      { q: "Can I use an ISBN-10?", a: "Yes. The generator converts it to the equivalent 978-prefixed ISBN-13 and calculates the new check digit." },
      { q: "Why does my ISBN show 978 at the start?", a: "ISBN-13 numbers begin with 978 or 979, which are the GS1 prefixes for books. The rest of the number identifies the publisher and title." },
      { q: "Does the barcode include the price?", a: "No. The symbol encodes the ISBN. A price code, if needed, is a separate element added by the cover designer or printer." },
      { q: "Can I make an ISBN barcode for an ebook?", a: "You can generate the symbol, but ebooks don't usually carry a printed barcode. Use the ISBN in the ebook metadata instead." },
      { q: "Why is my ISBN check digit rejected?", a: "One digit is wrong or the number isn't a valid ISBN-10 or ISBN-13. Check it against the copyright page or your agency record." },
    ],
    facts: [
      { label: "Symbology", value: "EAN-13" },
      { label: "Input", value: "ISBN-10 or ISBN-13" },
      { label: "Prefix", value: "978 or 979" },
      { label: "Check digit", value: "Modulo 10, required" },
      { label: "Typical use", value: "Printed book covers" },
    ],
  },
  {
    slug: "data-matrix",
    metaTitle: "Data Matrix Generator for Parts and Labels",
    metaDescription:
      "Create Data Matrix 2D codes for small parts, electronics, and labels. High density, damage resistant, and free to generate as PNG, SVG, or PDF.",
    h1: "Data Matrix Generator",
    lede:
      "Data Matrix is a square 2D code that holds a lot of data in a tiny space. It is the standard for marking parts, electronics, and medical devices.",
    steps: [
      { title: "Enter the data", text: "Type or paste up to 1,500 characters. Keep it short if the mark will be physically small." },
      { title: "Set the module size", text: "Choose a scale that gives each module enough room for the marking method, such as laser, inkjet, or label printing." },
      { title: "Verify with a 2D reader", text: "Export the symbol and test it with a Data Matrix reader at the final size and contrast." },
    ],
    sections: [
      {
        heading: "Small, dense, and robust",
        body: [
          "A Data Matrix symbol is made of small square modules arranged in a square or rectangular grid, with a solid L-shaped finder pattern on two sides. It can encode text, numbers, and binary data, and it stays readable even when part of the symbol is damaged.",
          "Its density makes it ideal for direct part marking. A symbol a few millimetres across can carry a serial number, a batch code, or a short URL. That is why it appears on electronics, surgical instruments, and aerospace components.",
          "Data Matrix is not the same as QR Code. Both are 2D, but they use different finder patterns and error-correction schemes. Make sure the scanner supports the format you print.",
        ],
      },
      {
        heading: "Direct marking needs contrast",
        body: [
          "Laser-etched or dot-peened marks often have low contrast. A reader needs a difference between the mark and the surface, whether that comes from color, depth, or lighting. Test with the actual marking method, not just a printed label.",
          "Module size is critical. If the laser spot is wider than a module, adjacent modules merge and the symbol becomes unreadable. Choose a symbol size that gives each module at least a few times the marking resolution.",
          "Curved or reflective surfaces add difficulty. Angle the reader or use diffuse lighting, and verify the symbol after any coating, painting, or cleaning step.",
        ],
      },
      {
        heading: "Where Data Matrix fits",
        body: ["Data Matrix is the quiet workhorse of industrial marking:"],
        list: [
          "**Electronics:** PCB serial numbers and component IDs",
          "**Medical devices:** UDI and traceability marks",
          "**Aerospace:** part numbers on metal components",
          "**Automotive:** engine and safety part tracking",
          "**Documents:** small codes on certificates and labels",
        ],
      },
    ],
    tips: [
      "Keep the data short for direct part marking.",
      "Choose a module size larger than your marking resolution.",
      "Test after coating, painting, or cleaning.",
      "Use a dedicated 2D reader; not every barcode app supports Data Matrix.",
      "For healthcare UDI, check whether GS1 Data Matrix is required instead.",
    ],
    faqs: [
      { q: "Is Data Matrix the same as QR Code?", a: "No. Both are 2D codes, but they use different finder patterns and error correction. Use a reader that supports Data Matrix." },
      { q: "How much data can it hold?", a: "The format can hold more, but this generator caps input at 1,500 characters. Short data produces a smaller, more robust symbol." },
      { q: "Can I print Data Matrix on paper?", a: "Yes. It works on labels as well as direct part marks. Keep the modules crisp and the contrast high." },
      { q: "What is GS1 Data Matrix?", a: "A Data Matrix variant that follows GS1 rules for Application Identifiers, used in healthcare and UDI applications." },
      { q: "Why won't my phone read it?", a: "Many phone apps support QR but not Data Matrix. Use a dedicated 2D scanner or an app that explicitly lists Data Matrix support." },
    ],
    facts: [
      { label: "Type", value: "2D matrix code" },
      { label: "Capacity", value: "Up to about 1,555 bytes; capped at 1,500 characters here" },
      { label: "Finder pattern", value: "Solid L-shaped border on two sides" },
      { label: "Error correction", value: "Reed-Solomon" },
      { label: "Typical use", value: "Parts, electronics, medical devices, labels" },
    ],
  },
  {
    slug: "gs1-datamatrix",
    metaTitle: "GS1 Data Matrix Generator for Healthcare UDI",
    metaDescription:
      "Create GS1 Data Matrix symbols with Application Identifiers for UDI, batch, expiry, and serial data. Enter AIs in parentheses. Free, no sign-up.",
    h1: "GS1 Data Matrix Generator",
    lede:
      "GS1 Data Matrix is the 2D healthcare and UDI standard. It packs a GTIN, batch, expiry, and serial number into a symbol small enough for a medical device.",
    steps: [
      { title: "Enter data with AIs", text: "Write each Application Identifier in parentheses, for example `(01)09521234543213(17)261231(10)ABC123`." },
      { title: "Check the UDI data", text: "Confirm the GTIN, expiry, batch, and serial values against your regulatory records. The barcode only encodes what you type." },
      { title: "Verify with a UDI reader", text: "Print or mark the symbol, then scan it with a reader that parses GS1 AIs, not just a generic 2D app." },
    ],
    sections: [
      {
        heading: "The same data, in a smaller space",
        body: [
          "GS1 Data Matrix uses Data Matrix symbology with GS1 Application Identifiers. It is the preferred format for healthcare UDI because it can carry a GTIN, expiry date, batch, and serial number in a symbol small enough for a syringe, implant, or device label.",
          "The parentheses you type are for humans; they are not encoded. The encoder converts each AI into the GS1 structure, including function characters between variable-length fields.",
          "GS1-128 carries similar data in a linear symbol. Data Matrix is smaller and more robust for direct marking, which is why healthcare has largely standardized on it.",
        ],
      },
      {
        heading: "UDI is regulated",
        body: [
          "Unique Device Identification rules in the US, EU, and other markets specify what data must be encoded, in which format, and how it must be presented. The barcode is one part of a larger compliance process.",
          "GTINs and company prefixes come from GS1. The device identifier and production identifiers must match your regulatory submissions. Don't invent or reuse numbers to make a test symbol.",
          "If you're marking a regulated device, work from the label specification and have the final symbol verified by a UDI specialist or your quality team.",
        ],
      },
      {
        heading: "Marking and verification",
        body: [
          "Healthcare symbols are often laser-marked or printed on small labels. Module size, contrast, and surface finish all affect readability. A symbol that passes on paper may fail on a curved stainless steel instrument.",
          "Use a verifier that reports ISO/IEC 15415 grading if your quality system requires it. A handheld scanner that beeps is not a substitute for a grade.",
          "Check the symbol after sterilization, coating, or packaging. Some processes change contrast or distort the mark.",
        ],
      },
    ],
    tips: [
      "Get GTINs and company prefixes from GS1.",
      "Write AIs in the order your regulatory label specifies.",
      "Use a GS1-aware reader that separates the AIs.",
      "Verify after sterilization or coating if the device goes through either.",
      "Keep the symbol away from curves and seams when marking by hand.",
    ],
    faqs: [
      { q: "What is the difference between Data Matrix and GS1 Data Matrix?", a: "GS1 Data Matrix uses the same symbology but follows GS1 rules for Application Identifiers and data formatting." },
      { q: "Do I type the parentheses?", a: "Yes, in the generator. They mark the AIs and are not encoded as characters in the symbol." },
      { q: "Is GS1 Data Matrix required for UDI?", a: "It is one of the accepted formats and is widely used in healthcare. Check the specific rules for your market and device class." },
      { q: "Can I encode a serial number?", a: "Yes. Use `(21)` followed by the serial number. Variable-length fields need a separator, which the encoder adds." },
      { q: "Why does my scanner show strange characters?", a: "GS1 uses a function character between variable-length fields. Some scanners display it visibly. Use a GS1-aware parser." },
    ],
    facts: [
      { label: "Symbology", value: "Data Matrix with GS1 Application Identifiers" },
      { label: "Data", value: "GTIN, expiry, batch, serial, and other AIs" },
      { label: "Typical use", value: "Healthcare UDI, medical devices, pharma" },
      { label: "Separators", value: "GS1 function character after variable fields" },
      { label: "Verification", value: "ISO/IEC 15415 grading where required" },
    ],
  },
  {
    slug: "pdf417",
    metaTitle: "PDF417 Barcode Generator for IDs and Documents",
    metaDescription:
      "Create PDF417 stacked 2D barcodes for IDs, licences, and documents. Holds up to 1,800 characters. Free PNG, SVG, and PDF downloads, no sign-up.",
    h1: "PDF417 Barcode Generator",
    lede:
      "PDF417 is a stacked 2D barcode that holds a lot of data in a rectangular symbol. It is used on ID cards, driver's licences, boarding passes, and documents.",
    steps: [
      { title: "Enter the data", text: "Type or paste up to 1,800 characters. Structured data such as name, date, and document number works well." },
      { title: "Set the symbol size", text: "Choose a scale that keeps the rows and columns readable at the final print size." },
      { title: "Test with a 2D reader", text: "Export the symbol and scan it with a PDF417-capable reader, not a QR-only app." },
    ],
    sections: [
      {
        heading: "Rows of data",
        body: [
          "PDF417 looks like a stack of short barcodes. Each row contains data and error-correction codewords, and the rows are stacked vertically. The symbol starts and ends with start and stop patterns that help the reader find the rows.",
          "It can hold up to about 1,850 printable characters, which is enough for a name, address, document number, and several dates. That capacity is why it appears on identity documents and travel documents.",
          "The format includes Reed-Solomon error correction, so a partially damaged symbol can still decode. The amount of correction is chosen by the encoder and affects the symbol size.",
        ],
      },
      {
        heading: "Where PDF417 is used",
        body: ["PDF417 is a document and identity format more than a retail one:"],
        list: [
          "**Driver's licences and ID cards:** name, address, and dates",
          "**Boarding passes:** passenger and flight details",
          "**Event tickets:** attendee and seat information",
          "**Shipping documents:** consolidated references",
          "**Government forms:** machine-readable application data",
        ],
      },
      {
        heading: "Printing a readable PDF417",
        body: [
          "PDF417 needs more space than a QR code for the same data, especially in height. Give it room and keep the rows crisp. A symbol squeezed into a narrow strip may lose row separation.",
          "Avoid printing on highly textured or glossy material. If the symbol is on a card, keep it away from the edge and from embossing or holograms.",
          "Test with the reader used by the organisation that will scan it. Consumer apps vary, and some only support QR.",
        ],
      },
    ],
    tips: [
      "Keep the data structured and short enough to fit comfortably.",
      "Give the symbol enough height; don't squash the rows.",
      "Use a reader that explicitly supports PDF417.",
      "Avoid textured or glossy surfaces.",
      "Check any issuing authority's specification before printing an ID or ticket.",
    ],
    faqs: [
      { q: "How much data can PDF417 hold?", a: "The format can hold about 1,850 printable characters. This generator caps input at 1,800." },
      { q: "Is PDF417 the same as a QR code?", a: "No. It is a stacked 2D format with a different structure and error correction. Use a reader that supports PDF417." },
      { q: "Can I use it on a business card?", a: "It is possible, but a QR code is usually a better fit for a URL or contact card because it is more widely supported by phones." },
      { q: "Does it have error correction?", a: "Yes, Reed-Solomon error correction. The encoder chooses a level based on the data and symbol size." },
      { q: "Why won't my phone scan it?", a: "Many phone apps support only QR. Use a PDF417-capable scanner or app, and make sure the symbol has enough height and contrast." },
    ],
    facts: [
      { label: "Type", value: "Stacked 2D barcode" },
      { label: "Capacity", value: "About 1,850 printable characters" },
      { label: "Error correction", value: "Reed-Solomon" },
      { label: "Shape", value: "Rectangular, multiple rows" },
      { label: "Typical use", value: "IDs, licences, tickets, documents" },
    ],
  },
  {
    slug: "aztec",
    metaTitle: "Aztec Barcode Generator for Tickets and Transit",
    metaDescription:
      "Create Aztec 2D barcodes for boarding passes, transit tickets, and mobile passes. No quiet zone needed and robust in poor light. Free downloads.",
    h1: "Aztec Barcode Generator",
    lede:
      "Aztec is a square 2D code with a central bullseye. It is compact, needs no quiet zone, and is used on boarding passes, transit tickets, and mobile passes.",
    steps: [
      { title: "Enter the data", text: "Type or paste up to 3,000 characters. Ticket and pass data is usually a compact structured string." },
      { title: "Set the scale", text: "Choose a module size that suits the screen or print size. Aztec needs no blank border, but leave a little room for handling." },
      { title: "Test with an Aztec reader", text: "Export the symbol and scan it with the reader used at the gate or turnstile." },
    ],
    sections: [
      {
        heading: "The bullseye in the middle",
        body: [
          "Aztec codes have a central square bullseye that helps the reader find the symbol and correct for rotation. Data radiates outward in layers. The format can be compact or full, depending on how much data it carries.",
          "One advantage is that it needs no quiet zone. The symbol can sit close to other content, which is useful on a boarding pass or a phone screen where space is tight.",
          "Aztec is robust in poor lighting and can be read from a screen, which is why transit and airline systems adopted it for mobile passes.",
        ],
      },
      {
        heading: "Where Aztec appears",
        body: ["Aztec is common in systems that need a compact, screen-friendly code:"],
        list: [
          "**Boarding passes:** airline and rail tickets",
          "**Transit:** mobile tickets and turnstile passes",
          "**Event tickets:** scanned at the gate",
          "**Loyalty passes:** stored in a phone wallet",
          "**Access control:** temporary visitor passes",
        ],
      },
      {
        heading: "Screen and print",
        body: [
          "Aztec is often displayed on a phone rather than printed. Keep the screen brightness up and the code large enough for the scanner. Avoid placing it under a cracked or dirty screen protector.",
          "For print, use a crisp printer and avoid textured paper. The central bullseye must stay clear; don't overlay a logo or text on it.",
          "Test with the actual gate reader. A phone app that supports Aztec may still not match the settings of a fixed transit scanner.",
        ],
      },
    ],
    tips: [
      "Keep the central bullseye clear.",
      "Increase screen brightness when showing a mobile pass.",
      "Test with the gate reader, not just a phone app.",
      "Use a module size that survives the print or screen resolution.",
      "Don't add a logo over the middle of an Aztec code.",
    ],
    faqs: [
      { q: "Does Aztec need a quiet zone?", a: "No. It is designed to work without a blank border, although a little space helps with handling." },
      { q: "How much data can Aztec hold?", a: "The format can hold more than 3,000 characters. This generator caps input at 3,000." },
      { q: "Is Aztec the same as QR?", a: "No. Both are 2D, but Aztec uses a central bullseye and a different error-correction scheme. Use a reader that supports Aztec." },
      { q: "Can I use Aztec on a phone screen?", a: "Yes. It is designed for screen display and is used for mobile boarding passes and transit tickets." },
      { q: "Why won't my phone scan it?", a: "Many consumer apps support only QR. Use an Aztec-capable reader or the app specified by the ticket issuer." },
    ],
    facts: [
      { label: "Type", value: "2D matrix code" },
      { label: "Capacity", value: "Over 3,000 characters; capped at 3,000 here" },
      { label: "Quiet zone", value: "Not required" },
      { label: "Finder pattern", value: "Central bullseye" },
      { label: "Typical use", value: "Tickets, transit, boarding passes" },
    ],
  },
];
