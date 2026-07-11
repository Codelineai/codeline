<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { Volume2, VolumeX } from "@lucide/svelte";

  import wiwa1 from "$lib/assets/video/wiwa1.mp4";
  import wiwa2 from "$lib/assets/video/wiwa2.mp4";
  import wiwa3 from "$lib/assets/video/wiwa3.mp4";
  import condorSvg from "$lib/assets/wiwa/condor.svg";
  import guacamayoSvg from "$lib/assets/wiwa/guacamayo.svg";
  import bearSvg from "$lib/assets/wiwa/bear.svg";
  import tortugaSvg from "$lib/assets/wiwa/tortuga.svg";
  import monoSvg from "$lib/assets/wiwa/mono.svg";
  import treesSvg from "$lib/assets/wiwa/trees.svg";
  import ranaSvg from "$lib/assets/wiwa/rana.svg";
  import mountainsSvg from "$lib/assets/wiwa/mountains.svg";
  import crocSvg from "$lib/assets/wiwa/croc.svg";
  import guepardoSvg from "$lib/assets/wiwa/guepardo.svg";
  import manSvg from "$lib/assets/wiwa/man.svg";
  import tapirSvg from "$lib/assets/wiwa/tapir.svg";
  import trailSvg from "$lib/assets/wiwa/trail.svg";
  import wavesSvg from "$lib/assets/wiwa/waves.svg";

  const stats = [
    { value: "300K+", label: "tickets vendidos" },
    { value: "100K+", label: "transacciones" },
    { value: "4K+", label: "usuarios registrados" },
  ];

  // Natural dimensions (for aspect-ratio when masking).
  const ICONS = {
    condor: { src: condorSvg, w: 130, h: 81 },
    guacamayo: { src: guacamayoSvg, w: 77, h: 87 },
    bear: { src: bearSvg, w: 78, h: 82 },
    tortuga: { src: tortugaSvg, w: 103, h: 76 },
    mono: { src: monoSvg, w: 86, h: 86 },
    trees: { src: treesSvg, w: 95, h: 63 },
    rana: { src: ranaSvg, w: 78, h: 82 },
    mountains: { src: mountainsSvg, w: 117, h: 33 },
    croc: { src: crocSvg, w: 123, h: 73 },
    guepardo: { src: guepardoSvg, w: 72, h: 86 },
    man: { src: manSvg, w: 77, h: 86 },
    tapir: { src: tapirSvg, w: 91, h: 83 },
    trail: { src: trailSvg, w: 71, h: 61 },
    waves: { src: wavesSvg, w: 113, h: 37 },
  } as const;

  type IconName = keyof typeof ICONS;

  function iconStyle(name: IconName, extra: string) {
    const { src, w, h } = ICONS[name];
    return (
      `-webkit-mask-image:url(${src});mask-image:url(${src});` +
      `-webkit-mask-size:contain;mask-size:contain;` +
      `-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;` +
      `-webkit-mask-position:center;mask-position:center;` +
      `aspect-ratio:${w}/${h};${extra}`
    );
  }

  // Collage desktop: íconos que enmarcan el reel (pueden sobresalir; hay altura de sobra).
  const collageDesktop = (
    [
      {
        name: "rana",
        pos: "top:-24px;left:-16px;width:50px;transform:rotate(8deg);z-index:20",
      },
      {
        name: "condor",
        pos: "top:-34px;right:-40px;width:100px;transform:rotate(12deg);z-index:20",
      },
      {
        name: "bear",
        pos: "bottom:46px;right:-44px;width:82px;transform:rotate(20deg);z-index:20",
      },
    ] satisfies { name: IconName; pos: string }[]
  ).map((it, i) => ({ key: `cd${i}`, style: iconStyle(it.name, it.pos) }));

  // Collage mobile: dentro de la banda vertical visible del reel para que nada se corte.
  const collageMobile = (
    [
      {
        name: "rana",
        pos: "top:48px;left:-6px;width:44px;transform:rotate(8deg);z-index:20",
      },
      {
        name: "condor",
        pos: "top:70px;right:-22px;width:78px;transform:rotate(12deg);z-index:20",
      },
      {
        name: "bear",
        pos: "bottom:60px;right:-24px;width:76px;transform:rotate(20deg);z-index:20",
      },
    ] satisfies { name: IconName; pos: string }[]
  ).map((it, i) => ({ key: `cm${i}`, style: iconStyle(it.name, it.pos) }));

  // Capa ambiental repartida por todo el frame (solo desktop).
  const ambient = (
    [
      {
        name: "croc",
        pos: "top:10%;left:6%;width:92px;transform:rotate(-8deg)",
      },
      { name: "man", pos: "top:34%;left:4%;width:66px;transform:rotate(5deg)" },
      {
        name: "tapir",
        pos: "top:66%;left:7%;width:80px;transform:rotate(9deg)",
      },
      {
        name: "guacamayo",
        pos: "top:84%;left:26%;width:64px;transform:rotate(-6deg)",
      },
      {
        name: "tortuga",
        pos: "top:12%;left:86%;width:76px;transform:rotate(10deg)",
      },
      {
        name: "mono",
        pos: "top:52%;left:88%;width:66px;transform:rotate(-4deg)",
      },
      {
        name: "trees",
        pos: "top:70%;left:92%;width:74px;transform:rotate(8deg)",
      },
      {
        name: "guepardo",
        pos: "top:80%;left:74%;width:60px;transform:rotate(-10deg)",
      },
    ] satisfies { name: IconName; pos: string }[]
  ).map((it, i) => ({ key: `a${i}`, style: iconStyle(it.name, it.pos) }));

  const videos = [wiwa1, wiwa2, wiwa3];
  // Aleatorio en cada visita (el componente monta solo en cliente).
  let currentIndex = $state(Math.floor(Math.random() * videos.length));
  let muted = $state(true);
