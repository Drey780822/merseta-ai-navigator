/**
 * Centralized brand assets for merSETA Extractor.
 * Resolves to static assets served from the public/ directory,
 * with support for root or base-path-aware deployments.
 */
const baseUrl = (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) || "/";
const cleanBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

export const BRAND_ASSETS = {
  icon: `${cleanBase}assets/merseta-extractor-icon.png`,
  lockup: `${cleanBase}assets/merseta-extractor-lockup.png`,
  favicon: `${cleanBase}favicon.png`,
} as const;
