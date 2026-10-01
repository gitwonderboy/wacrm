/**
 * Single source of truth for everything that names or colours this
 * deployment. Every user-facing "who is this app" string, the favicon,
 * the <title> template, the invite-link fallback and the default theme
 * read from here, so re-pointing the CRM at another school (or another
 * CloseTag client) is a one-file change plus a theme block in
 * globals.css.
 *
 * Colours mirror the Sea View Primary design system used by the
 * website, admin dashboard and mobile app (see the monorepo CLAUDE.md).
 */

export const BRAND = {
  /** Short product name shown in the sidebar, <title> and toasts. */
  appName: "Sea View WhatsApp",
  /** Used in sentences: "... linked to another account on {appName}". */
  orgName: "Sea View Primary School",
  /** Who maintains the deployment; shown in docs. */
  maintainer: "CloseTag",
  /**
   * Public website of the organisation. Also the invite-link fallback
   * when the request-derived origin cannot be trusted.
   */
  siteUrl: "https://seaviewprimary.co.za",
  /** Where staff go for help with the CRM itself. */
  supportEmail: "seaviewprimary@gmail.com",
  /** One-line description for metadata and the README. */
  description:
    "WhatsApp inbox, contacts, broadcasts and automations for Sea View Primary School staff.",
  colors: {
    maroon: "#610018",
    maroonLight: "#8b1a3a",
    gold: "#fec913",
    goldDark: "#d4a800",
    navy: "#041237",
  },
  /** localStorage namespace for per-browser UI preferences. */
  storagePrefix: "seaview",
} as const;

export type Brand = typeof BRAND;
