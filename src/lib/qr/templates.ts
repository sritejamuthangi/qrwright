import { DEFAULT_DESIGN, type FrameConfig, type QrDesign } from "./types";

export type TemplateCategory = "classic" | "minimal" | "color" | "gradient" | "framed" | "accent";

export const TEMPLATE_CATEGORIES: { id: TemplateCategory; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "minimal", label: "Minimal" },
  { id: "color", label: "Color" },
  { id: "gradient", label: "Gradient" },
  { id: "framed", label: "With a call to action" },
  { id: "accent", label: "Accent eyes" },
];

export interface QrTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  /** One line on where the design works well. */
  bestFor: string;
  design: QrDesign;
}

const solid = (color: string) => ({ kind: "solid" as const, color });
const linear = (from: string, to: string, angle: number) => ({ kind: "linear" as const, from, to, angle });
const radial = (from: string, to: string) => ({ kind: "radial" as const, from, to });
const frame = (style: FrameConfig["style"], text: string, color: string, textColor = "#ffffff"): FrameConfig => ({
  style,
  text,
  color,
  textColor,
});

function t(
  id: string,
  name: string,
  category: TemplateCategory,
  bestFor: string,
  patch: Partial<QrDesign>,
): QrTemplate {
  return { id, name, category, bestFor, design: { ...DEFAULT_DESIGN, ...patch } };
}

/**
 * Curated starting points. Every template is decoded at several sizes in the
 * test suite (tests/templates.test.ts), so a template never ships unscannable.
 */
