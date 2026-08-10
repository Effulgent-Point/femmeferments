import baked from "@/data/content.json";

/* Shared content schema — mirrors src/data/content.json */
export interface Wine {
  varietal: string;
  name: string;
  year: string;
  description: string;
  /** Optional bottle/label photo (a proxied /api/media URL). */
  image?: string;
  /** When true, the wine renders a "Sold Out" badge. */
  soldOut?: boolean;
}
export interface Role {
  id: string;
  number: string;
  title: string;
  piece: string;
  description: string;
  tasks: string[];
  perks: string[];
  time: string;
}
export interface FlowStep {
  title: string;
  description: string;
}
export interface Cta {
  label: string;
  heading: string;
  description: string;
}
export interface EventInfo {
  title: string;
  date: string;
  location: string;
  details: string[];
  description: string;
  /** Optional event poster/flyer image (a proxied /api/media URL). */
  poster?: string;
}
export interface Vision {
  headline: string;
  body: string;
  quote: string;
}
export interface Valley {
  headline: string;
  body: string;
  ctas: Cta[];
  /** @deprecated legacy single CTA — migrated to `ctas` by mergeContent */
  cta?: Cta;
}
/** Editable heading/label text for sections whose chrome was previously hardcoded. */
export interface Sections {
  wines: { heading: string; intro: string };
  mission: { heading: string; caption: string };
  community: { heading: string; intro: string };
  events: { heading: string };
  partners: { heading: string };
  join: { eyebrow: string; heading: string };
  contact: { heading: string };
  gallery: { heading: string };
  donate: { heading: string };
  news: { heading: string };
  team: { heading: string };
}

/** Ordering + visibility of the page's sections. */
export type SectionId =
  | "vision"
  | "land"
  | "wines"
  | "mission"
  | "community"
  | "events"
  | "partners"
  | "contact"
  | "gallery"
  | "donate"
  | "news"
  | "team";
export interface SectionLayoutEntry {
  id: SectionId;
  enabled: boolean;
}

/* ---- New, toggleable section slices ---- */
export interface ContactData {
  intro: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  facebook: string;
  mapEmbed: string;
}
export interface GalleryImage {
  url: string;
  caption?: string;
}
export interface GalleryData {
  intro: string;
  images: GalleryImage[];
}
export interface DonateTier {
  amount: string;
  description: string;
  cta: string;
  href: string;
}
export interface DonateData {
  intro: string;
  tiers: DonateTier[];
  note: string;
}
export interface NewsEntry {
  date: string;
  title: string;
  body: string;
}
export interface NewsData {
  intro: string;
  items: NewsEntry[];
}
export interface TeamMember {
  name: string;
  role: string;
  photo: string;
  bio: string;
}
export interface TeamData {
  intro: string;
  members: TeamMember[];
}

export interface Content {
  vision: Vision;
  valley: Valley;
  event: EventInfo;
  wines: Wine[];
  roles: Role[];
  flowSteps: FlowStep[];
  partners: string[];
  sections: Sections;
  sectionLayout: SectionLayoutEntry[];
  contact: ContactData;
  gallery: GalleryData;
  donate: DonateData;
  news: NewsData;
  team: TeamData;
}

export const DEFAULT_CONTENT = baked as Content;

const BANNED_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Deep-merge `source` over `target`. Arrays are replaced wholesale (not merged);
 * BANNED_KEYS blocks prototype-pollution from crafted JSON. Adapted from the
 * soccersite/YCSC CMS blueprint.
 */
export function deepMerge<T>(target: T, source: unknown): T {
  if (source === null || typeof source !== "object" || Array.isArray(source)) {
    return (source ?? target) as T;
  }
  const out: Record<string, unknown> = {
    ...(target as Record<string, unknown>),
  };
  for (const key of Object.keys(source as Record<string, unknown>)) {
    if (BANNED_KEYS.has(key)) continue;
    const sv = (source as Record<string, unknown>)[key];
    if (Array.isArray(sv)) {
      out[key] = sv;
    } else if (sv && typeof sv === "object") {
      out[key] = deepMerge(out[key] ?? {}, sv);
    } else {
      out[key] = sv;
    }
  }
  return out as T;
}

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

/**
 * True when `x` is shaped enough to render safely — the load-bearing objects
 * and arrays the UI dereferences are all present and the right kind. Used to
 * reject malformed writes at the API before they can reach the public page.
 */
export function isContentLike(x: unknown): boolean {
  if (!isObj(x)) return false;
  return (
    isObj(x.vision) &&
    isObj(x.valley) &&
    isObj(x.event) &&
    Array.isArray(x.wines) &&
    Array.isArray(x.roles) &&
    Array.isArray(x.flowSteps) &&
    Array.isArray(x.partners)
  );
}

/**
 * Merge a (possibly partial) published payload over the baked defaults. A
 * non-object payload (array / string / null / etc.) can't be safely merged —
 * `deepMerge` would return it wholesale and crash the renderer — so we fall
 * back to the baked defaults. Partial objects are fine: missing keys come from
 * DEFAULT_CONTENT.
 */
export function mergeContent(partial: unknown): Content {
  if (!isObj(partial)) return DEFAULT_CONTENT;
  // Backward-compat: an older saved draft has a single `valley.cta`. Promote it
  // to the new `valley.ctas` list (without mutating the input) so the editor's
  // existing CTA carries over and gains the add-more capability.
  let src = partial;
  const valley = partial.valley;
  if (isObj(valley) && isObj(valley.cta) && !Array.isArray(valley.ctas)) {
    src = { ...partial, valley: { ...valley, ctas: [valley.cta] } };
  }
  // Backward-compat: an old draft's `sectionLayout` predates sections added
  // later. deepMerge replaces arrays wholesale, so a short/stale layout would
  // hide the newer sections permanently — and re-truncate itself on the next
  // save. Union in any missing section ids, keeping the draft's existing order
  // and enabled flags, and appending new ones with their baked default (off) so
  // they become discoverable in the Section Manager without disturbing Karen's
  // arrangement.
  if (Array.isArray(src.sectionLayout)) {
    const present = new Set(
      src.sectionLayout
        .filter(
          (e): e is SectionLayoutEntry => isObj(e) && typeof e.id === "string",
        )
        .map((e) => e.id),
    );
    const missing = DEFAULT_CONTENT.sectionLayout.filter(
      (e) => !present.has(e.id),
    );
    if (missing.length > 0) {
      src = { ...src, sectionLayout: [...src.sectionLayout, ...missing] };
    }
  }
  return deepMerge(DEFAULT_CONTENT, src);
}
