import type { Component } from "svelte";
import MyWayPizza from "$lib/components/my-way-pizza.svelte";
import SmartCards from "$lib/components/smart-cards.svelte";
import SmartCardsInfo from "$lib/components/smart-cards-info.svelte";
import Stickerts from "$lib/components/stickerts.svelte";
import StickertsInfo from "$lib/components/stickerts-info.svelte";
import Wiwa from "$lib/components/wiwa.svelte";
import WiwaInfo from "$lib/components/wiwa-info.svelte";

export interface Project {
  slug: string;
  name: string;
  url: string;
  shortUrl: string;
  infoComponent: Component;
  highlightComponent: Component;
}

export const projects: Project[] = [
  {
    slug: "visita-wiwa-quito",
    name: "Visita Wiwa Quito",
    url: "https://www.visitawiwa.com",
    shortUrl: "visitawiwa.com",
    infoComponent: WiwaInfo,
    highlightComponent: Wiwa,
  },
  {
    slug: "stickerts",
    name: "Stickerts",
    url: "https://www.stickerts.com",
    shortUrl: "stickerts.com",
    infoComponent: StickertsInfo,
    highlightComponent: Stickerts,
  },
  {
    slug: "smart-cards",
    name: "Smart Cards",
    url: "https://cards.codeline.ai",
    shortUrl: "cards.codeline.ai",
    infoComponent: SmartCardsInfo,
    highlightComponent: SmartCards,
  },
  {
    slug: "my-way-pizza",
    name: "Landing Design",
    url: "https://www.mywaypizza305.com",
    shortUrl: "mywaypizza305.com",
    infoComponent: WiwaInfo,
    highlightComponent: MyWayPizza,
  },
];
