import {
  site_palworld,
  site_minecraft,
  site_projectzomboid,
  site_enshrouded,
  site_rust,
  site_windrose,
  site_wordpress,
  site_openclaw,
  site_n8n,
  site_hermes,
  site_fivem,
  site_valheim,
  site_terraria,
  site_dragonwilds,
  site_vrising,
} from "../assets";

// One entry per dedicated hosting website.
//
// The game sites all live in the games hub on the main domain
// (https://runonflux.com/games/<slug>); the old <id>.runonflux.com hostnames 301 there. The
// slug is the hub's, not this file's id: Project Zomboid is /games/zomboid. The non-game sites
// (WordPress, Hermes, n8n, OpenClaw) moved the same way on 2026-09-17, to the apps hub
// (https://runonflux.com/apps/<slug>); their old subdomains 301 there. The hub deploys with the
// same app name prefixes the standalone sites used, so the prefixes below did not change.
//
// `prefixes` are the app name prefixes a site writes when it deploys. Every
// site builds the name as `${prefix}${Date.now()}`, so an app belongs to a site
// when its name is one of these prefixes followed by a timestamp.
//
// These prefixes CANNOT be inferred from the deployed names, so they have to be
// maintained here by hand, from each site's DeploymentDialog.jsx:
//   - some sites pick the prefix from the plan (Minecraft java/bedrock,
//     Rust vanilla/oxide, OpenClaw free/pro)
//   - others derive it from the marketplace app name, lowercased and stripped
//     of punctuation (n8n -> N8NStarter/N8NStandard/N8NPro, Hermes ->
//     HermesAgent/HermesAgentPro)
// A new site, or a new plan on an existing site, means a new entry here.
//
// Matching is case sensitive on purpose. The sites always lowercase the prefix,
// while the same app deployed straight from the Flux marketplace keeps its
// original casing (MinecraftServer1780... vs minecraftserver1780...), so
// lowercase is what tells "deployed through the dedicated website" apart.
export const dedicatedSites = [
  { id: "palworld", name: "Palworld", url: "https://runonflux.com/games/palworld", banner: site_palworld, prefixes: ["palworld"] },
  {
    id: "minecraft",
    name: "Minecraft",
    url: "https://runonflux.com/games/minecraft",
    banner: site_minecraft,
    prefixes: ["minecraftj", "minecraftb", "minecraftserver", "minecraftbedrockserver"],
  },
  { id: "wordpress", name: "WordPress", url: "https://runonflux.com/apps/wordpress", banner: site_wordpress, prefixes: ["wordpress"] },
  { id: "hermes", name: "Hermes", url: "https://runonflux.com/apps/hermes", banner: site_hermes, prefixes: ["hermesagent", "hermesagentpro"] },
  { id: "n8n", name: "n8n", url: "https://runonflux.com/apps/n8n", banner: site_n8n, prefixes: ["n8nstarter", "n8nstandard", "n8npro"] },
  { id: "projectzomboid", name: "Project Zomboid", url: "https://runonflux.com/games/zomboid", banner: site_projectzomboid, prefixes: ["projectzomboid"] },
  { id: "windrose", name: "Windrose", url: "https://runonflux.com/games/windrose", banner: site_windrose, prefixes: ["windrose"] },
  { id: "enshrouded", name: "Enshrouded", url: "https://runonflux.com/games/enshrouded", banner: site_enshrouded, prefixes: ["enshrouded"] },
  { id: "rust", name: "Rust", url: "https://runonflux.com/games/rust", banner: site_rust, prefixes: ["rustserver", "rustserveroxide"] },
  { id: "openclaw", name: "OpenClaw", url: "https://runonflux.com/apps/openclaw", banner: site_openclaw, prefixes: ["openclaw", "openclawpro"] },
  { id: "fivem", name: "FiveM", url: "https://runonflux.com/games/fivem", banner: site_fivem, prefixes: ["fivem"] },
  { id: "valheim", name: "Valheim", url: "https://runonflux.com/games/valheim", banner: site_valheim, prefixes: ["valheim"] },
  { id: "terraria", name: "Terraria", url: "https://runonflux.com/games/terraria", banner: site_terraria, prefixes: ["terraria"] },
  // "Dragonwilds", not the game's full "RuneScape: Dragonwilds", because that name wraps to two
  // lines on a 280px card. The prefix is the marketplace app name ("DragonWilds") lowercased,
  // which is also what the banner art says.
  { id: "dragonwilds", name: "Dragonwilds", url: "https://runonflux.com/games/dragonwilds", banner: site_dragonwilds, prefixes: ["dragonwilds"] },
  // The prefix is the marketplace app name ("VRising") lowercased, as the hub's deploy dialog
  // builds it; the test deploys are named vrising1790277053099 and the like.
  { id: "vrising", name: "V Rising", url: "https://runonflux.com/games/vrising", banner: site_vrising, prefixes: ["vrising"] },
];

// `${prefix}${Date.now()}` — Date.now() is 13 digits and stays that way for
// centuries, so anchoring on digits keeps "palworld16slots..." out of the
// "palworld" bucket.
const siteMatchers = dedicatedSites.flatMap((site) => site.prefixes.map((prefix) => ({ id: site.id, pattern: new RegExp(`^${prefix}\\d{13,}$`) })));

export function countAppsPerSite(apps) {
  const counts = Object.fromEntries(dedicatedSites.map((site) => [site.id, 0]));

  for (const app of apps || []) {
    const match = siteMatchers.find((matcher) => matcher.pattern.test(app.name));
    if (match) {
      counts[match.id] += 1;
    }
  }

  return counts;
}