</script>

<div
  class="relative flex w-full flex-col items-center justify-center gap-4 px-8 md:h-full md:flex-row md:gap-16"
>
  <!-- Capa ambiental — solo desktop, detrás del contenido, no interactiva -->
  <div
    class="pointer-events-none absolute inset-0 hidden overflow-hidden md:block"
    aria-hidden="true"
  >
    {#each ambient as ic, i (ic.key)}
      <span
        in:fade|global={{
          duration: 500,
          delay: 150 + i * 40,
          easing: cubicOut,
        }}
        class="wiwa-icon absolute select-none"
        style={ic.style}
      ></span>
    {/each}
  </div>

  <!-- Collage stage -->
  <div
    in:fly|global={{ y: 24, duration: 500, easing: cubicOut }}
    class="relative shrink-0"
    style="width: 300px; height: 460px;"
  >
    <!-- Wrapper de escala: agranda el reel + collage en pantallas grandes -->
    <div class="relative h-full w-full origin-center lg:scale-[1.12]">
      <!-- Video frame (z-10) -->
      <div
        class="absolute z-10 overflow-hidden rounded-2xl bg-black ring-1 ring-black/10 dark:ring-white/10"
        style="left: 30px; top: 16px; width: 240px; height: 427px;"
      >
        {#key currentIndex}
          <video
            in:fade|global={{ duration: 700, easing: cubicOut }}
            out:fade={{ duration: 700, easing: cubicOut }}
            class="absolute inset-0 h-full w-full object-cover"
            src={videos[currentIndex]}
            autoplay
            {muted}
            playsinline
            onended={() => (currentIndex = (currentIndex + 1) % videos.length)}
          ></video>
        {/key}

        <!-- Selector de video (dots) -->
        <div class="absolute bottom-3 left-3 z-30 flex items-center gap-1.5">
          {#each videos as _, i (i)}
            <button
              onclick={() => (currentIndex = i)}
              aria-label={`Ver video ${i + 1}`}
              aria-current={currentIndex === i}
              class="h-1.5 rounded-full bg-white/90 shadow-sm transition-[width,opacity,transform] duration-150 ease-out active:scale-[0.9] {currentIndex ===
              i
                ? 'w-4 opacity-100'
                : 'w-1.5 opacity-50 hover:opacity-80'}"
            ></button>
          {/each}
        </div>

        <!-- Audio control -->
        <button
          onclick={() => (muted = !muted)}
          class="absolute bottom-3 right-3 z-30 flex size-6 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-[background-color,transform] duration-150 hover:bg-black/60 active:scale-[0.96]"
          aria-label={muted ? "Activar sonido" : "Silenciar"}
        >
          {#if muted}
            <VolumeX size={10} />
          {:else}
            <Volume2 size={10} />
          {/if}
        </button>
      </div>

      <!-- Íconos del collage — desktop (mask recolorable en dark) -->
      {#each collageDesktop as ic (ic.key)}
        <span
          class="wiwa-icon pointer-events-none absolute hidden select-none md:block"
          style={ic.style}
        ></span>
      {/each}

      <!-- Íconos del collage — mobile (posicionados para no cortarse) -->
      {#each collageMobile as ic (ic.key)}
        <span
          class="wiwa-icon pointer-events-none absolute select-none md:hidden"
          style={ic.style}
        ></span>
      {/each}
    </div>
  </div>

  <!-- Stats — desktop: columna grande a la derecha -->
  <div class="relative z-10 hidden flex-col gap-8 md:flex">
    {#each stats as stat, i (stat.value)}
      <div
        in:fly|global={{
          y: 8,
          duration: 350,
          delay: 200 + i * 80,
          easing: cubicOut,
        }}
        class="flex flex-col gap-1"
      >
        <span class="text-5xl font-medium tabular-nums text-foreground"
          >{stat.value}</span
        >
        <span class="text-xs text-muted-foreground">{stat.label}</span>
      </div>
    {/each}
  </div>

  <!-- Stats — mobile: rail horizontal con scroll + snap -->
  <div
    class="relative z-10 flex w-full snap-x snap-mandatory gap-8 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [touch-action:pan-x] md:hidden [&::-webkit-scrollbar]:hidden"
  >
    {#each stats as stat, i (stat.value)}
      <div
        in:fly|global={{ y: 8, duration: 300, delay: 250 + i * 70, easing: cubicOut }}
        class="flex shrink-0 snap-start flex-col gap-1"
      >
        <span class="text-5xl font-medium tabular-nums text-foreground"
          >{stat.value}</span
        >
        <span class="text-xs text-muted-foreground">{stat.label}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .wiwa-icon {
    background-color: #243d13;
  }

  :global(.dark) .wiwa-icon {
    background-color: #b4d8a4;
  }
</style>
