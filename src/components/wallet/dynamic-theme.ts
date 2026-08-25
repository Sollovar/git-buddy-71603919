/**
 * Theme overrides for Dynamic's built-in widget / modal UI.
 *
 * We keep Dynamic's stock layout, menu and flows and only remap its design
 * tokens onto our own semantic CSS variables so the modal matches the app.
 * Dynamic renders inside a shadow DOM, so the app's :root variables are not
 * visible there — the values are resolved here and injected as literals via
 * `cssOverrides`.
 */
export const dynamicCssOverrides = `
  .dynamic-shadow-dom-content,
  .dynamic-widget-card,
  .dynamic-widget-inline-controls {
    --dynamic-font-family-primary:
      -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu,
      "Helvetica Neue", sans-serif;
    --dynamic-font-family-numbers:
      -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu,
      "Helvetica Neue", sans-serif;
    font-family: var(--dynamic-font-family-primary);
    font-feature-settings: normal;
    font-variant: normal;
    font-variant-ligatures: none;
    text-transform: none;
  }

  .dynamic-shadow-dom-content *,
  .dynamic-widget-card *,
  .dynamic-widget-inline-controls * {
    font-family: var(--dynamic-font-family-primary) !important;
    font-feature-settings: normal !important;
    font-variant: normal !important;
    font-variant-ligatures: none !important;
  }

  .dynamic-shadow-dom-content,
  .dynamic-widget-card,
  .dynamic-widget-inline-controls {

    --dynamic-base-1: var(--app-card);
    --dynamic-base-2: var(--app-secondary);
    --dynamic-base-3: var(--app-accent);
    --dynamic-base-4: var(--app-border);
    --dynamic-base-5: var(--app-border);

    --dynamic-background-primary: var(--app-card);
    --dynamic-background-secondary: var(--app-secondary);
    --dynamic-overlay: color-mix(in oklab, var(--app-foreground) 45%, transparent);

    --dynamic-text-primary: var(--app-foreground);
    --dynamic-text-secondary: var(--app-muted-foreground);
    --dynamic-text-tertiary: var(--app-muted-foreground);
    --dynamic-text-link: var(--app-foreground);
    --dynamic-text-size-body-normal: 0.9375rem;

    --dynamic-brand-primary-color: var(--app-primary);
    --dynamic-brand-secondary-color: var(--app-secondary);
    --dynamic-brand-hover-color: color-mix(in oklab, var(--app-primary) 80%, var(--app-foreground));

    --dynamic-border-radius: 0.75rem;
    --dynamic-hover: var(--app-secondary);
    --dynamic-shadow-down-3: 0 18px 40px -24px color-mix(in oklab, var(--app-foreground) 55%, transparent);

    --dynamic-connect-button-background: var(--app-primary);
    --dynamic-connect-button-color: var(--app-primary-foreground);
    --dynamic-connect-button-border: 1px solid var(--app-primary);
    --dynamic-connect-button-background-hover: color-mix(in oklab, var(--app-primary) 88%, var(--app-foreground));
    --dynamic-connect-button-color-hover: var(--app-primary-foreground);
    --dynamic-connect-button-radius: 9999px;
    --dynamic-connect-button-shadow: none;

    --dynamic-button-primary-background: var(--app-primary);
    --dynamic-button-primary-color: var(--app-primary-foreground);
    --dynamic-button-primary-background-hover: color-mix(in oklab, var(--app-primary) 88%, var(--app-foreground));
    --dynamic-button-primary-border: 1px solid var(--app-primary);
    --dynamic-button-secondary-background: var(--app-secondary);
    --dynamic-button-secondary-color: var(--app-foreground);
    --dynamic-button-secondary-background-hover: var(--app-accent);
    --dynamic-button-secondary-border: 1px solid var(--app-border);

    --dynamic-badge-background: var(--app-secondary);
    --dynamic-badge-color: var(--app-foreground);
    --dynamic-search-bar-background: var(--app-secondary);
    --dynamic-search-bar-background-hover: var(--app-accent);
    --dynamic-search-bar-border: 1px solid var(--app-border);
    --dynamic-search-bar-border-hover: 1px solid var(--app-primary);
    --dynamic-search-bar-border-focus: 1px solid var(--app-primary);

    --dynamic-error-1: var(--app-destructive);
    --dynamic-success-1: var(--app-bid);

    --dynamic-footer-background-color: var(--app-secondary);
    --dynamic-footer-text-color: var(--app-muted-foreground);
    --dynamic-footer-icon-color: var(--app-muted-foreground);
  }
`;

const TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "muted-foreground",
  "accent",
  "border",
  "destructive",
  "bid",
] as const;

/**
 * Copies the resolved theme colours onto `--app-*` variables on <html>.
 * Those inherit into Dynamic's shadow DOM, so switching the app theme
 * restyles the Dynamic modal too.
 */
export function syncDynamicThemeVars() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  for (const token of TOKENS) {
    const value = styles.getPropertyValue(`--${token}`).trim();
    if (value) root.style.setProperty(`--app-${token}`, value);
  }
}
