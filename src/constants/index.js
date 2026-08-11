import { flux_app_nav_white, flux_node_nav, flux_core, flux_app_nav } from "../assets";

export const FORK_BLOCK_HEIGHT = 2020000;

export const CUMULUS_PERCENTAGE = 0.07142857142857142;
export const NIMBUS_PERCENTAGE = 0.25;
export const STRATUS_PERCENTAGE = 0.6428571428571429;

export const navLinks = [
  {
    id: "nodes",
    title: "Nodes",
    img: flux_node_nav,
    description: "View Flux node status",
  },
  {
    id: "apps",
    title: "Apps",
    img: flux_app_nav_white,
    description: "View Flux apps by ZelID",
  },
  {
    id: "core",
    title: "Core",
    img: flux_core,
    description: "View FluxEdge stats",
  },
  {
    id: "gameservers",
    title: "Gaming",
    img: flux_app_nav,
    description: "View Game Servers on Flux",
  },
];
