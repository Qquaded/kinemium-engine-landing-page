// ============================================
// THEME CONFIGURATION
// Edit this file to customize colors and styling
// ============================================

export const themeConfig = {
  // ---- ACCENT COLOR ----
  // Main brand color (orange by default)
  accent: {
    hue: 55, // Change this to adjust the accent color hue (0-360)
    // 0 = red, 30 = orange, 55 = amber/orange, 120 = green, 240 = blue, 300 = purple
  },

  // ---- COLOR TOKENS ----
  // These use oklch color space for better perceptual uniformity
  colors: {
    // Background colors
    background: "oklch(0.09 0 0)",
    card: "oklch(0.13 0 0)",
    
    // Text colors
    foreground: "oklch(1 0 0)",
    muted: "oklch(0.55 0 0)",
    
    // Accent/Primary (orange)
    primary: "oklch(0.75 0.18 55)",
    primaryForeground: "oklch(0.09 0 0)",
    
    // Secondary
    secondary: "oklch(0.18 0 0)",
    secondaryForeground: "oklch(1 0 0)",
    
    // Borders
    border: "oklch(0.22 0 0)",
    ring: "oklch(0.75 0.18 55)",
  },

  // ---- BORDER RADIUS ----
  radius: "1rem",

  // ---- SYNTAX HIGHLIGHTING COLORS ----
  syntax: {
    keyword: "text-purple-400",    // local, function, if, then, end
    builtin: "text-orange-400",    // Instance, Vector3, workspace
    method: "text-sky-400",        // new, Connect, GetService
    string: "text-emerald-400",    // "strings"
    number: "text-amber-300",      // 123
    comment: "text-zinc-500",      // -- comments
  },
}

export type ThemeConfig = typeof themeConfig
