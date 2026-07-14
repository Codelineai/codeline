<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import DraggableCard from "$lib/components/draggable-card.svelte";

  import messiLight from "$lib/assets/stickerts/light.png";
  import messiDark from "$lib/assets/stickerts/dark.png";
  import logoLight from "$lib/assets/stickerts/stickerts-logo-light.svg";
  import logoDark from "$lib/assets/stickerts/stickerts-logo-dark.svg";

  // Cromos a la venta, esparcidos por todo el hero. Por ahora reutiliza el par
  // Messi (claro/oscuro); agregar un cromo único = un objeto más con su import.
  // `x`/`y` son la posición base en % del panel (esquina sup-izq de la carta);
  // sesgadas al centro/izquierda para no tapar la columna de stats (derecha).
  // `rot` da el desorden. Cada carta se arrastra por todo el panel (bounds="parent").
  // `mobile`: en pantallas chicas mostramos menos cromos para que no se amontonen.
  const cromos = [
    { light: messiLight, dark: messiDark, alt: "Messi Extra", x: 4, y: 8, rot: -8, mobile: false },
    { light: messiLight, dark: messiDark, alt: "Messi Extra", x: 30, y: 4, rot: 6, mobile: false },
    { light: messiLight, dark: messiDark, alt: "Messi Extra", x: 16, y: 38, rot: -4, mobile: true },
    { light: messiLight, dark: messiDark, alt: "Messi Extra", x: 46, y: 24, rot: 9, mobile: true },
    { light: messiLight, dark: messiDark, alt: "Messi Extra", x: 6, y: 60, rot: 11, mobile: false },
    { light: messiLight, dark: messiDark, alt: "Messi Extra", x: 34, y: 56, rot: -7, mobile: true },
    { light: messiLight, dark: messiDark, alt: "Messi Extra", x: 52, y: 50, rot: 4, mobile: false },
  ];

  // Stats con tono deadpan: mismo formato serio que los proyectos-cliente,
  // el humor sale del contraste.
  const stats = [
    { value: "5K+", label: "visitas en un mes" },
    // { value: "5 días", label: "de construcción" },
    { value: "100+", label: "usuarios" },
    // { value: "★★★★★", label: "aclamado por mi novia" },
    { value: "$20", label: "la venta más cara" },
  ];

  const siteUrl = "https://www.stickerts.com";
</script>

<!-- Root que llena todo el panel del hero y sirve de área de arrastre (bounds) -->
<div
  in:fade|global={{ duration: 400, easing: cubicOut }}
  class="absolute inset-0 overflow-hidden"
>
  <!-- Cromos esparcidos — cada uno se arrastra por todo el panel -->
  {#each cromos as cromo, i (i)}
    <DraggableCard
      bounds="parent"
      rotate={cromo.rot}
      class={`absolute w-[124px] rounded-2xl p-0 md:w-[184px] ${cromo.mobile ? "" : "hidden md:block"}`}
      style={`left:${cromo.x}%;top:${cromo.y}%`}
    >
      <img
        src={cromo.light}
        alt={cromo.alt}
        draggable="false"
        class="block h-auto w-full dark:hidden"
      />
      <img
        src={cromo.dark}
        alt={cromo.alt}
        draggable="false"
        class="hidden h-auto w-full dark:block"
      />
    </DraggableCard>
  {/each}

  <!-- Overlay marca + stats — desktop: columna fija a la derecha, por encima -->
  <div
    class="pointer-events-none absolute right-6 top-1/2 z-[1] hidden -translate-y-1/2 flex-col gap-10 lg:right-10 md:flex"
  >
    <div in:fly|global={{ y: 8, duration: 350, delay: 120, easing: cubicOut }}>
      <a
        href={siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir Stickerts en una nueva pestaña"
        class="pointer-events-auto inline-block w-fit transition-[opacity,transform] duration-150 hover:opacity-80 active:scale-[0.97]"
      >
        <img src={logoDark} alt="Stickerts" class="h-8 w-auto dark:hidden" />
        <img
          src={logoLight}
          alt="Stickerts"
          class="hidden h-8 w-auto dark:block"
        />
      </a>
    </div>

    <div class="flex flex-col gap-8">
      {#each stats as stat, i (stat.label)}
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
  </div>

  <!-- Overlay marca — mobile: logo arriba-izquierda -->
  <div
    in:fly|global={{ y: 8, duration: 350, delay: 120, easing: cubicOut }}
    class="pointer-events-none absolute right-6 top-6 z-[1] md:hidden"
  >
    <a
      href={siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir Stickerts en una nueva pestaña"
      class="pointer-events-auto inline-block w-fit transition-[opacity,transform] duration-150 hover:opacity-80 active:scale-[0.97]"
    >
      <img src={logoDark} alt="Stickerts" class="h-6 w-auto dark:hidden" />
      <img src={logoLight} alt="Stickerts" class="hidden h-6 w-auto dark:block" />
    </a>
  </div>

  <!-- Overlay stats — mobile: rail horizontal con scroll + snap al pie -->
  <div
    class="absolute inset-x-0 bottom-4 z-[1] flex snap-x snap-mandatory gap-8 overflow-x-auto overscroll-x-contain px-6 [scrollbar-width:none] [touch-action:pan-x] md:hidden [&::-webkit-scrollbar]:hidden"
  >
    {#each stats as stat, i (stat.label)}
      <div
        in:fly|global={{
          y: 8,
          duration: 300,
          delay: 250 + i * 70,
          easing: cubicOut,
        }}
        class="flex shrink-0 snap-start flex-col gap-1"
      >
        <span class="text-5xl font-medium tabular-nums text-foreground"
          >{stat.value}</span
        >
        <span class="whitespace-nowrap text-xs text-muted-foreground"
          >{stat.label}</span
        >
      </div>
    {/each}
  </div>

  <!-- Hint sutil de interacción (solo desktop; en mobile está el rail al pie) -->
  <span
    in:fade|global={{ duration: 400, delay: 500, easing: cubicOut }}
    class="pointer-events-none absolute bottom-5 left-6 z-[1] hidden text-xs text-muted-foreground/70 select-none md:block"
  >
    arrastrá los cromos
  </span>
</div>
