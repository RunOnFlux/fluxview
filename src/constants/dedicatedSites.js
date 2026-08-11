import { site_palworld, site_minecraft, site_projectzomboid, site_enshrouded, site_rust, site_windrose, site_wordpress, site_openclaw, site_n8n, site_hermes } from "../assets";

// One entry per dedicated hosting website (https://<id>.runonflux.com).
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
  { id: "palworld", name: "Palworld", url: "https://palworld.runonflux.com", banner: site_palworld, prefixes: ["palworld"] },
  {
    id: "minecraft",
    name: "Minecraft",
    url: "https://minecraft.runonflux.com",
    banner: site_minecraft,
    prefixes: ["minecraftj", "minecraftb", "minecraftserver", "minecraftbedrockserver"],
  },
  { id: "wordpress", name: "WordPress", url: "https://wordpress.runonflux.com", banner: site_wordpress, prefixes: ["wordpress"] },
  { id: "hermes", name: "Hermes", url: "https://hermes.runonflux.com", banner: site_hermes, prefixes: ["hermesagent", "hermesagentpro"] },
  { id: "n8n", name: "n8n", url: "https://n8n.runonflux.com", banner: site_n8n, prefixes: ["n8nstarter", "n8nstandard", "n8npro"] },
  { id: "projectzomboid", name: "Project Zomboid", url: "https://projectzomboid.runonflux.com", banner: site_projectzomboid, prefixes: ["projectzomboid"] },
  { id: "windrose", name: "Windrose", url: "https://windrose.runonflux.com", banner: site_windrose, prefixes: ["windrose"] },
  { id: "enshrouded", name: "Enshrouded", url: "https://enshrouded.runonflux.com", banner: site_enshrouded, prefixes: ["enshrouded"] },
  { id: "rust", name: "Rust", url: "https://rust.runonflux.com", banner: site_rust, prefixes: ["rustserver", "rustserveroxide"] },
  { id: "openclaw", name: "OpenClaw", url: "https://openclaw.runonflux.com", banner: site_openclaw, prefixes: ["openclaw", "openclawpro"] },
  // FiveM (prefixo "fivem") fica de fora ate ao lancamento em producao
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
