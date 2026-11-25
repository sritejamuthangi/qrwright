import type { ToolPage } from "./types";

export const qrPagesB: ToolPage[] = [
  {
    slug: "app",
    metaTitle: "App Download QR Code for iPhone and Android",
    metaDescription:
      "One QR code for both app stores. iPhone scans open the App Store, Android scans open Google Play, and other devices get your website. Free, no sign-up.",
    h1: "App Download QR Code Generator",
    lede:
      "Put one QR code on a poster, package, or slide and send iPhone users to the App Store and Android users to Google Play. No account and no app-store developer login needed.",
    steps: [
      {
        title: "Paste both store links",
        text: "Copy the App Store and Google Play addresses from your store listings. Add a website link as a fallback for tablets and computers.",
      },
      {
        title: "Choose Direct or Tracked",
        text: "Direct keeps the store links inside the code. Tracked counts how many people open the link, without recording who they are.",
      },
      {
        title: "Scan with both phones",
        text: "Test with an iPhone and an Android phone before printing. Each should land on the right store page, not the other platform's.",
      },
    ],
    sections: [
      {
        heading: "How one code opens two different stores",
        body: [
          "When you enter both store links, the QR code points to a small QRWright page that reads the device in the browser and forwards to the matching store. That page is built from data carried in the link itself, after the `#` symbol, so the store addresses are never stored on a server.",
          "If you enter only one store link, the code points straight at it with no intermediate page. That is simpler, but an iPhone user scanning an Android-only link will see the Play Store website rather than an app listing.",
          "The detection is deliberately basic: iPhone and iPad go to the App Store, Android goes to Google Play, and everything else goes to the website you provide, or to one of the stores if no website is set.",
        ],
      },
      {
        heading: "What a scan can and cannot tell you",
        body: [
          "A QR code can open a store listing. It cannot install an app, and it cannot reliably tell whether the app is already installed. Modern phones and browsers limit that kind of detection for privacy, so don't promise a seamless \"open if installed, download if not\" experience.",
          "Tracked codes count link opens, not installs or purchases. Use the count as a rough measure of interest in a poster, flyer, or packaging insert. For install numbers, read the analytics in App Store Connect and the Google Play Console.",
          "Store links are long, and long content makes a denser QR code. Print at a generous size, keep strong contrast, and avoid putting the code where it will be curved or scuffed.",
        ],
      },
      {
        heading: "Where an app code earns its place",
        body: ["An app download code works best when someone already has your product in hand or is already interested:"],
        list: [
          "**Packaging inserts:** a card that turns a new purchase into an installed app",
          "**Trade show booths:** one code on the backdrop instead of two platform logos",
          "**Restaurant tables:** order-ahead or loyalty apps on a table tent",
          "**Presentations:** the last slide of a pitch or workshop",
          "**Print ads:** a magazine or poster ad that sends readers to the listing",
        ],
      },
    ],
    tips: [
      "Use the full store URLs from your listings, including the app ID. Shortened links can expire or change.",
      "Add a website fallback so someone on a laptop or an unsupported device still lands somewhere useful.",
      "Print the code at 3 cm (about 1.2 in) wide or larger. Store URLs are long, so the pattern is dense.",
      "Run the built-in scan check, then test on a real iPhone and a real Android phone.",
      "Tracked codes and the multi-store Direct app page need qrcode.sritejam.com online. A Direct code linking to a single store does not.",
    ],
    faqs: [
      {
        q: "Can one QR code really open both the App Store and Google Play?",
        a: "Yes. Enter both store links and the code opens a tiny QRWright page that detects the phone and forwards to the right store. The store addresses travel inside the link, not in a database.",
      },
      {
        q: "Does the QR code work if the app is already installed?",
        a: "It opens the store listing either way. Detecting an installed app from a browser is unreliable and often blocked, so QRWright doesn't try. The person can open the app themselves after landing on the listing.",
      },
      {
        q: "Can I track app installs with a QR code?",
        a: "No. Tracked codes count link opens only. App installs and purchases are reported by App Store Connect and Google Play Console, which don't share install attribution with a QR redirect.",
      },
      {
        q: "Why does my app QR code look so dense?",
        a: "App store URLs are long, and every character becomes part of the pattern. Use the canonical listing URL rather than a link wrapped in campaign parameters, and print the code large enough.",
      },
      {
        q: "Do I need a developer account to make the code?",
        a: "No. You only need the public store links. A developer account is required to publish the app, not to link to it.",
      },
    ],
  },
  {
    slug: "menu",
    metaTitle: "Restaurant Menu QR Code Generator, Free",
    metaDescription:
      "Make a QR code that opens your restaurant menu on any phone. Link a PDF or menu page, print it for table tents, and update the file without reprinting. Free.",
    h1: "Restaurant Menu QR Code Generator",
    lede:
      "Give every table a menu that opens in one scan. Link a PDF, a menu page on your site, or an online ordering page, and keep the code on the table for years.",
    steps: [
      {
        title: "Put your menu online",
        text: "Host the menu as a PDF or a page on your website, or use your ordering platform's public menu link. Check that it opens without a login.",
      },
      {
        title: "Make the code",
        text: "Paste the link, add a \"See the menu\" frame if you like, and choose Direct for permanence or Tracked to count scans.",
      },
      {
        title: "Test at the table",
        text: "Scan from a table tent at real distance, in dim light, with two different phones. Then print the final size.",
      },
    ],
    sections: [
      {
        heading: "A menu code is a link, not a file",
        body: [
          "QRWright doesn't host PDFs or images. The code stores the address of your menu, and your file stays with your website, Google Drive, Dropbox, or ordering provider. That keeps the code small and puts you in control of the file.",
          "The practical benefit is updates. If you replace the PDF at the same address, or edit the same menu page, every printed code opens the new version. Change prices for a new season without collecting and reprinting table tents.",
          "Keep the address stable. Renaming a file from `menu.pdf` to `spring-menu.pdf` breaks every code already on a table. If you need a new file name, keep the old address as a redirect on your site.",
        ],
      },
      {
        heading: "Design for a table, not a desk",
        body: [
          "A menu code is scanned at arm's length, often by someone holding a phone in one hand. Give it room. A table tent with a 4 cm code, a clear \"Scan for the menu\" line, and plenty of white space works better than a busy card crowded with logos and social handles.",
          "Use dark modules on a light background. Laminating or printing on waterproof stock helps in a dining room, but gloss can throw a glare from a pendant light. A matte finish scans more reliably.",
          "If the menu is long, say so. A small line like \"Full menu, prices, and allergens\" tells people what they'll get and reduces hesitation.",
        ],
      },
      {
        heading: "Direct or Tracked for a restaurant",
        body: [
          "A **Direct** code is the safest choice for a permanent table tent. It works as long as your menu link works, with no dependency on QRWright. A **Tracked** code adds a daily scan count, which is useful for comparing tables, placements, or a seasonal campaign.",
          "Tracked codes route through `qrcode.sritejam.com`, so they need that domain to stay online. Counts are anonymous totals, not customer data. You won't see who scanned, where they sat, or what they ordered.",
          "Many restaurants use a Direct code on permanent table tents and a Tracked code on a temporary insert, such as a specials card or a flyer, so they can measure the campaign without tying the everyday menu to a redirect.",
        ],
      },
    ],
    tips: [
      "Test the menu link in a private browser window. A link that works only while signed in to your Google account will fail for customers.",
      "Keep the PDF under a few megabytes and export it for screen viewing so it opens quickly on mobile data.",
      "Include allergens and prices in the file itself. A code that opens a stale menu creates more work for staff.",
      "Print the code at least 3 cm wide, and larger on a poster or window decal.",
      "Add a short call to action. \"Scan for the menu\" beats a bare code on a table.",
      "If you change the link, print new codes. The pattern itself cannot be edited.",
    ],
    faqs: [
      {
        q: "Do I need to pay a monthly fee for a menu QR code?",
        a: "No. QRWright is free, with no account and no scan limit. You only pay for whatever you use to host the menu file or page, and many options are free.",
      },
      {
        q: "Can I update the menu without reprinting the QR code?",
        a: "Yes, if the link stays the same. Replace the PDF at the same address or edit the same menu page. The printed code points to the address, not to a copy of the file.",
      },
      {
        q: "What if the restaurant has no website?",
        a: "Use a shared PDF from Google Drive, Dropbox, or OneDrive set to \"anyone with the link\", or your ordering platform's public menu page. You don't need a full website to host a menu.",
      },
      {
        q: "Should the QR code be Direct or Tracked?",
        a: "Direct is best for permanent table tents because it has no dependency on QRWright. Tracked is useful for temporary campaigns where you want a daily scan count.",
      },
      {
        q: "Why won't the menu open when customers scan?",
        a: "The usual cause is file sharing set to private, followed by a link that needs a login. Open the link in a private window on a phone that isn't signed in to your account to check it.",
      },
    ],
  },
  {
    slug: "email",
    metaTitle: "Email QR Code Generator with a Pre-Filled Message",
    metaDescription:
      "Create a QR code that opens a new email with the address, subject, and message filled in. Free, works offline, and needs no email marketing account.",
    h1: "Email QR Code Generator",
    lede:
      "Let someone point a phone at your code and start an email to you, with the subject and first line already written. Useful on posters, packaging, and service counters.",
    steps: [
      {
        title: "Enter the address",
        text: "Type the inbox that should receive replies. Double-check the spelling, because a printed code can't be corrected.",
      },
      {
        title: "Add a subject and message",
        text: "Give people a reason to write, such as \"Quote request\" or \"Table booking\". Keep the pre-filled message short and easy to edit.",
      },
      {
        title: "Scan and send a test",
        text: "Open the code on a phone, confirm the right mail app opens with the fields filled, and send yourself a test email.",
      },
    ],
    sections: [
      {
        heading: "What the code actually contains",
        body: [
          "An email QR code stores a `mailto:` link. It includes the recipient address and can include a subject and body, encoded so spaces and punctuation survive the trip. When someone scans, their phone offers to open a mail app with a new message already started.",
          "Nothing is sent automatically. The person still has to tap send, which is good: it keeps the interaction consensual and lets them add context. The code also works offline, since the address is inside the pattern.",
          "Email codes are always Direct. There is no scan tracking and no way to edit the address after printing, so treat the code like a printed business card.",
        ],
      },
      {
        heading: "Write a subject that gets replies",
        body: [
          "The subject line is the one part of the message you can shape in advance. A vague \"Hello\" gives the recipient nothing to work with. A specific subject tells them what to do and makes the message easier to route.",
        ],
        list: [
          "**Service businesses:** \"Quote request from your QR code\"",
          "**Restaurants and venues:** \"Table booking\" or \"Private event enquiry\"",
          "**Support teams:** \"Help with my order\"",
          "**Creators and freelancers:** \"Project enquiry\"",
          "**Feedback:** \"Feedback on my visit\"",
        ],
      },
      {
        heading: "Where an email code works better than a link",
        body: [
          "A code that opens a contact form on your website needs a connection and a working page. An email code opens the phone's mail app even with a weak signal, and it works on old phones that struggle with heavy web pages.",
          "It is a good fit for places where people already have a question in mind: a machine that needs servicing, a product with a missing part, a venue they want to book, or a noticeboard where someone wants to respond without copying an address by hand.",
          "The tradeoff is friction. Not everyone has a mail app configured, and some people prefer web forms. If you need structured data, such as an order number, a form is usually better. If you just want a message, email is hard to beat.",
        ],
      },
    ],
    tips: [
      "Use an address you actually monitor. A code that invites messages and never answers is worse than no code.",
      "Keep the pre-filled body to one or two lines. Long text is awkward to edit on a phone.",
      "Avoid putting sensitive information in the subject or body, since anyone who scans can read it.",
      "Test on both iPhone and Android. Mail app handling of `mailto:` links varies a little.",
      "If you change the address, make a new code. There is no redirect to update.",
    ],
    faqs: [
      {
        q: "Does an email QR code send the email automatically?",
        a: "No. It opens a new message in the person's mail app with the address, subject, and body filled in. They still choose whether to send it.",
      },
      {
        q: "Does it work without an internet connection?",
        a: "The code opens the mail app offline because the address is stored in the pattern. Sending the message still needs a connection.",
      },
      {
        q: "Can I track how many people scan an email code?",
        a: "Not with QRWright. Email codes are Direct only, so there is no count. If you need a count, use a Tracked URL code that opens a contact page instead.",
      },
      {
        q: "Why does the subject line look garbled?",
        a: "Some older mail apps handle encoded spaces and punctuation poorly. Keep the subject short and avoid unusual symbols, then test on the phones your audience uses.",
      },
      {
        q: "Can I use a different address for different campaigns?",
        a: "Yes, but each address needs its own code. A printed code cannot be redirected, so make one code per inbox if you want to separate enquiries.",
      },
    ],
  },
  {
    slug: "phone",
    metaTitle: "Phone Number QR Code Generator, Free",
    metaDescription:
      "Make a QR code that dials a phone number when scanned. Add the country code, print it on signs and cards, and let people call without typing. Free, no sign-up.",
    h1: "Phone Number QR Code Generator",
    lede:
      "Turn a phone number into a code people can scan to call. Good for front desks, service vans, event stands, and anywhere a number is hard to read or type.",
    steps: [
      {
        title: "Enter the number",
        text: "Include the country code, such as +1 or +44, so the code works for visitors with foreign SIM cards.",
      },
      {
        title: "Add a reason to call",
        text: "Put a line next to the code, like \"Call for a table\" or \"24-hour breakdown line\", so people know what happens next.",
      },
      {
        title: "Scan and call",
        text: "Test with a phone that has a SIM card. The dialer should open with the number filled in, without placing the call automatically.",
      },
    ],
    sections: [
      {
        heading: "What happens when someone scans",
        body: [
          "The code contains a `tel:` link. A phone recognises it and offers to open the dialer with the number ready. The call starts only after the person taps the call button, so a scan can't dial anyone by accident.",
          "Because the number is stored in the pattern, the code works offline and never expires. It is always Direct, with no scan count and no editing. If the number changes, the printed code is out of date.",
          "A `tel:` link is handled by the phone's default dialer. On a tablet or a computer without calling, the scan may show the number as text or do nothing. That's normal.",
        ],
      },
      {
        heading: "Format the number for real callers",
        body: [
          "Always include the country code. A local number like `555 010 0199` may work for neighbours and fail for everyone else. Written internationally, the same number is `+1 555 010 0199`.",
          "Spaces, dashes, and parentheses are usually fine; the dialer strips them. Keep the number itself complete. Avoid extensions unless you know the dialer supports pauses, because many phones ignore them.",
          "If the line is staffed only during business hours, say so next to the code. A code that invites calls at midnight creates missed expectations.",
        ],
      },
      {
        heading: "Good places for a call code",
        body: ["A phone code removes the small friction of typing a number correctly, which matters more than it sounds:"],
        list: [
          "**Service vehicles:** a code on the back door for bookings or breakdowns",
          "**Shop windows:** an after-hours enquiry line when the door is locked",
          "**Event stands:** a sales line for people who want to follow up later",
          "**Property signs:** a letting or viewing line for passers-by",
          "**Clinic and salon cards:** reception numbers on appointment cards",
        ],
      },
    ],
    tips: [
      "Use a business number rather than a personal mobile if the code will be public.",
      "Test from a phone on a different network, not just the one in your pocket.",
      "Put the number in text beside the code as well. Some people prefer to dial, and it helps if the code is damaged.",
      "Keep the code away from reflective surfaces and curved glass, which can make it hard to scan.",
      "If the number is likely to change, use a Tracked URL code to a contact page instead, or accept that you'll reprint.",
    ],
    faqs: [
      {
        q: "Does scanning the code place the call automatically?",
        a: "No. It opens the dialer with the number filled in. The person taps the call button themselves, so there is no accidental charge.",
      },
      {
        q: "Why does the number need a country code?",
        a: "The country code makes the number work from any phone, including visitors roaming on a foreign SIM. Without it, the dialer may guess the wrong country.",
      },
      {
        q: "Can I track calls made from a QR code?",
        a: "Not with QRWright. Phone codes are Direct only, with no scan count. A call-tracking service with its own number can measure calls, but that is separate from the code.",
      },
      {
        q: "Does the code work on a tablet or computer?",
        a: "It may show the number as text or do nothing, because those devices often can't place a call. The code is designed for phones.",
      },
      {
        q: "What happens if the number changes?",
        a: "The printed code still dials the old number. Make a new code and replace the printed material. There is no way to edit a `tel:` code.",
      },
    ],
  },
  {
    slug: "sms",
    metaTitle: "SMS QR Code Generator with a Ready-to-Send Text",
    metaDescription:
      "Create a QR code that opens a text message with the number and message filled in. Free, no account. Useful for feedback lines, bookings, and text-to-join campaigns.",
    h1: "SMS QR Code Generator",
    lede:
      "Let people scan and send a text without typing a number. The message opens ready to send, with your number and wording already in place.",
    steps: [
      {
        title: "Enter the number",
        text: "Use the full international number, including the country code, for a text line you control.",
      },
      {
        title: "Write a short message",
        text: "Keep it under about 160 characters. A clear opener like \"I'd like to book\" is easier to send than a blank message.",
      },
      {
        title: "Test on both platforms",
        text: "Scan with an iPhone and an Android phone. Confirm the messaging app opens with the number and text filled in.",
      },
    ],
    sections: [
      {
        heading: "What the scan does",
        body: [
          "The code contains an `SMSTO:` link with the number and an optional message. A phone opens its messaging app and prepares a text. The person still taps send, and standard carrier message rates apply.",
          "Because everything is in the pattern, the code works offline and never expires. It is always Direct: no scan count and no editing. The number and wording are fixed once printed.",
          "Handling varies by phone. Most modern iOS and Android devices understand `SMSTO:`. A few older devices may show the raw link or open the app without pre-filling the message. Test before a print run.",
        ],
      },
      {
        heading: "When a text beats a form or a call",
        body: [
          "A text is low-effort and works on almost any phone, including ones with poor data connections. It is a good fit when the reply is short and the person is already on the move.",
        ],
        list: [
          "**Appointment reminders:** \"CONFIRM\" or \"CANCEL\" to a booking line",
          "**Feedback:** a short comment sent from a table card or receipt",
          "**Text-to-join:** a keyword that adds someone to a list, if your provider supports it",
          "**Lost and found:** a number to text about an item left behind",
          "**Event questions:** a question line for a conference or workshop",
        ],
      },
      {
        heading: "Be clear about cost and consent",
        body: [
          "The sender pays their normal message rate, which may be international if your number is in another country. Say so if that could surprise people, especially on a public sign.",
          "For marketing lists, a scan is not consent. If you plan to send follow-up messages, use a proper opt-in process and follow local rules, such as the TCPA in the United States or GDPR in the EU. The QR code only starts a conversation; it doesn't grant permission for anything else.",
          "Never ask people to text sensitive information such as card numbers, passwords, or identity documents. SMS is not a secure channel.",
        ],
      },
    ],
    tips: [
      "Keep the pre-filled message short and easy to personalise.",
      "Use a dedicated number for campaigns so replies don't mix with personal messages.",
      "Say whether replies are monitored, and during what hours.",
      "Test that the number accepts SMS, not just calls. Some business lines are voice-only.",
      "If you need scan counts, use a Tracked URL code to a contact page instead; SMS codes cannot be tracked.",
    ],
    faqs: [
      {
        q: "Does the QR code send the text automatically?",
        a: "No. It opens the messaging app with the number and message filled in. The person reviews and taps send.",
      },
      {
        q: "Do people pay to send the text?",
        a: "They pay their carrier's normal SMS rate, which may be an international rate if your number is in another country. The QR code itself is free.",
      },
      {
        q: "Can I track how many texts come from the code?",
        a: "Not with QRWright. SMS codes are Direct only, so there is no scan count. Your messaging provider may report incoming messages to the number.",
      },
      {
        q: "Why does the message not appear on some phones?",
        a: "Older or unusual messaging apps may ignore the pre-filled body. Keep the message short, test on the phones your audience uses, and make the number the reliable part.",
      },
      {
        q: "Can I use a short code?",
        a: "The generator expects a normal phone number in international format. Short codes and keywords depend on your SMS provider and are not handled specially.",
      },
    ],
  },
  {
    slug: "whatsapp",
    metaTitle: "WhatsApp QR Code Generator with a Ready Message",
    metaDescription:
      "Make a QR code that opens a WhatsApp chat with your number and a pre-filled message. Free, no sign-up. Good for orders, bookings, and customer support.",
    h1: "WhatsApp QR Code Generator",
    lede:
      "Send customers straight into a WhatsApp chat with your business number and a message already typed. No username to search for and no number to copy.",
    steps: [
      {
        title: "Enter the WhatsApp number",
        text: "Use the number tied to WhatsApp Business, with the country code and no plus sign. The generator removes spaces for you.",
      },
      {
        title: "Write the opening message",
        text: "A short line like \"Hi, I'd like to order\" gives people a starting point they can edit before sending.",
      },
      {
        title: "Scan and check",
        text: "Open the code on a phone with WhatsApp installed. Confirm the chat opens with your business name and the message ready.",
      },
    ],
    sections: [
      {
        heading: "How the link works",
        body: [
          "The code stores a `wa.me` link: WhatsApp's official click-to-chat address. Scanning opens WhatsApp, either the app or WhatsApp Web, and starts a conversation with the number you entered. The pre-filled message appears in the input box but is not sent until the person taps send.",
          "The number must be in international format without punctuation. For example, a UK number written `+44 20 7946 0958` becomes `442079460958` in the link. The generator strips spaces, dashes, and the leading plus.",
          "A WhatsApp code can be Direct or Tracked. Direct keeps the chat link inside the pattern and works forever. Tracked adds a short QRWright link so you can count how many people open the chat, though not how many actually send a message.",
        ],
      },
      {
        heading: "Set up the business side first",
        body: [
          "Use a number that is actually on WhatsApp. If you haven't registered it yet, install WhatsApp or WhatsApp Business and complete verification before printing codes. A code to an unregistered number leads to an error.",
          "WhatsApp Business adds a profile name, description, catalog, and quick replies. Fill those in before a campaign. Someone who scans a code on a shop counter should see a recognizable business, not an empty profile.",
          "If several staff answer messages, use WhatsApp Business's linked devices or a shared inbox process. A code that invites messages but leaves them unanswered is a support problem, not a QR problem.",
        ],
      },
      {
        heading: "Good uses for a WhatsApp code",
        body: ["WhatsApp is often the default messaging app in many countries, which makes a chat code unusually effective:"],
        list: [
          "**Orders:** a code on a menu, price list, or packaging that starts an order chat",
          "**Bookings:** salons, clinics, and repair shops that schedule by message",
          "**Support:** a code on a receipt or product label for after-sales help",
          "**Community groups:** a code on a flyer that opens a chat with the organiser",
          "**Market stalls:** a code on a card so buyers can ask about sizes or delivery",
        ],
      },
    ],
    tips: [
      "Use WhatsApp Business rather than a personal number for a public code.",
      "Test the code on a phone that has never messaged you, so you see the first-contact experience.",
      "Keep the pre-filled message short. People will edit it, and a long paragraph is awkward on a phone.",
      "If you change numbers, print new codes. A WhatsApp code cannot be redirected.",
      "Tracked codes count chat opens, not conversations. Use WhatsApp's own tools to measure replies.",
    ],
    faqs: [
      {
        q: "Does the code send the WhatsApp message automatically?",
        a: "No. It opens the chat with the message in the input box. The person can edit or delete it before tapping send.",
      },
      {
        q: "Why does the number have no plus sign?",
        a: "WhatsApp's click-to-chat links use digits only, with the country code first. The generator removes spaces, dashes, and the plus for you.",
      },
      {
        q: "Can I use a normal WhatsApp account instead of WhatsApp Business?",
        a: "Yes, the link works with either. A Business profile is better for a public code because it shows a name, description, and catalog.",
      },
      {
        q: "Can I count how many people message me?",
        a: "A Tracked code counts how many people open the chat link. It can't tell whether they send a message or what they say. WhatsApp's own inbox shows the conversations.",
      },
      {
        q: "What happens if the number isn't on WhatsApp?",
        a: "WhatsApp shows an error or invites the person to invite the number. Register and verify the number on WhatsApp before printing the code.",
      },
    ],
  },
  {
    slug: "event",
    metaTitle: "Event QR Code Generator: Add to Calendar in One Scan",
    metaDescription:
      "Create a QR code that adds your event to a phone calendar, with the date, time, location, and description filled in. Free, offline, and no event platform needed.",
    h1: "Event QR Code Generator",
    lede:
      "Put the details of a wedding, conference, workshop, or concert into a code that adds the event to a phone calendar in one scan. No ticketing account required.",
    steps: [
      {
        title: "Enter the event details",
        text: "Add the title, start and end times, location, and a short description. Choose an all-day event if there is no specific time.",
      },
      {
        title: "Style the code",
        text: "Use a frame like \"Save the date\" or \"Add to calendar\" so people know the scan changes their calendar rather than opening a page.",
      },
      {
        title: "Test the calendar entry",
        text: "Scan with an iPhone and an Android phone, check the time zone and location, then delete the test entry before printing.",
      },
    ],
    sections: [
      {
        heading: "What the code adds to a calendar",
        body: [
          "The code contains a standard calendar event in iCalendar format, the same format used by `.ics` files. Phones recognise it and offer to add the event, with the title, start and end, location, and description filled in.",
          "Everything is stored in the pattern, so the code works offline and never expires. It is always Direct: there is no scan count, and the details cannot be changed after printing. If the date moves, you need a new code.",
          "Support varies between scanners and calendar apps. A compatible reader offers a preview or a save action; some native cameras only recognise web links. Test on the phones your guests are likely to use.",
        ],
      },
      {
        heading: "Get the time zone right",
        body: [
          "The event time is stored without a time zone, so the phone interprets it in its own local time. That is fine when everyone is in the same place. It can be confusing for a webinar with guests in several countries.",
          "For a remote event, put the time zone in the title or description, for example \"10:00 AM Eastern\", and consider linking to a world-clock page. For an in-person event, the local time is usually what guests expect.",
          "All-day events are stored as dates rather than times, which avoids most time-zone confusion. Use them for festivals, birthdays, and multi-day notices where a precise start time isn't the point.",
        ],
      },
      {
        heading: "Where to put an event code",
        body: ["A calendar code turns a printed notice into something people act on immediately:"],
        list: [
          "**Wedding invitations:** a details card with the ceremony and reception times",
          "**Conference badges:** a code that adds the whole schedule",
          "**Workshop flyers:** a reminder that lands in the calendar instead of a pocket",
          "**Concert posters:** the date, venue, and doors time in one scan",
          "**Community noticeboards:** a code for a meeting or volunteer day",
        ],
      },
    ],
    tips: [
      "Include an end time. A calendar entry without one can block the whole day.",
      "Put the venue name and address in the location field so map links work.",
      "Keep the description short. It is not the place for a full agenda or terms and conditions.",
      "Test the time zone with a phone set to a different region if you expect international guests.",
      "Print the code at a size that suits the viewing distance, and add \"Add to calendar\" as a label.",
    ],
    faqs: [
      {
        q: "Does the QR code add the event automatically?",
        a: "It offers to add it. The phone shows a preview or a confirmation prompt, and the person chooses whether to save it.",
      },
      {
        q: "Can I update the event after printing the code?",
        a: "No. The details are stored in the pattern. If the date, time, or venue changes, make a new code and replace the printed material.",
      },
      {
        q: "Why is the time wrong on my phone?",
        a: "The event is stored without a time zone and shown in the phone's local time. If guests are in another region, put the time zone in the title or description.",
      },
      {
        q: "Does it work with Google Calendar and Apple Calendar?",
        a: "Yes. The code uses the standard iCalendar format that both platforms understand, along with most other calendar apps.",
      },
      {
        q: "Can I track how many people add the event?",
        a: "Not with QRWright. Event codes are Direct only. If you need attendance numbers, use a ticketing or registration platform and link to it instead.",
      },
    ],
  },
  {
    slug: "location",
    metaTitle: "Location QR Code Generator for Addresses and Maps",
    metaDescription:
      "Make a QR code that opens an address or coordinates in Google Maps. Great for storefronts, parking, trailheads, and event venues. Free and no sign-up.",
    h1: "Location QR Code Generator",
    lede:
      "Send people to the right door, car park, or trailhead with a code that opens the location in their map app. Use an address or exact coordinates.",
    steps: [
      {
        title: "Choose address or coordinates",
        text: "Search for the place by name or address, or enter latitude and longitude for a spot without a street address.",
      },
      {
        title: "Check the pin",
        text: "Open the generated map link and confirm the pin lands on the entrance, not the middle of the block or a service road.",
      },
      {
        title: "Print where it helps",
        text: "Put the code on a sign, ticket, or confirmation card, with a line like \"Scan for directions\".",
      },
    ],
    sections: [
      {
        heading: "Address or coordinates?",
        body: [
          "An address or place-name search is easiest for somewhere with a proper street address. It also lets the map app choose the best result, which is usually right for shops, hotels, and offices.",
          "Coordinates are better for places without a reliable address: a trailhead, a beach access point, a field, a parking bay, or a temporary venue. Latitude and longitude point to an exact spot, but a small mistake can send someone to the wrong side of a river.",
          "The generator uses a Google Maps search link by default. On Android, you can choose a `geo:` link instead, which opens the phone's default map app. iPhones don't handle `geo:` reliably, so use the Google Maps link if your audience is mixed.",
        ],
      },
      {
        heading: "Test the last hundred metres",
        body: [
          "A pin that looks right on a laptop can be wrong on the ground. Check the entrance, the car park, and any one-way streets. If the venue is inside a larger complex, say which door or level in the description.",
          "For a shop, stand outside and scan the code as a customer would. Does the map open with the shop name visible? Does it offer directions rather than just a pin? If the address is new, the map listing may not exist yet, and coordinates will be more reliable.",
          "Add a human-readable line beside the code, such as the street address and a phone number. Technology fails, and a delivery driver may prefer to call.",
        ],
      },
      {
        heading: "Location codes that pull their weight",
        body: ["A map code is most useful when finding the place is the hard part:"],
        list: [
          "**Festival and event tickets:** the gate, not the general venue address",
          "**Trail and park signs:** the trailhead and parking area",
          "**Property listings:** the building entrance for viewings",
          "**Wedding invitations:** the ceremony and reception venues",
          "**Delivery notes:** a loading bay or service entrance",
        ],
      },
    ],
    tips: [
      "Use coordinates for rural or new locations where address search is unreliable.",
      "Check the pin in satellite view as well as map view.",
      "Say which entrance to use if the building has more than one.",
      "Location codes can be Tracked if you want to count how many people ask for directions.",
      "Remember that a public code reveals the location to anyone who scans it. Don't use it for a private home without consent.",
    ],
    faqs: [
      {
        q: "Which map app opens when someone scans?",
        a: "A Google Maps link opens Google Maps or the browser. A `geo:` link opens the phone's default map app on many Android devices, but not reliably on iPhone.",
      },
      {
        q: "Can I use exact coordinates instead of an address?",
        a: "Yes. Choose the coordinates option and enter latitude and longitude. This is best for places without a street address, such as a trailhead or field.",
      },
      {
        q: "Can I track how many people scan a location code?",
        a: "Yes, if you choose Tracked. QRWright counts link opens anonymously. It does not record anyone's location or identity.",
      },
      {
        q: "Why does the pin land in the wrong place?",
        a: "Address search can match a street or a suburb rather than the building. Use coordinates, check satellite view, and add a note about the entrance.",
      },
      {
        q: "Does the code need location permission?",
        a: "No. It opens a map link; the person's phone may ask for permission to show their position, but the code itself doesn't track them.",
      },
    ],
  },
  {
    slug: "crypto",
    metaTitle: "Crypto Payment QR Code Generator for BTC and ETH",
    metaDescription:
      "Create a crypto QR code with your wallet address and an optional amount. Supports Bitcoin, Ethereum, Litecoin, Dogecoin, and Solana. Free, no account.",
    h1: "Crypto Payment QR Code Generator",
    lede:
      "Put a wallet address and an optional amount into a QR code that a crypto wallet can scan. Useful for tips, donations, invoices, and in-person sales.",
    steps: [
      {
        title: "Pick the coin and paste the address",
        text: "Choose Bitcoin, Ethereum, Litecoin, Dogecoin, or Solana, then paste the receiving address. Copy it from your wallet rather than typing it.",
      },
      {
        title: "Add an amount if you like",
        text: "Leave the amount blank to let the payer choose, or set a fixed amount for a product or invoice.",
      },
      {
        title: "Test with a small payment",
        text: "Scan with the wallet app you expect customers to use and verify the address on screen before sending a test amount.",
      },
    ],
    sections: [
      {
        heading: "What the code contains",
        body: [
          "The code stores a payment URI, a short text link that crypto wallets understand. For Bitcoin it starts with `bitcoin:`, for Ethereum `ethereum:`, and so on, followed by the address and optional parameters such as an amount, label, or message.",
          "The address is the important part. A wallet that supports the coin will read it and pre-fill a payment. The person still confirms the transaction and pays the network fee, so a scan never moves funds by itself.",
          "Crypto codes are Direct only. There is no scan tracking and no editing. If you rotate to a new wallet, print a new code.",
        ],
      },
      {
        heading: "Amounts, decimals, and network fees",
        body: [
          "Amounts are entered in the coin's own unit, not in dollars or rupees. `0.001` on Bitcoin means 0.001 BTC. Ethereum is converted to wei, the smallest unit, behind the scenes.",
          "A fixed amount is convenient for a product with a stable price, but crypto prices move. Many sellers leave the amount blank and confirm the amount in chat, or quote a fresh amount at the moment of payment.",
          "The payer covers the network fee, which can be significant on busy days. Say whether the quoted price includes the fee, and don't ask someone to send an amount that leaves them short after fees.",
        ],
      },
      {
        heading: "Safety rules that matter more than the code",
        body: [
          "Crypto payments are irreversible. A code with a wrong character sends funds to an address nobody controls, and no support desk can undo it. Copy the address from the wallet, compare the first and last few characters, and test with a small amount first.",
        ],
        list: [
          "**Verify on the device:** check the address shown by the wallet, not just the one on your screen",
          "**Beware swapped stickers:** if you print a code for a public space, check it hasn't been covered by another",
          "**Use the right network:** a coin can exist on several networks; make sure the wallet and the payer agree",
          "**Never share a seed phrase or private key:** a receiving address is public, a private key is not",
          "**Keep records:** for business sales, note the transaction ID and the fiat value at the time",
        ],
      },
    ],
    tips: [
      "Test with a small amount before using the code for a real sale.",
      "Print the address in text under the code as a backup for wallets that can't scan.",
      "Add a label such as your business name so the payer can recognize the transaction.",
      "For recurring donations, a static code is fine; for one-off invoices, generate a fresh code per invoice.",
      "Check the wallet app your customers actually use. Not every wallet supports every coin or URI parameter.",
    ],
    faqs: [
      {
        q: "Does scanning the code send crypto automatically?",
        a: "No. It opens the wallet with the address and amount filled in. The person reviews the details and confirms the transaction.",
      },
      {
        q: "Which coins are supported?",
        a: "Bitcoin, Ethereum, Litecoin, Dogecoin, and Solana. Each uses its own payment URI scheme, and the wallet must support that coin.",
      },
      {
        q: "Can I track payments with the QR code?",
        a: "No. The code is Direct only and has no scan count. Use your wallet or a block explorer to confirm payments, and keep your own sales records.",
      },
      {
        q: "Why does the amount look different in my wallet?",
        a: "The amount is in the coin's unit, and Ethereum is converted to wei. Check the amount and the network fee in the wallet before confirming.",
      },
      {
        q: "What if I enter the wrong address?",
        a: "The code will point to the wrong wallet, and crypto payments can't be reversed. Delete the code, make a new one from a copied address, and test with a small amount.",
      },
    ],
  },
  {
    slug: "upi",
    metaTitle: "UPI QR Code Generator for Shops and Freelancers",
    metaDescription:
      "Create a UPI payment QR code with your UPI ID, payee name, and an optional amount. Works with Indian payment apps. Free, no sign-up, no commission.",
    h1: "UPI Payment QR Code Generator",
    lede:
      "Let customers pay you with any UPI app by scanning a code. Set a fixed amount for a product or leave it open so the payer enters the amount.",
    steps: [
      {
        title: "Enter your UPI ID",
        text: "Type the virtual payment address from your bank or payment app, such as `yourname@bank`, and the payee name customers will see.",
      },
      {
        title: "Set an amount or leave it open",
        text: "A fixed amount suits a single product or bill. Leave it blank for a shop counter where totals vary.",
      },
      {
        title: "Test with a small payment",
        text: "Scan with two different UPI apps and send a small test amount. Confirm the payee name and the amount before printing.",
      },
    ],
    sections: [
      {
        heading: "What the code contains",
        body: [
          "The code stores a `upi://pay` link with your UPI ID, payee name, currency, and optional amount and note. UPI apps read it and open a payment screen with the details filled in. The payer still confirms with their PIN, so a scan can't move money by itself.",
          "UPI codes are Direct only. There is no scan count and no editing. If you change banks or UPI IDs, make a new code and replace the printed stand.",
          "QRWright takes no commission and doesn't process the payment. The money moves directly between the payer's bank and yours through the UPI network.",
        ],
      },
      {
        heading: "Fixed amount or open amount?",
        body: [
          "A pre-filled amount is convenient at a stall with one price, or on an invoice for a known total. It reduces typing, but some apps let the payer edit it. Always verify the amount actually received.",
          "An open amount is better for a shop counter, a donation box, or a service with variable pricing. The payer types the total, which also means they can make a mistake, so keep a human check in place.",
          "You can use both: a fixed-amount code for a specific product and an open code at the till. Label them clearly so customers choose the right one.",
        ],
      },
      {
        heading: "Practical advice for a payment stand",
        body: [
          "Print the code large, laminate it, and put the payee name and UPI ID in text underneath. A customer should be able to check that the name matches the shop before paying.",
          "Check the stand regularly. Stickers can be swapped or covered, and a code that sends money to a stranger is a serious problem. If you use a printed stand in a public place, keep it behind the counter or in a frame that is hard to tamper with.",
          "For online sales, send the code as an image and confirm the payment in your own app. A screenshot of a success screen is not proof; check your bank or payment provider.",
        ],
      },
    ],
    tips: [
      "Use a merchant UPI ID if you have one, rather than a personal ID, for a public code.",
      "Print the UPI ID in text under the code so customers can verify the payee.",
      "Test with at least two UPI apps; the payment screen can look different.",
      "Leave the amount blank at a counter where totals vary, and set a fixed amount for single-price items.",
      "Keep the code clean and uncovered. Check it for tampering if it stays in a public place.",
    ],
    faqs: [
      {
        q: "Does the code take a commission?",
        a: "No. QRWright doesn't process the payment and takes no cut. The money moves through the UPI network between the payer's bank and yours.",
      },
      {
        q: "Can I set a fixed amount?",
        a: "Yes. Enter an amount like 250 or 99.50 and the payment screen will be pre-filled. Leave it blank to let the payer enter the amount.",
      },
      {
        q: "Which apps can scan the code?",
        a: "Any app that supports UPI payment links, including major Indian bank apps and payment apps. Test with the apps your customers use.",
      },
      {
        q: "Can I track payments with QRWright?",
        a: "No. UPI codes are Direct only and have no scan count. Your bank or payment provider shows the payments received.",
      },
      {
        q: "Is it safe to print a UPI code?",
        a: "Yes, if you protect the stand from tampering and print the payee name and UPI ID for verification. Check the code regularly in public places.",
      },
    ],
  },
];
