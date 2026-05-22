// src/lib/preferences/theme.ts

export const THEME_MODE_OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
] as const;

export const THEME_MODE_VALUES = THEME_MODE_OPTIONS.map((o) => o.value);
export type ThemeMode = (typeof THEME_MODE_VALUES)[number];

// --- generated:themePresets:start ---

export const THEME_PRESET_OPTIONS = [
  {
    label: "Default",
    value: "default",
    primary: {
      light: "var(--logo-coral)",
      dark: "var(--logo-coral-medium)",
    },
  },
  {
    label: "High Contrast",
    value: "brutalist",
    primary: {
      light: "oklch(0.45 0.2 255)",
      dark: "oklch(0.72 0.15 245)",
    },
  },
  {
    label: "Cool Air",
    value: "soft-pop",
    primary: {
      light: "oklch(0.58 0.16 235)",
      dark: "oklch(0.74 0.13 235)",
    },
  },
  {
    label: "Steel Blue",
    value: "tangerine",
    primary: {
      light: "oklch(0.52 0.18 252)",
      dark: "oklch(0.7 0.14 245)",
    },
  },
] as const;

export const THEME_PRESET_VALUES = THEME_PRESET_OPTIONS.map((p) => p.value);

export type ThemePreset = (typeof THEME_PRESET_OPTIONS)[number]["value"];

// --- generated:themePresets:end ---
