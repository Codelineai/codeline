import type { Component } from "svelte";
import MyWayPizza from "$lib/components/my-way-pizza.svelte";
import SmartCards from "$lib/components/smart-cards.svelte";
import Stickerts from "$lib/components/stickerts.svelte";
import Wiwa from "$lib/components/wiwa.svelte";
import WiwaInfo from "$lib/components/wiwa-info.svelte";

export interface Project {
  name: string;
  url: string;
  shortUrl: string;
  infoComponent: Component;
  highlightComponent: Component;
}

export const projects: Project[] = [
  {
    name: "Visita Wiwa Quito",
    url: "https://www.visitawiwa.com",
    shortUrl: "visitawiwa.com",
    infoComponent: WiwaInfo,
    highlightComponent: Wiwa,
  },
  {
    name: "Stickerts",
    url: "https://www.stickerts.com",
    shortUrl: "stickerts.com",
    infoComponent: WiwaInfo,
    highlightComponent: Stickerts,
  },
  {
    name: "Smart Cards",
    url: "https://cards.codeline.ai",
    shortUrl: "cards.codeline.ai",
    infoComponent: WiwaInfo,
    highlightComponent: SmartCards,
  },
  {
    name: "My Way Pizza",
    url: "https://www.mywaypizza305.com",
    shortUrl: "mywaypizza305.com",
    infoComponent: WiwaInfo,
    highlightComponent: MyWayPizza,
  },
];
