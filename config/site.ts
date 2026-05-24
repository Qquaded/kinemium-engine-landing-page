// ============================================
// SITE CONFIGURATION
// Edit this file to customize your site
// ============================================

const repo = "kinemium-engine-landing-page"
const basePath = process.env.NODE_ENV === "production" ? `/${repo}` : ""
const assetPath = (path: string) => `${basePath}${path}`

export const siteConfig = {
  // ---- BRANDING ----
  name: "Kinemium",
  tagline: "Lua-based sandboxed game engine.",
  description: "A sandboxed game engine with built-in editor, multiplayer support, and modding capabilities. MIT licensed.",

  // ---- IMAGES ----
  images: {
    logo: assetPath("/logo.png"),
    heroBg: assetPath("/hero-bg.png"),
    examplePart: assetPath("/example-part.jpg"),
    exampleInput: assetPath("/example-input.jpg"),
  },

  // ---- LINKS ----
  links: {
    github: "https://github.com/Qquaded/Kinemium-Engine",
    releases: "https://github.com/Qquaded/Kinemium-Engine/releases",
    discord: "https://discord.gg/7byuxfYtAP",
    gettingStarted: "https://kinemiumengine.discourse.group/t/guide-to-running-kinemium-engine/25",
    documentation: "https://deepwiki.com/Qquaded/Kinemium-Engine/2-getting-started",
    rokit: "https://github.com/rojo-rbx/rokit",
  },

  // ---- VERSION / STATUS ----
  version: "Alpha",
  status: "Alpha - Full release later this year",

  // ---- HERO SECTION ----
  hero: {
    headline: {
      line1: "A",
      accent1: "lightweight",
      line1End: ", open-source",
      line2: "game engine.",
    },
    subheadline: "A game engine where freedom is the priority",
    ctaPrimary: "Download Latest",
    ctaSecondary: "View Source",
  },

  // ---- NAVBAR ----
  navItems: [
    { label: "Features", href: "#features" },
    { label: "Docs", href: "https://deepwiki.com/Qquaded/Kinemium-Engine" },
    { label: "Discord", href: "https://discord.gg/7byuxfYtAP" },
    { label: "Plugins", href: "https://quadigen.github.io/Kinemium-Engine-Plugins/" },
    { label: "Forums", href: "https://kinemiumengine.discourse.group/" },
  ],

  // ---- TECHNOLOGIES / BUILT WITH ----
  technologies: [
    { name: "Raylib" },
    { name: "Jolt" },
    { name: "Box2D" },
    { name: "Manifold" },
    { name: "GNS" },
    { name: "NFD" },
  ],

  // ---- FEATURES ----
  features: {
    title: "Powerful game development",
    subtitle: "Everything you need to create, test, and ship games.",
    items: [
      {
        id: "editor",
        title: "Built-in Editor",
        description: "Script, build, and playtest without leaving the engine.",
        icon: "Code",
      },
      {
        id: "multiplayer",
        title: "Multiplayer",
        description: "Server/client architecture out of the box.",
        icon: "Users",
      },
      {
        id: "scripting",
        title: "Luau Scripting",
        description: "Familiar syntax with powerful features.",
        icon: "Gamepad2",
      },
      {
        id: "modding",
        title: "Mod Support",
        description: "Let players extend your games.",
        icon: "Puzzle",
      },
      {
        id: "physics",
        title: "Physics Engines",
        description: "Jolt, Box2D, and Manifold included.",
        icon: "Box",
      },
      {
        id: "platforms",
        title: "Cross Platform",
        description: "Windows, Linux (experimental), and macOS (experimental).",
        icon: "Cpu",
        platforms: ["Windows", "Linux", "macOS"],
      },
    ],
  },

  // ---- CODE EXAMPLES ----
  codeExamples: {
    title: "Simple, familiar scripting",
    subtitle: "Write game logic in Luau with an intuitive API.",
    examples: [
      {
        title: "Create a Part",
        description: "Spawn a basic part in the workspace",
        image: assetPath("/part.png"),
        code: `local part = Instance.new("Part")
part.Name = "MyPart"
part.Size = Vector3.new(4, 2, 4)
part.Position = Vector3.new(0, 4, 0)
part.Color = Color3.fromRGB(255, 0, 0)
part.Material = Enum.Material.Neon
part.Parent = workspace`,
      },
    ],
  },

  // ---- GETTING STARTED ----
  gettingStarted: {
    title: "Getting Started",
    subtitle: "Get up and running in minutes.",
    prerequisites: [
      { name: "Rokit", description: "Tool version manager", initial: "R" },
      { name: "Git", description: "Cloning the repository", initial: "G" },
    ],
    steps: [
      {
        title: "Install Rokit",
        content: "Follow the Rokit installation guide to set up the tool manager. Rokit reads rokit.toml and manages pinned versions of zune.",
        link: "https://github.com/rojo-rbx/rokit",
      },
      {
        title: "Clone the repository",
        content: "git clone --depth 1 https://github.com/Qquaded/Kinemium-Engine.git",
        isCode: true,
      },
      {
        title: "Install toolchain",
        content: "rokit install",
        isCode: true,
        description: "This installs zune automatically.",
      },
      {
        title: "Run the engine",
        content: "zune run game",
        isCode: true,
        description: "Launches the engine in windowed mode with the full rendering pipeline.",
      },
    ],
    executionModes: [
      { flag: "(none)", mode: "Standard", description: "Windowed engine with renderer and UI" },
      { flag: "--headless", mode: "Headless", description: "No graphics or renderer" },
      { flag: "--server", mode: "Server", description: "Game server; accepts client connections" },
      { flag: "--client", mode: "Client", description: "Game client; removes core UI" },
      { flag: "--editor", mode: "Editor", description: "Enables the built-in studio/editor UI" },
      { flag: "--kilang", mode: "REPL", description: "Kilang terminal REPL; combinable with other flags" },
    ],
  },

  // ---- FINAL CTA ----
  finalCta: {
    title: "Try and test",
    subtitle: "Clone the repo, run the engine, and create something awesome.",
    ctaPrimary: "Get Kinemium",
    ctaSecondary: "Join the Community",
    cloneCommand: "git clone https://github.com/Qquaded/Kinemium-Engine.git",
  },

  // ---- FOOTER ----
  footer: {
    links: {
      Engine: [
        { label: "Features", href: "#features" },
        { label: "Download", href: "https://github.com/Qquaded/Kinemium-Engine/releases" },
        { label: "Changelog", href: "https://github.com/Qquaded/Kinemium-Engine/releases" },
        { label: "Roadmap", href: "https://github.com/Qquaded/Kinemium-Engine" },
      ],

      Resources: [
        { label: "GitHub", href: "https://github.com/Qquaded/Kinemium-Engine" },
        { label: "Codeberg", href: "https://codeberg.org/Qquaded/Kinemium-Engine" },
        { label: "GitLab", href: "https://gitlab.com/quadigen/Kinemium-Engine" },
        { label: "Documentation", href: "https://deepwiki.com/Qquaded/Kinemium-Engine" },
        { label: "Plugins", href: "https://quadigen.github.io/Kinemium-Engine-Plugins/" },
      ],

      Community: [
        { label: "Discord", href: "https://discord.com/invite/7wKav5pCWg" },
        { label: "Forums", href: "https://kinemiumengine.discourse.group/" },
        { label: "Uptime Status", href: "https://stats.uptimerobot.com/xVqd79vxeX" },
        { label: "Issues", href: "https://github.com/Qquaded/Kinemium-Engine/issues" },
        { label: "Discussions", href: "https://github.com/Qquaded/Kinemium-Engine/discussions" },
      ],
    },

    copyright: "Kinemium Engine by Qquaded. Not affiliated with Roblox Corporation.",
    license: "MIT Licensed",
  }
}

export type SiteConfig = typeof siteConfig
