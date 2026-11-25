import type { ToolPage } from "./types";

export const qrPagesA: ToolPage[] = [
  {
    slug: "url",
    metaTitle: "Website URL QR Code Generator, Free and No Sign-Up",
    metaDescription:
      "Turn any web address into a QR code people can scan with a phone camera. Free, no sign-up, no watermark. Choose a permanent code or one that counts scans.",
    h1: "Website URL QR Code Generator",
    lede:
      "Paste a web address and get a QR code that opens the page when someone scans it. It's free for personal and business use, and the code is generated right in your browser.",
    steps: [
      {
        title: "Paste your link",
        text: "Enter the web address, such as `example.com/spring-sale`. If you leave off `https://`, it's added for you.",
      },
      {
        title: "Pick Direct or Tracked",
        text: "Direct stores the link in the code itself and never expires. Tracked sends scans through a QRWright link so you can count them.",
      },
      {
        title: "Design and download",
        text: "Choose colors, a frame, or a logo, run the built-in scan check, and download PNG, SVG, PDF, or another format.",
      },
    ],
    sections: [
      {
        heading: "Direct or Tracked: which to choose",
        body: [
          "A **Direct** code stores your URL in the pattern itself. A phone reads the address straight from the code and opens it, so nothing passes through QRWright, and the code keeps working for as long as your website does.",
          "A **Tracked** code stores a QRWright link, `https://qrcode.sritejam.com/r/...`, that forwards each visitor to your URL and adds one to a counter. You see total scans and scans per day, with bots and link-preview crawlers filtered out. The destination is kept inside the signed link rather than in a database, and no location, device, or personal data is collected.",
          "Neither type can be edited after printing. To change where a Tracked code goes, you make a new one, and Tracked codes rely on qrcode.sritejam.com staying online. For anything permanent, like an engraved plaque, Direct is the safer pick. The [static vs. dynamic QR code guide](/guides/static-vs-dynamic-qr-codes) explains the tradeoffs.",
        ],
      },
      {
        heading: "Keep the link short and stable",
        body: [
          "Every character in a URL becomes data in the code. A long address full of tracking parameters produces a denser pattern with smaller modules, which is harder to scan from a distance or at a small print size. Trim anything the page doesn't need, like session IDs or long campaign tags.",
          "Point the code at a page you expect to keep. If a site redesign changes the path, a printed Direct code will lead to an error page. A short, permanent address such as `example.com/menu`, which you can redirect on your own server, lets you move things later without reprinting.",
        ],
      },
      {
        heading: "Where a website code pulls its weight",
        body: [
          "A link code is most useful when the printed item has limited space and the details live online. Some common placements:",
        ],
        list: [
          "Product packaging that opens setup instructions or warranty registration",
          "Event posters that link to tickets or a signup form",
          "Shop windows that open your online store after hours",
          "Business cards and brochures that point to a portfolio or price list",
          "Receipts and table tents that ask for a review",
        ],
      },
    ],
    tips: [
      "If your site only works over plain `http://`, type the scheme yourself. Otherwise `https://` is added, and the page may not load.",
      "Scan a printed proof with at least two different phones, not just the code on your screen.",
      "Add a frame with a call to action like \"Scan to book a table\" so people know what they'll get.",
      "Download SVG for print so the code stays sharp at any size, or PNG at up to 4096 px. The [print size guide](/guides/qr-code-size-for-print) helps you pick dimensions.",
      "Making codes for many different URLs? The [bulk QR code generator](/bulk-qr-code-generator) turns a CSV of up to 500 rows into a ZIP of PNG or SVG files.",
    ],
    faqs: [
      {
        q: "Do website QR codes expire?",
        a: "A Direct code never expires, because the URL is part of the pattern. It works as long as the website it points to is online. A Tracked code also needs qrcode.sritejam.com to be online, since every scan passes through it.",
      },
      {
        q: "Can I change the URL after the QR code is printed?",
        a: "No. Direct codes contain the link itself, and Tracked codes carry the destination inside a signed link, so neither can be edited. To send people somewhere new, make a new code, or set up a redirect on your own website.",
      },
      {
        q: "Is it really free for business use?",
        a: "Yes. QRWright is free for personal and commercial use, with no sign-up, no watermark, no ads, and no limit on scans.",
      },
      {
        q: "What does scan tracking record?",
        a: "Only anonymous counts: total scans and scans per day. Bots and link-preview crawlers are filtered out, and nothing about the person scanning, such as location or device, is recorded.",
      },
      {
        q: "Why won't my URL QR code scan?",
        a: "Common causes are low contrast, a code printed too small, a missing quiet zone around the edges, or a very long URL that makes the pattern dense. Run the built-in scan check, then read [why QR codes fail to scan](/guides/why-qr-codes-fail-to-scan) for fixes.",
      },
    ],
  },
  {
    slug: "vcard",
    metaTitle: "vCard QR Code Generator: Free Digital Business Card",
    metaDescription:
      "Create a vCard QR code that saves your name, phone, email, and address to a phone's contacts in one scan. Free, works offline, and made in your browser.",
    h1: "vCard QR Code Generator for Digital Business Cards",
    lede:
      "Put your contact details in a QR code that phones can save straight to their address book. Print it on business cards, name badges, or the last slide of a presentation.",
    steps: [
      {
        title: "Fill in your details",
        text: "Enter the fields you want to share, from name and job title to phone, email, and address. Leave anything private blank.",
      },
      {
        title: "Style the code",
        text: "Add colors, a frame like \"Save my contact\", or your logo. With Auto error correction, the level goes up when a logo is added.",
      },
      {
        title: "Test, then download",
        text: "Scan it with your own phone to check the contact card, then download PNG, SVG, or PDF for print.",
      },
    ],
    sections: [
      {
        heading: "What's inside a vCard QR code",
        body: [
          "The code holds plain vCard 3.0 text, the standard format contact apps use to import and export address book entries. It opens with `BEGIN:VCARD` and `VERSION:3.0` and closes with `END:VCARD`. In between, each detail sits on its own labeled line: `FN` for the full name, `TEL` for phone numbers, `EMAIL`, `ADR` for the address, and so on.",
          "Because everything is stored in the pattern itself, the code works offline and never expires. Nothing is sent to QRWright, and there's no link that can break. The flip side is that vCard codes are Direct only, with no scan tracking and no editing, so a new number or job means a new code. The [vCard QR code guide](/guides/vcard-qr-codes) explains the format in more detail.",
        ],
      },
      {
        heading: "Fewer fields, easier scanning",
        body: [
          "Every field you fill in adds text, and more text means a denser code with smaller modules. A card with a name, mobile number, email, and website stays compact. Add a full street address and a long note, and the pattern gets much busier, which matters on a business card where the code has to fit in a corner.",
        ],
        list: [
          "**Name, organization, and job title:** help people remember where they met you",
          "**Mobile and work phone:** write numbers with a `+` and country code so they dial correctly from anywhere",
          "**Email and website:** check the spelling twice, since a printed typo can't be fixed",
          "**Street address and note:** include them only if they're genuinely useful, because they add the most data",
        ],
      },
      {
        heading: "What happens when someone scans it",
        body: [
          "The built-in camera on iPhone and Android recognizes the vCard and offers to add the contact. The person sees a preview of the card and taps to save it, with no retyping and no misspelled email addresses.",
          "How fields are labeled and arranged can vary a little between phones and contact apps. That's one more reason to scan your code with both an iPhone and an Android phone, if you can, before ordering a box of cards.",
        ],
      },
    ],
    tips: [
      "Add a frame with text like \"Scan to save my contact\" so people know the code adds a contact rather than opening a website.",
      "Keep strong contrast, with dark modules on a light background. Pale gradients and light-on-dark designs are harder for some cameras to read.",
      "If you add a logo, keep it small. [QR codes with logos](/guides/qr-codes-with-logos) has more advice on sizing and placement.",
      "Print a test card at actual size and scan it under ordinary indoor light before ordering a full run.",
      "Save the finished design in [My QR Codes](/my-codes) so you can download it again later from the same browser.",
    ],
    faqs: [
      {
        q: "Does a vCard QR code need an internet connection?",
        a: "No. The contact details are stored in the code, so a phone can read and save them offline. Only links inside the card, like your website, need a connection when someone taps them.",
      },
      {
        q: "Can I update a vCard QR code after printing?",
        a: "No. The details are part of the printed pattern, so a new phone number or job title means a new code. QRWright doesn't offer editable or tracked vCard codes.",
      },
      {
        q: "Do iPhone and Android cameras read vCard QR codes?",
        a: "Yes. The built-in camera app on recent iPhones and Android phones recognizes vCard data and offers to save the contact. Some older phones need a separate QR scanner app.",
      },
      {
        q: "Can I add a profile photo to the vCard?",
        a: "No. The generator uses text fields only. Even a small photo would add far more data than a scannable QR code can comfortably hold, so link to a website or profile page for a picture instead.",
      },
      {
        q: "Why does my vCard QR code look so dense?",
        a: "Each filled field adds characters. Removing the note or street address, or shortening a long job title, makes the pattern simpler and easier to scan at business-card size.",
      },
    ],
  },
  {
    slug: "pdf",
    metaTitle: "PDF QR Code Generator for Menus, Manuals, and Flyers",
    metaDescription:
      "Make a QR code that opens a PDF stored on Google Drive, Dropbox, OneDrive, or your own site. Free, no sign-up. See how to share the file so anyone can open it.",
    h1: "PDF QR Code Generator",
    lede:
      "Link a QR code to a menu, brochure, manual, or price list saved as a PDF. You keep the file wherever you like, and scanning opens it on the person's phone.",
    steps: [
      {
        title: "Share the PDF publicly",
        text: "Upload the file to Google Drive, Dropbox, OneDrive, or your website, and copy a link that anyone can open.",
      },
      {
        title: "Paste the link",
        text: "Paste it into the PDF field, then choose Direct for a permanent code or Tracked to count scans.",
      },
      {
        title: "Test while signed out",
        text: "Open the code on a phone that isn't signed in to your account to confirm the file loads, then download for print.",
      },
    ],
    sections: [
      {
        heading: "Your file stays where you put it",
        body: [
          "The QR code stores a link to the PDF, not the PDF itself. Even the largest QR code holds under 3 KB of data, far less than a typical brochure, so the file has to live online. QRWright doesn't host files, which also means you stay in control: delete the file or turn off sharing, and the code stops opening it.",
          "There's a useful side effect. If you replace the file at the same link, the printed code opens the new version. Google Drive lets you upload a new version of a file while keeping its link, and on your own website you can overwrite `menu.pdf` with an updated copy. Seasonal menus and price lists can change without new codes.",
        ],
      },
      {
        heading: "How to make the link public",
        body: [
          "The most common PDF QR problem is a link that only works for its owner. You won't notice when testing on your own phone, because you're signed in. Set sharing before you generate the code:",
        ],
        list: [
          "**Google Drive:** right-click the file, choose **Share**, set General access to **Anyone with the link** with the Viewer role, and click **Copy link**.",
          "**Dropbox:** click **Share** on the file, check that the link setting lets anyone with the link view it, and copy the link.",
          "**OneDrive:** choose **Share**, set the link so **Anyone** can view, and copy it. Some work and school accounts don't allow this.",
          "**Your own website:** upload the PDF and use its full address, like `https://example.com/files/menu.pdf`.",
        ],
      },
      {
        heading: "Example: a cafe menu",
        body: [
          "A cafe saves its menu as a PDF in Google Drive, shares it with **Anyone with the link**, and prints the same QR code on every table tent. When prices change, the owner uploads a new version of the same file, and the codes on the tables keep working.",
          "Choosing Tracked lets the cafe see how many scans happen each day, though not who scanned. Restaurants can also use the [menu QR code generator](/qr-code-generator/menu), which works the same way with a link to your menu.",
        ],
      },
    ],
    tips: [
      "Keep the PDF small. Export at screen resolution rather than print quality so it opens quickly on mobile data.",
      "Give the file a clear name, like `spring-menu.pdf`. Some phone viewers show the file name at the top.",
      "On your own website, keep the file at the same address. Renaming or moving it breaks every printed code.",
      "Add a frame with a call to action like \"Scan for the full menu\" or \"Scan for the manual\".",
      "For table tents and counter cards, check the [print size guide](/guides/qr-code-size-for-print) so the code scans from where people sit or stand.",
      "Not sure whether you need scan counts? [Static vs. dynamic QR codes](/guides/static-vs-dynamic-qr-codes) explains the difference.",
    ],
    faqs: [
      {
        q: "Can I upload a PDF to QRWright?",
        a: "No. QRWright doesn't host files. Upload the PDF to a service such as Google Drive, Dropbox, or OneDrive, or to your own website, then paste the public link.",
      },
      {
        q: "Why does my PDF QR code ask people to request access?",
        a: "The file is still shared privately. Change its sharing to **Anyone with the link** or your host's equivalent, then scan again. On Google Drive the link stays the same when you change sharing, so the printed code doesn't need to change.",
      },
      {
        q: "Can I update the PDF without reprinting the QR code?",
        a: "Yes, as long as the link stays the same. Replace the file at the same address, for example by uploading a new version in Google Drive or overwriting it on your server. The code itself can't be edited, so a new link means a new code.",
      },
      {
        q: "Is there a file size limit?",
        a: "Not on QRWright's side, since the file never passes through it. Your host sets its own limits, and large PDFs load slowly on phones, so keep the file as small as is practical.",
      },
      {
        q: "What happens if I delete the PDF?",
        a: "The code will open an error page instead. Both Direct and Tracked codes depend on the link staying live, and Tracked codes also need qrcode.sritejam.com to stay online.",
      },
    ],
  },
  {
    slug: "images",
    metaTitle: "Image QR Code Generator: Share Photos and Galleries",
    metaDescription:
      "Create a QR code that opens a photo, shared album, or folder. Paste a link from Google Photos, Dropbox, or your own site. Free, no sign-up, no watermark.",
    h1: "Image and Photo Gallery QR Code Generator",
    lede:
      "Point a QR code at a single photo or a whole shared album, so guests, customers, or clients can browse the pictures on their phone. Your images stay wherever they already live.",
    steps: [
      {
        title: "Create a share link",
        text: "Share the photo, album, or folder from a service like Google Photos, Google Drive, or Dropbox, or copy an image address from your website.",
      },
      {
        title: "Paste it in",
        text: "Paste the link into the Images field and pick Direct, or Tracked if you'd like a daily scan count.",
      },
      {
        title: "Design and check",
        text: "Style the code, run the scan check, and open the link on a phone that isn't signed in to your account.",
      },
    ],
    sections: [
      {
        heading: "One photo or a whole gallery",
        body: [
          "The code holds a link, so it can open anything a phone browser can show. A direct image address ending in `.jpg` or `.png` opens just that picture. A shared album or folder link opens the host's gallery view, where people can swipe through and, depending on your settings, download copies.",
          "QRWright doesn't store your photos. Only the link goes into the code, and your photo service's sharing settings decide who can view, download, or add pictures. For clips, use the [video QR code generator](/qr-code-generator/video), and for a portfolio saved as a document, the [PDF QR code generator](/qr-code-generator/pdf).",
        ],
      },
      {
        heading: "Ideas that work well",
        body: ["A few places where a photo link does more than a printed picture could:"],
        list: [
          "**Weddings and parties:** a card on each table that opens the shared album",
          "**Real estate:** a yard sign that opens interior photos of the home",
          "**Photographers:** a code on an invoice or print that opens the client's proofing folder",
          "**Bakeries and caterers:** a counter sign with photos of custom cakes or platters",
          "**Exhibitions:** a label that opens close-ups or archival images of an object",
        ],
      },
      {
        heading: "Privacy and the link you share",
        body: [
          "Anyone who scans the code, or photographs it and passes it on, can open the link. Treat the album as public even if the service calls the link unlisted, and leave out anything you wouldn't post openly, such as pictures that show personal documents or addresses.",
          "If guests should add their own pictures, check whether your album service allows contributions through a shared link and whether it asks visitors to sign in first. That's controlled by the host, not the QR code.",
          "Ending access is simple: turn off link sharing or delete the album. The printed code will then lead nowhere, which can be exactly what you want once an event is over.",
        ],
      },
    ],
    tips: [
      "For a single photo, use a link that opens the image itself, not a page that needs a login.",
      "Share web-sized copies when the album is for quick browsing. Full-resolution originals load slowly on mobile data.",
      "Give the album a clear name, since it's often the first thing people see when the link opens.",
      "Use a frame with text like \"Scan to see the photos\" and place the code where people pause, such as a table or an entrance sign.",
      "For yard signs and posters, the [print size guide](/guides/qr-code-size-for-print) helps you choose a size that scans from where people will stand.",
    ],
    faqs: [
      {
        q: "Does QRWright store my photos?",
        a: "No. QRWright doesn't host images. Upload them to a photo or file-sharing service or your own website, then paste the public link into the generator.",
      },
      {
        q: "How do I make a QR code for a Google Photos album?",
        a: "Open the album, tap **Share**, and create or copy a link. Paste it into the Images field, then test it on a phone that isn't signed in to your Google account.",
      },
      {
        q: "Can guests upload photos by scanning the code?",
        a: "Only if your album service allows it through the shared link. The QR code just opens the link, so upload options and sign-in requirements come from the host.",
      },
      {
        q: "Can I see how many people opened the gallery?",
        a: "Choose Tracked and QRWright counts scans, in total and per day, with bots filtered out. It can't see which photos people view or who they are, because the album lives on your host.",
      },
      {
        q: "What if I move the photos to a different album?",
        a: "The old link may stop working, and printed codes can't be redirected, whether Direct or Tracked. Make a new code for the new link, or leave the original album in place.",
      },
    ],
  },
  {
    slug: "social-media",
    metaTitle: "Social Media QR Code Generator: All Profiles in One",
    metaDescription:
      "Link one QR code to Instagram, TikTok, YouTube, LinkedIn, and more. A single profile opens directly; several open a free mobile links page. No sign-up.",
    h1: "Social Media QR Code Generator",
    lede:
      "Send people to one social profile, or to a simple links page that lists all of them. Fill in only the accounts you want to share.",
    steps: [
      {
        title: "Add your accounts",
        text: "Give the page a title, then enter handles or profile links for any of Instagram, X, TikTok, YouTube, LinkedIn, Facebook, Threads, Telegram, GitHub, and your website.",
      },
      {
        title: "Check the result",
        text: "One account gives a code that opens that profile directly. Two or more give a code that opens a mobile links page.",
      },
      {
        title: "Brand it and download",
        text: "Add your colors, a logo or built-in icon, and a frame like \"Follow us\", then download.",
      },
    ],
    sections: [
      {
        heading: "One profile or several",
        body: [
          "With a **single account** filled in, the code opens that profile directly, just like a regular link. You can make it Direct, which keeps working with no dependency on QRWright, or Tracked, which counts scans in total and per day.",
          "With **two or more**, the code opens a small mobile page at `qrcode.sritejam.com/p` showing your title and a button for each account. The page content is packed into the QR link itself, after the `#`. Browsers don't send that part of a link to the server, so your list of accounts is never stored on one.",
          "That approach has tradeoffs. The links page can't be tracked, and it needs qrcode.sritejam.com to be online to display. Each extra account also lengthens the link, so a page with many profiles makes a denser code.",
        ],
      },
      {
        heading: "Handles, links, and typos",
        body: [
          "You can type a handle or paste a full profile link. Copying the link from the app's share option is the surest way to get it right, especially on platforms where the profile address doesn't match the display name people see.",
          "A printed code can't be corrected, so open each button on your phone before you print. Be careful with renames, too: if you change a handle later, the old one may stop working or be claimed by someone else, and your printed code would send people to that person's account.",
        ],
      },
      {
        heading: "Where to put it",
        body: ["Social codes do best where people have a moment to spare and a reason to follow:"],
        list: [
          "Shop counters, receipts, and shopping bags",
          "Product packaging and hang tags",
          "Event booths, conference badges, and lanyards",
          "The closing slide of a talk or webinar",
          "Takeout boxes and delivery bags",
        ],
      },
    ],
    tips: [
      "If one platform matters most, fill in just that one. A single-profile code is simpler and can be tracked.",
      "Tell people what they'll get, such as \"Follow for daily specials\", using a frame with call-to-action text.",
      "A logo or built-in icon in the center shows at a glance what the code is for. Read [QR codes with logos](/guides/qr-codes-with-logos) before adding one.",
      "Keep the page title short. It appears at the top of the links page and adds to the code's data.",
      "For a page with hours, an address, and call buttons, try the [business page generator](/qr-code-generator/business-page) instead.",
    ],
    faqs: [
      {
        q: "Can one QR code link to all my social media accounts?",
        a: "Yes. Fill in two or more accounts and the code opens a mobile links page with a button for each. The page content lives in the code's link, not on a server.",
      },
      {
        q: "Which platforms can I add?",
        a: "Instagram, X, TikTok, YouTube, LinkedIn, Facebook, Threads, Telegram, and GitHub, plus a website link. If you only need Facebook, the [Facebook QR code generator](/qr-code-generator/facebook) does just that.",
      },
      {
        q: "Can I track scans on a multi-account code?",
        a: "No. Scan tracking is only available when a single account is filled in. The links page used for several accounts can't be tracked.",
      },
      {
        q: "Can I add another account after printing?",
        a: "No. The list of accounts is part of the printed code, so changes mean a new code. Include the accounts you plan to keep long-term.",
      },
      {
        q: "Does the links page depend on QRWright?",
        a: "Yes. The content is stored in the code, but the page needs qrcode.sritejam.com to load. For no dependency at all, use a single account in Direct mode.",
      },
    ],
  },
  {
    slug: "video",
    metaTitle: "Video QR Code Generator: YouTube, Vimeo, and More",
    metaDescription:
      "Make a QR code that plays a YouTube, Vimeo, or TikTok video, or a video file on your own site. Free, with no sign-up and optional scan counting.",
    h1: "Video QR Code Generator",
    lede:
      "Turn a video link into a QR code for packaging, posters, classrooms, or product manuals. Scanning opens the video on the viewer's phone, often right in the platform's app.",
    steps: [
      {
        title: "Copy the video link",
        text: "Use the share button on YouTube, Vimeo, or TikTok, or copy the address of a video file on your website.",
      },
      {
        title: "Paste and pick a mode",
        text: "Paste the link, then choose Direct for a code that never expires or Tracked to count scans.",
      },
      {
        title: "Style and test",
        text: "Add a frame like \"Watch the demo\", run the scan check, and play the video from your phone before printing.",
      },
    ],
    sections: [
      {
        heading: "Which link to use",
        body: [
          "Most people paste a platform link. A YouTube share link like `https://youtu.be/VIDEO_ID` is shorter than a full watch address with playlist and tracking parameters, so it makes a simpler code. Vimeo and TikTok share links work the same way.",
          "You can also link to a video file on your own website, such as an `.mp4`. Phones play it in the browser, so keep it short and compressed for viewers on mobile data. QRWright doesn't host videos, so the file has to be online and public already.",
          "To start at a specific moment, use the **Start at** option in YouTube's share menu on a computer, which adds a time like `t=90` to the link. Test it on a phone, since the app and the browser can handle it differently.",
        ],
      },
      {
        heading: "Unlisted, private, and restricted videos",
        body: [
          "An **unlisted** YouTube video suits QR codes well: anyone with the link can watch, but it won't show up in search or on your channel. A **private** video won't play for people who scan, because only accounts you've invited can see it.",
          "Check age restrictions and regional blocks, too. A video that plays for you at the office may be blocked for someone who isn't signed in or who lives in another country.",
        ],
      },
      {
        heading: "Good uses for video codes",
        body: ["Video is handy wherever showing beats explaining:"],
        list: [
          "Assembly or setup instructions on product packaging",
          "Recipe or care videos on labels",
          "A walk-through tour on a real estate sign",
          "Lesson recaps on classroom handouts",
          "Trailers and behind-the-scenes clips on event posters",
        ],
      },
    ],
    tips: [
      "If a YouTube share link ends with `?si=` and a string of characters, you can delete that part. The video still plays, and the code gets a little simpler.",
      "If you might replace the video later, link to a playlist instead. You can swap videos in a playlist without changing its link, so the printed code keeps working.",
      "Use separate Tracked codes on packaging and posters to compare where scans come from.",
      "Size the code for the viewing distance with the [print size guide](/guides/qr-code-size-for-print).",
      "Promoting a whole channel rather than one video? The [social media generator](/qr-code-generator/social-media) can open your profile instead.",
      "Start from one of the [templates](/templates) if you'd like a ready-made design to adjust.",
    ],
    faqs: [
      {
        q: "How do I make a QR code for a YouTube video?",
        a: "Open the video, tap **Share**, and copy the link. Paste it into the Video field, choose Direct or Tracked, and download the code.",
      },
      {
        q: "Do I need to host the video somewhere first?",
        a: "Yes. QRWright doesn't host files, so the video must already be online, for example on YouTube, Vimeo, TikTok, or your own website.",
      },
      {
        q: "Will the video open in the YouTube app?",
        a: "Usually, if the app is installed. Most phones hand YouTube links to the app automatically. Without it, the video plays in the browser.",
      },
      {
        q: "What happens if I delete the video?",
        a: "The code will lead to an unavailable video. Codes can't be edited after printing, so a replacement at a new link needs a new code, which is why a playlist link can be the safer choice.",
      },
      {
        q: "Does a Tracked code show how long people watched?",
        a: "No. It counts scans, in total and per day, with bots and link-preview crawlers filtered out. Watch time and audience details come from the video platform's own analytics.",
      },
    ],
  },
  {
    slug: "text",
    metaTitle: "Text QR Code Generator: Share Plain Text Offline",
    metaDescription:
      "Put plain text inside a QR code: instructions, a message, a serial number, or a puzzle clue. Phones read it with no internet. Free, with no sign-up needed.",
    h1: "Plain Text QR Code Generator",
    lede:
      "Store a short message directly in a QR code. When someone scans it, their phone shows the text, with no website and no internet connection involved.",
    steps: [
      {
        title: "Type your text",
        text: "Enter your message, keeping it under about 1,500 characters. Shorter text makes a cleaner code that scans more easily.",
      },
      {
        title: "Adjust the design",
        text: "Choose colors and a frame, but keep contrast high, since text codes get dense quickly.",
      },
      {
        title: "Scan and download",
        text: "Check that your phone shows the whole message, then download PNG, SVG, or PDF.",
      },
    ],
    sections: [
      {
        heading: "How a text QR code behaves",
        body: [
          "The text is stored in the pattern itself. A phone decodes and displays it, and depending on the phone, may offer to copy it or search for it. Nothing is fetched, so it works in a basement, on a plane, or on a trail with no signal.",
          "Text codes are Direct only. There's no link, so there's nothing to track, nothing to expire, and nothing sent to QRWright. It also means the text can't be changed once printed.",
        ],
      },
      {
        heading: "Why length matters",
        body: [
          "A QR code's capacity depends on its version, or grid size, and its error correction level. The largest version, 40, is 177 by 177 modules and holds up to 2,953 bytes at the lowest error correction level. A code that full has tiny modules and is hard for a phone camera to read.",
          "That's why it's best to stay under about 1,500 characters. In UTF-8, the encoding commonly used for QR text, accented letters take two bytes each and emoji take four, so they fill the code faster than plain English.",
          "If your message is long or likely to change, a link may serve better. Put the text on a web page and use a [website URL QR code](/qr-code-generator/url) instead. The page can be updated, and the code stays small.",
        ],
      },
      {
        heading: "Practical uses",
        body: ["Text codes fit anywhere a few lines of information need to travel with an object:"],
        list: [
          "Equipment labels with a model, serial number, and service date",
          "Clues for a scavenger hunt or escape room",
          "Short instructions on a shared printer or machine",
          "A hidden note inside a gift card or wedding favor",
          "Emergency information in places with no signal, like a cabin or boat",
        ],
      },
    ],
    tips: [
      "Put the most important line first. Some phones show only a short preview until the text is opened.",
      "Don't store passwords or private notes. Anyone who sees the code, or a photo of it, can read the text.",
      "For long text, skip the logo and choose error correction L or M, unless the code will face scratches or dirt. Higher levels leave less room for text, as the [error correction guide](/guides/qr-code-error-correction) explains.",
      "Sharing contact details? A [vCard QR code](/qr-code-generator/vcard) lets phones save them as a contact instead of just showing text.",
      "Sharing a Wi-Fi password? The [Wi-Fi QR code generator](/qr-code-generator/wifi) lets phones join the network directly.",
    ],
    faqs: [
      {
        q: "How much text can a QR code hold?",
        a: "The QR standard allows up to 2,953 bytes in the largest code at the lowest error correction level. For a code ordinary phones read easily, keep it under about 1,500 characters.",
      },
      {
        q: "Does a text QR code need the internet?",
        a: "No. The text is inside the code, so a phone can read it with no connection at all.",
      },
      {
        q: "Can I change the text after printing?",
        a: "No. The message is part of the printed pattern, so changing it means making a new code. If you expect changes, put the text on a web page and link to it instead.",
      },
      {
        q: "Can I use emoji or other languages?",
        a: "Yes, but each accented letter, non-Latin character, or emoji takes more space than a basic letter, so the code grows faster. Scan it on a couple of phones to make sure it displays correctly.",
      },
      {
        q: "Is a text QR code private?",
        a: "No. QR codes aren't encrypted, so anyone who scans one can read it. Keep passwords, personal data, and anything confidential out of text codes.",
      },
    ],
  },
  {
    slug: "business-page",
    metaTitle: "Business Page QR Code Generator with Contact Buttons",
    metaDescription:
      "Create a QR code that opens a mobile page for your business with buttons to call, email, get directions, and save your contact. Free, with no website needed.",
    h1: "Business Page QR Code Generator",
    lede:
      "Give customers a simple mobile page with your hours, address, and buttons to call, email, or get directions, without building a website. The whole page travels inside the QR code's link.",
    steps: [
      {
        title: "Enter your details",
        text: "Add your business name, a short tagline and about text, phone, email, website, address, opening hours, and up to two extra links.",
      },
      {
        title: "Choose an accent color",
        text: "Pick a color for the page, then style the QR code to match with colors, a logo, and a frame.",
      },
      {
        title: "Check it on your phone",
        text: "Scan the code to see the page as customers will, then download it for your door, counter, or flyers.",
      },
    ],
    sections: [
      {
        heading: "What customers see",
        body: [
          "Scanning opens a mobile page on `qrcode.sritejam.com/p` with your business name, tagline, about text, and opening hours. Buttons let people call you, send an email, get directions to your address, open your website, and save your details as a contact.",
          "It suits businesses without a website, or whose site is hard to use on a phone: a food truck, a hair salon, a contractor's van, a market stall, or a pop-up shop. If you do have a site, add it and it becomes one of the buttons.",
        ],
      },
      {
        heading: "Where the page content lives",
        body: [
          "There's no database behind the page. Everything you enter is packed into the QR link after the `#` symbol, and the page reads it from there when it opens. Browsers don't send the part after `#` to the server, so your details are never stored on one.",
          "That design comes with tradeoffs. The page can't be edited after printing, because the content is the code. It can't be tracked. And it needs qrcode.sritejam.com to stay online to display, so for a sign meant to last for years, weigh that against linking to a website you control.",
        ],
      },
      {
        heading: "Keep the text short",
        body: [
          "Every word you add makes the link longer and the QR pattern denser. A dense code needs to be printed larger and is more sensitive to glare, smudges, and low light.",
        ],
        list: [
          "**Tagline:** a few words, like \"Same-day shoe repair\"",
          "**About:** one or two sentences, not the full story",
          "**Opening hours:** a compact format such as `Mon-Fri 9-6, Sat 10-4`",
          "**Extra links:** save them for what customers ask about most, such as booking or a menu",
        ],
      },
    ],
    tips: [
      "Write the phone number with a `+` and country code so the call button works for visitors from abroad.",
      "Enter a full address, including city and postal code, so the directions button finds the right place.",
      "Print the code larger than you would a plain link, since it carries more data. The [print size guide](/guides/qr-code-size-for-print) can help.",
      "Use a frame with text like \"Scan for hours and directions\" on doors and windows.",
      "Only need to share contact details? A [vCard QR code](/qr-code-generator/vcard) saves them directly, with no web page involved.",
    ],
    faqs: [
      {
        q: "Do I need a website for a business page QR code?",
        a: "No. The page is built from the data in the code itself, so you don't need hosting or a domain. If you have a website, add it and it appears as a button.",
      },
      {
        q: "Can I update my opening hours after printing?",
        a: "No. The hours are part of the printed code, so new hours mean a new code. List your regular hours and announce holiday changes another way, such as a sign on the door.",
      },
      {
        q: "Where is my business information stored?",
        a: "Only in the QR code. The content sits in the link after the `#`, which browsers don't send to servers, so QRWright never stores it.",
      },
      {
        q: "Can I see how many people scan it?",
        a: "No. Business page codes can't be tracked. If scan counts matter, point a Tracked [website URL code](/qr-code-generator/url) at your own site instead.",
      },
      {
        q: "What happens if qrcode.sritejam.com goes offline?",
        a: "The page wouldn't load, since it needs the site to display. Codes that store details directly, like vCards, and Direct codes that link to your own website don't have this dependency.",
      },
    ],
  },
  {
    slug: "facebook",
    metaTitle: "Facebook QR Code Generator: Open Your Page in a Scan",
    metaDescription:
      "Create a QR code that opens your Facebook page. Paste the page link or username, add your colors and logo, and download it free. Optional scan counting.",
    h1: "Facebook QR Code Generator",
    lede:
      "Send customers from a sign, receipt, or flyer straight to your Facebook page. Enter the page's username or link, and the code opens it in the Facebook app or a browser.",
    steps: [
      {
        title: "Find your page address",
        text: "Open your page and copy its link, or note the username that comes after `facebook.com/`.",
      },
      {
        title: "Paste the link or username",
        text: "A username like `yourbakery` becomes `https://www.facebook.com/yourbakery` automatically.",
      },
      {
        title: "Style and download",
        text: "Add a frame like \"Find us on Facebook\", choose Direct or Tracked, and download the code.",
      },
    ],
    sections: [
      {
        heading: "Username or full link",
        body: [
          "If your page has a username, entering just that is enough. The generator builds the full address for you, which keeps the link short and the code simple.",
          "Pages without a username use a longer address with a numeric ID, like `facebook.com/profile.php?id=` followed by digits. Paste that whole link instead. Creating a username in your page settings gives you a cleaner address that's easier to print and remember.",
          "Before printing, make sure the page is published and visible to everyone. Age or country restrictions on the page will stop some visitors from seeing it.",
        ],
      },
      {
        heading: "What happens when someone scans",
        body: [
          "On a phone with the Facebook app, the link usually opens in the app. Without it, the page opens in the browser, where Facebook may ask visitors to log in before showing everything.",
          "Keep that in mind if the code's main job is sharing hours or a menu. A [business page QR code](/qr-code-generator/business-page) shows that information to everyone, no account required.",
        ],
      },
      {
        heading: "Direct or Tracked",
        body: [
          "A Direct code contains the Facebook link itself and keeps working as long as your page exists. A Tracked code sends scans through a QRWright link, so it also depends on qrcode.sritejam.com staying online, and in return you see total and daily scan counts with no personal data about the people scanning.",
          "Neither can be changed after printing. If you change your page's username, the old address may stop working, so settle on a username before you order a large print run.",
        ],
      },
    ],
    tips: [
      "Use a frame with a clear call to action, like \"Find us on Facebook\" or \"Follow for weekly specials\".",
      "Add your logo or a built-in icon in the center. Auto error correction raises the level when a logo is added.",
      "Make one Tracked code per placement, such as table tents and flyers, to see which gets more scans.",
      "Open the code while logged out of Facebook to see what a first-time visitor sees.",
      "Browse the [templates](/templates) for a ready-made design you can adjust to your page's colors.",
      "Want Instagram or TikTok on the same code? The [social media generator](/qr-code-generator/social-media) can put several accounts on one links page.",
    ],
    faqs: [
      {
        q: "How do I find my Facebook page URL?",
        a: "Open your page in a browser and copy the address bar, or use the share option in the app to copy the link. If your page has a username, it's the part after `facebook.com/`.",
      },
      {
        q: "Can people without Facebook see my page?",
        a: "Public pages can usually be viewed in a browser without an account, but Facebook may prompt visitors to log in. For details everyone must see, like opening hours, consider adding a business page code too.",
      },
      {
        q: "Will my Facebook QR code break if I change my username?",
        a: "It might. The old address may stop leading to your page, and a printed code can't be updated, whether it's Direct or Tracked. Choose your username before printing.",
      },
      {
        q: "Is this an official Facebook tool?",
        a: "No. QRWright is an independent, free generator. It simply makes a QR code that opens your page's public link.",
      },
      {
        q: "Can I see how many people scanned the code?",
        a: "Yes, if you choose Tracked. You'll see total scans and scans per day, with bots and link-preview crawlers filtered out, but no information about who scanned.",
      },
    ],
  },
  {
    slug: "wifi",
    metaTitle: "Wi-Fi QR Code Generator: Let Guests Join Without Typing",
    metaDescription:
      "Make a Wi-Fi QR code so guests join your network by scanning instead of typing a password. Works with iPhone and Android cameras. Free, made in your browser.",
    h1: "Wi-Fi QR Code Generator",
    lede:
      "Guests point their camera at the code and join your network without typing the password. Your network name and password are turned into a code right in your browser and never sent to QRWright's servers.",
    steps: [
      {
        title: "Enter network details",
        text: "Type the network name (SSID) exactly as it appears, including capital letters and spaces, then the password.",
      },
      {
        title: "Pick the security type",
        text: "Choose WPA/WPA2/WPA3 for most routers, WEP for very old ones, or none for an open network. Tick the hidden box if the network doesn't broadcast its name.",
      },
      {
        title: "Test, then print",
        text: "Join the network by scanning with an iPhone and an Android phone, then download and print the code.",
      },
    ],
    sections: [
      {
        heading: "What's inside a Wi-Fi QR code",
        body: [
          "The code holds a short text string in a format phone cameras recognize, for example `WIFI:T:WPA;S:MyNetwork;P:secret;;`. `T` is the security type, `S` the network name, and `P` the password. For a hidden network, `H:true;` is added so the phone knows to look for a network that isn't broadcasting.",
          "Some characters have special meaning in this format. If your network name or password contains a backslash, semicolon, comma, colon, or double quote, the generator puts a backslash in front of it automatically, so `pass;word` is stored as `pass\\;word`. The [Wi-Fi QR code format guide](/guides/wifi-qr-code-format) covers each field.",
          "Everything lives in the pattern itself, so the code works offline, never expires, and never touches QRWright's servers. Wi-Fi codes are Direct only, and when you change the password, you'll need a new code.",
        ],
      },
      {
        heading: "Which devices can join by scanning",
        body: [
          "The built-in camera on iPhones running iOS 11 or later and on Android 10 or later can read a Wi-Fi code and offer to join the network. Older Android phones may need a QR scanner app.",
          "Many laptops, smart TVs, and game consoles can't scan the code at all. Printing the network name and password in small text under the code gives them a backup.",
        ],
      },
      {
        heading: "Use a guest network",
        body: [
          "The password sits inside the code as plain text. Anyone who can see the code, or a photo of it, can join your network, and any scanner app will show them the password. QR codes have no encryption or access control.",
          "For a cafe, office lobby, or vacation rental, set up a **guest network** on your router and put that in the code instead. Many routers can keep guests apart from your own computers, printers, and cameras, and you can change the guest password without touching your main network. Good spots for a guest code:",
        ],
        list: [
          "A framed card on the cafe counter or on each table",
          "The welcome book or fridge door of a vacation rental",
          "A reception desk or meeting room wall",
          "Waiting areas in salons, clinics, and repair shops",
        ],
      },
    ],
    tips: [
      "Copy the network name from your router's settings or label to get the spelling and capitalization exactly right. One wrong character stops the phone from joining.",
      "Use a frame with text like \"Scan to join Wi-Fi\" so guests know what the code does.",
      "In busy spots, laminate the card or raise error correction so scuffs and spills don't stop it scanning. The [error correction guide](/guides/qr-code-error-correction) explains the levels.",
      "Need a card for every room or table? Download a print sheet to fit several codes on one A4 or US Letter page.",
      "Lost track of what's in an old code? Upload a photo of it to the [QR code scanner](/qr-code-scanner) to read the network name and password.",
      "When you change the Wi-Fi password, replace every printed code at the same time.",
    ],
    faqs: [
      {
        q: "How do I join Wi-Fi from a QR code on iPhone?",
        a: "Open the Camera app and point it at the code. On iOS 11 or later, a prompt appears offering to join the network; tap it, then confirm.",
      },
      {
        q: "Can Android phones scan Wi-Fi QR codes?",
        a: "Yes. Android 10 and later can join from the camera or from the QR option in Wi-Fi settings. Older versions may need a scanner app.",
      },
      {
        q: "Is it safe to put my Wi-Fi password in a QR code?",
        a: "It's about as safe as writing the password on a card. Anyone who scans the code can see it, so display it only where you'd share the password anyway, and give visitors a guest network.",
      },
      {
        q: "Do I need a new code if I change my Wi-Fi password?",
        a: "Yes. The old password is stored in the printed code, so it stops working once the password changes. The same goes for a new network name or security type.",
      },
      {
        q: "Why won't my phone join from the Wi-Fi QR code?",
        a: "Check that the network name matches exactly, including capitals and spaces, that the security type is right, and that the hidden setting matches your router. The phone also has to be in range of the network.",
      },
    ],
  },
];