export const TEMPLATES: QrTemplate[] = [
  // Classic
  t("classic", "Classic", "classic", "Anything. The safest, most widely readable look.", {}),
  t("ink-paper", "Ink & Paper", "classic", "Stationery, invitations and printed cards.", {
    dots: "soft", eyeFrame: "rounded", eyeBall: "rounded", fg: solid("#0d0d0e"), bg: "#f6f4ee",
  }),
  t("graphite", "Graphite", "classic", "Product packaging and technical labels.", {
    dots: "pixel", fg: solid("#374151"),
  }),
  t("newsprint", "Newsprint", "classic", "Editorial layouts, posters and magazines.", {
    dots: "classy", eyeFrame: "leaf", eyeBall: "leaf", fg: solid("#111827"), bg: "#fafaf9",
  }),

  // Minimal
  t("soft-mono", "Soft Mono", "minimal", "Clean brands that want something friendlier than squares.", {
    dots: "rounded", eyeFrame: "extra-rounded", eyeBall: "rounded", fg: solid("#111111"),
  }),
  t("dotwork", "Dotwork", "minimal", "Modern menus, cafés and lifestyle brands.", {
    dots: "dots", eyeFrame: "circle", eyeBall: "circle", fg: solid("#0f172a"),
  }),
  t("pebble", "Pebble", "minimal", "Soft, organic brands and wellness studios.", {
    dots: "liquid", eyeFrame: "extra-rounded", eyeBall: "circle", fg: solid("#1f2937"), bg: "#f3f4f6",
  }),
  t("linework", "Linework", "minimal", "Architecture, design studios and portfolios.", {
    dots: "vertical", eyeFrame: "rounded", eyeBall: "rounded", fg: solid("#111827"),
  }),

  // Color
  t("forest", "Forest", "color", "Outdoor brands, garden centres and eco products.", {
    dots: "classy", eyeFrame: "leaf", eyeBall: "leaf", fg: solid("#14532d"), bg: "#f0fdf4",
  }),
  t("royal", "Royal", "color", "Premium products and luxury packaging.", {
    dots: "diamond", eyeFrame: "extra-rounded", eyeBall: "diamond", fg: solid("#4c1d95"),
  }),
  t("coral", "Coral", "color", "Beauty, fashion and playful retail.", {
    dots: "liquid", eyeFrame: "circle", eyeBall: "circle", fg: solid("#be123c"), bg: "#fff1f2",
  }),
  t("mint", "Mint", "color", "Health, pharmacy and clean-tech brands.", {
    dots: "soft", eyeFrame: "rounded", eyeBall: "rounded", fg: solid("#047857"), bg: "#ecfdf5",
  }),
  t("terminal", "Terminal", "color", "Developer events, hackathons and tech meetups.", {
    dots: "pixel", fg: solid("#15803d"), bg: "#f0fdf4",
  }),
  t("blueprint", "Blueprint", "color", "Engineering, construction and real estate signage.", {
    fg: solid("#1e40af"), bg: "#eff6ff",
  }),

  // Gradient
  t("ocean", "Ocean", "gradient", "Travel, hospitality and water sports.", {
    dots: "rounded", eyeFrame: "rounded", eyeBall: "rounded", fg: linear("#0ea5e9", "#1e3a8a", 45),
  }),
  t("sunset", "Sunset", "gradient", "Events, festivals and summer campaigns.", {
    dots: "dots", eyeFrame: "circle", eyeBall: "circle", fg: linear("#ea580c", "#be185d", 135),
  }),
  t("berry", "Berry", "gradient", "Food, drinks and social media campaigns.", {
    dots: "classy-rounded", eyeFrame: "leaf", eyeBall: "leaf", fg: radial("#be185d", "#5b21b6"),
  }),
  t("citrus", "Citrus", "gradient", "Fresh produce, juice bars and fitness.", {
    dots: "dots", eyeFrame: "rounded", eyeBall: "rounded", fg: linear("#4d7c0f", "#0f766e", 90),
  }),
  t("ember", "Ember", "gradient", "Restaurants, grills and bold promotions.", {
    dots: "rounded", eyeFrame: "extra-rounded", eyeBall: "rounded", fg: linear("#b91c1c", "#c2410c", 90),
  }),
  t("lagoon", "Lagoon", "gradient", "Tech products, apps and SaaS launches.", {
    dots: "horizontal", eyeFrame: "rounded", eyeBall: "rounded", fg: linear("#0e7490", "#4338ca", 0),
  }),

  // Framed, with a call to action
  t("signal", "Signal", "framed", "Posters and flyers that need to grab attention.", {
    dots: "rounded", eyeFrame: "rounded", eyeBall: "rounded",
    frame: frame("banner-bottom", "SCAN ME", "#d4f53c", "#0d0d0e"),
  }),
  t("menu-card", "Menu Card", "framed", "Table tents and restaurant menus.", {
    dots: "classy", eyeFrame: "leaf", eyeBall: "leaf", fg: solid("#7c2d12"), bg: "#fffbeb",
    frame: frame("box", "SEE THE MENU", "#7c2d12"),
  }),
  t("wifi-sign", "Wi-Fi Sign", "framed", "Guest Wi-Fi signs for cafés, offices and rentals.", {
    dots: "dots", eyeFrame: "circle", eyeBall: "circle", fg: solid("#1d4ed8"),
    frame: frame("bubble", "SCAN FOR WI-FI", "#1d4ed8"),
  }),
  t("event-pass", "Event Pass", "framed", "Tickets, badges and conference passes.", {
    dots: "square", eyeFrame: "rounded", eyeBall: "rounded", fg: solid("#111827"),
    frame: frame("banner-top", "EVENT PASS", "#111827"),
  }),
  t("review-tag", "Review Tag", "framed", "Counter cards that ask for a review.", {
    dots: "liquid", eyeFrame: "extra-rounded", eyeBall: "circle", fg: solid("#b45309"),
    frame: frame("pill", "LEAVE A REVIEW", "#b45309"),
  }),
  t("viewfinder", "Viewfinder", "framed", "Window decals and storefront signs.", {
    dots: "soft", eyeFrame: "rounded", eyeBall: "rounded",
    frame: frame("viewfinder", "POINT YOUR CAMERA", "#0d0d0e"),
  }),
  t("shop-now", "Shop Now", "framed", "Packaging, shelf talkers and catalogues.", {
    dots: "rounded", eyeFrame: "leaf", eyeBall: "leaf", fg: solid("#0f766e"),
    frame: frame("banner-bottom", "SHOP NOW", "#0f766e"),
  }),
  t("follow-us", "Follow Us", "framed", "Social profiles on flyers and receipts.", {
    dots: "dots", eyeFrame: "circle", eyeBall: "circle", fg: radial("#7e22ce", "#be185d"),
    frame: frame("pill", "FOLLOW US", "#7e22ce"),
  }),
  t("pay-here", "Pay Here", "framed", "UPI and payment stands at the checkout.", {
    fg: solid("#14532d"), frame: frame("banner-bottom", "SCAN TO PAY", "#14532d"),
  }),
  t("contact-card", "Contact Card", "framed", "The back of business cards and name badges.", {
    dots: "classy-rounded", eyeFrame: "leaf", eyeBall: "leaf", fg: solid("#1e3a8a"),
    frame: frame("box", "SAVE MY CONTACT", "#1e3a8a"),
  }),
  t("midnight", "Midnight", "framed", "Night venues, bars and dark-themed print.", {
    dots: "rounded", eyeFrame: "rounded", eyeBall: "rounded", fg: solid("#0b1020"),
    frame: frame("banner-bottom", "SCAN ME", "#0b1020", "#e2e8f0"),
  }),
  t("noir-gold", "Noir & Gold", "framed", "VIP passes, galas and premium invitations.", {
    dots: "classy", eyeFrame: "leaf", eyeBall: "leaf", fg: solid("#1c1917"), eyeFrameColor: "#a16207",
    bg: "#fffbeb", frame: frame("banner-top", "VIP ACCESS", "#1c1917", "#fde68a"),
  }),
  t("neon-night", "Neon Night", "framed", "Club nights, gaming and esports.", {
    dots: "dots", eyeFrame: "circle", eyeBall: "circle", fg: linear("#6d28d9", "#0e7490", 45),
    frame: frame("banner-bottom", "SCAN ME", "#0d0d0e", "#d4f53c"),
  }),

  // Accent eyes
  t("accent-eyes", "Accent Eyes", "accent", "Adding one brand colour without losing contrast.", {
    dots: "square", eyeFrame: "rounded", eyeBall: "rounded", fg: solid("#111827"), eyeFrameColor: "#e11d48",
  }),
  t("tricolor", "Tricolor", "accent", "Sports clubs and school events.", {
    dots: "rounded", eyeFrame: "extra-rounded", eyeBall: "circle", fg: solid("#1f2937"),
    eyeFrameColor: "#2563eb", eyeBallColor: "#dc2626",
  }),
  t("candy", "Candy", "accent", "Kids' products, sweets and party invitations.", {
    dots: "liquid", eyeFrame: "circle", eyeBall: "circle", fg: solid("#be185d"), eyeFrameColor: "#6d28d9",
    eyeBallColor: "#6d28d9",
  }),
];

export function getTemplate(id: string): QrTemplate | undefined {
  return TEMPLATES.find((tpl) => tpl.id === id);
}
