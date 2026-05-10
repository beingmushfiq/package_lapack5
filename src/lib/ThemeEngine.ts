// ============================================================
// Theme Engine
// Fetches CMS theme tokens and injects them as CSS custom
// properties on :root so every Tailwind component inherits them.
// ============================================================

import api from './api';

export interface CMSTheme {
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    danger: string;
    success: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
  };
  typography: {
    fontPrimary: string;
    fontHeading: string;
    fontSizeBase: string;
    lineHeightBase: string;
  };
  spacing: {
    borderRadiusSm: string;
    borderRadiusMd: string;
    borderRadiusLg: string;
    borderRadiusFull: string;
    containerMaxWidth: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  animations: {
    duration: string;
    easing: string;
    enabled: boolean;
  };
}

let currentTheme: CMSTheme | null = null;
let fontsLoaded = new Set<string>();

/**
 * Fetch theme from CMS API and inject CSS variables into :root.
 */
export async function initThemeEngine(): Promise<CMSTheme | null> {
  try {
    const { data } = await api.get('/cms/theme');
    applyTheme(data);
    currentTheme = data;
    return data;
  } catch (err) {
    console.warn('[ThemeEngine] Could not fetch theme, using defaults.');
    return null;
  }
}

/**
 * Apply a theme object to the document root as CSS variables.
 */
export function applyTheme(theme: CMSTheme): void {
  if (!theme) return;

  const root = document.documentElement;

  // Colors
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-primary-dark', theme.colors.primaryDark);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-accent', theme.colors.accent);
  root.style.setProperty('--color-danger', theme.colors.danger);
  root.style.setProperty('--color-success', theme.colors.success);
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-surface', theme.colors.surface);
  root.style.setProperty('--color-text', theme.colors.text);
  root.style.setProperty('--color-text-muted', theme.colors.textMuted);

  // Typography
  root.style.setProperty('--font-primary', `"${theme.typography.fontPrimary}", sans-serif`);
  root.style.setProperty('--font-heading', `"${theme.typography.fontHeading}", sans-serif`);
  root.style.setProperty('--font-size-base', theme.typography.fontSizeBase);
  root.style.setProperty('--line-height-base', theme.typography.lineHeightBase);

  // Spacing & radius
  root.style.setProperty('--radius-sm', theme.spacing.borderRadiusSm);
  root.style.setProperty('--radius-md', theme.spacing.borderRadiusMd);
  root.style.setProperty('--radius-lg', theme.spacing.borderRadiusLg);
  root.style.setProperty('--radius-full', theme.spacing.borderRadiusFull);
  root.style.setProperty('--container-max-width', theme.spacing.containerMaxWidth);

  // Shadows
  root.style.setProperty('--shadow-sm', theme.shadows.sm);
  root.style.setProperty('--shadow-md', theme.shadows.md);
  root.style.setProperty('--shadow-lg', theme.shadows.lg);

  // Animations
  root.style.setProperty('--animation-duration', theme.animations.duration);
  root.style.setProperty('--animation-easing', theme.animations.easing);
  root.style.setProperty('--animations-enabled', theme.animations.enabled ? '1' : '0');

  // Load Google Fonts if needed
  loadGoogleFont(theme.typography.fontPrimary);
  if (theme.typography.fontHeading !== theme.typography.fontPrimary) {
    loadGoogleFont(theme.typography.fontHeading);
  }
}

/**
 * Get the current active theme.
 */
export function getCurrentTheme(): CMSTheme | null {
  return currentTheme;
}

/**
 * Inject a Google Font link if not already loaded.
 */
function loadGoogleFont(fontFamily: string): void {
  if (!fontFamily || fontFamily === 'inherit' || fontsLoaded.has(fontFamily)) return;

  const encoded = encodeURIComponent(fontFamily);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@300;400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
  fontsLoaded.add(fontFamily);
}
