import type { MetadataRoute } from "next";

const SITE_URL = "https://femmeferments.com";

// Single-page app today — one root entry. Add entries here if/when the site
// grows additional standalone routes worth indexing separately.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
