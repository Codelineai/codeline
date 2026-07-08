import type { Component } from "svelte";
import MyWayPizza from "$lib/components/my-way-pizza.svelte";
import SmartCards from "$lib/components/smart-cards.svelte";
import Stickerts from "$lib/components/stickerts.svelte";
import Wiwa from "$lib/components/wiwa.svelte";

export interface Project {
  name: string;
  description: string;
  url: string;
  component: Component;
}

export const projects: Project[] = [
  {
    name: "Visita Wiwa Quito",
    description: "Placeholder description.",
    url: "#",
    component: Wiwa,
  },
  {
    name: "Stickerts",
    description: "Placeholder description.",
    url: "#",
    component: Stickerts,
  },
  {
    name: "Smart Cards",
    description: "Placeholder description.",
    url: "#",
    component: SmartCards,
  },
  {
    name: "My Way Pizza",
    description: "Placeholder description.",
    url: "#",
    component: MyWayPizza,
  },
];
