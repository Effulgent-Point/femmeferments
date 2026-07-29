import baked from "@/data/content.json";

/* Shared content schema — mirrors src/data/content.json */
export interface Wine {
  varietal: string;
  name: string;
  year: string;
  description: string;
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
  return deepMerge(DEFAULT_CONTENT, src);
}
