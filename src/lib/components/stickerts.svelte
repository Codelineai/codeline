<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import DraggableCard from "$lib/components/draggable-card.svelte";

  import cristianoRonaldo35Light from "$lib/assets/stickerts/cristiano-ronaldo-35-light.png";
  import cristianoRonaldo35Dark from "$lib/assets/stickerts/cristiano-ronaldo-35-dark.png";
  import messi200Light from "$lib/assets/stickerts/messi-200-light.png";
  import messi200Dark from "$lib/assets/stickerts/messi-200-dark.png";
  import paniniLogo1Light from "$lib/assets/stickerts/panini-logo-1-light.png";
  import paniniLogo1Dark from "$lib/assets/stickerts/panini-logo-1-dark.png";
  import officialMascots10Light from "$lib/assets/stickerts/official-mascots-10-light.png";
  import officialMascots10Dark from "$lib/assets/stickerts/official-mascots-10-dark.png";
  import kylianMbappe3Light from "$lib/assets/stickerts/kylian-mbappe-3-light.png";
  import kylianMbappe3Dark from "$lib/assets/stickerts/kylian-mbappe-3-dark.png";
  import squad1Light from "$lib/assets/stickerts/squad-1-light.png";
  import squad1Dark from "$lib/assets/stickerts/squad-1-dark.png";
  import uruguay1950OneFiveLight from "$lib/assets/stickerts/uruguay-1950-1-5-light.png";
  import uruguay1950OneFiveDark from "$lib/assets/stickerts/uruguay-1950-1-5-dark.png";
  import logoLight from "$lib/assets/stickerts/stickerts-logo-light.svg";
  import logoDark from "$lib/assets/stickerts/stickerts-logo-dark.svg";

  // Cromos a la venta, esparcidos por todo el hero. Cada cromo usa su par
  // claro/oscuro; agregar un cromo único = un objeto más con su import.
  // `x`/`y` son la posición base en % del panel (esquina sup-izq de la carta);
  // sesgadas al centro/izquierda para no tapar la columna de stats (derecha).
  // `rot` da el desorden. Cada carta se arrastra por todo el panel (bounds="parent").
  // `mobile`: en pantallas chicas mostramos menos cromos para que no se amontonen.
  // `mx`/`my`: posición alternativa (%) en mobile; si no están, usa x/y.
  type Cromo = {
    light: string;
    dark: string;
    alt: string;
    x: number;
    y: number;
    rot: number;
    mobile: boolean;
    primary?: boolean;
    mx?: number;
    my?: number;
  };
  const cromos: Cromo[] = [
    {
      light: paniniLogo1Light,
      dark: paniniLogo1Dark,
      alt: "Panini Logo 1 sticker",
      x: 50,
      y: 60,
      rot: 6,
      mobile: false,
    },
    {
      light: officialMascots10Light,
      dark: officialMascots10Dark,
      alt: "Official Mascots 10 sticker",
      x: 16,
      y: 38,
      rot: -4,
      mobile: true,
      mx: 75,
      my: 45,
    },
    {
      light: kylianMbappe3Light,
      dark: kylianMbappe3Dark,
      alt: "Kylian Mbappe 3 sticker",
      x: 46,
      y: 24,
      rot: 9,
      mobile: false,
    },
    {
      light: squad1Light,
      dark: squad1Dark,
      alt: "Squad 1 sticker",
      x: 6,
      y: 60,
      rot: 11,
      mobile: true,
      mx: 70,
      my: 20,
    },
    {
      light: uruguay1950OneFiveLight,
      dark: uruguay1950OneFiveDark,
      alt: "Uruguay 1950 1.5 sticker",
      x: 34,
      y: 56,
      rot: 8,
      mobile: true,
      my: 35,
      mx: 12,
    },
    {
      light: cristianoRonaldo35Light,
      dark: cristianoRonaldo35Dark,
      alt: "Cristiano Ronaldo 35 sticker",
      x: 4,
      y: 8,
      rot: -8,
      mobile: true,
      mx: 0,
      my: 10,
    },
    {
      light: messi200Light,
      dark: messi200Dark,
      alt: "Messi 200 premium sticker",
      x: 28,
      y: 12,
      rot: 2,
      mobile: true,
      primary: true,
      mx: 38,
      my: 21,
    },
  ];

  // Stats con tono deadpan: mismo formato serio que los proyectos-cliente,
  // el humor sale del contraste.
  const stats = [
    { value: "5K+", label: "visits in one month" },
    // { value: "5 días", label: "de construcción" },
    { value: "100+", label: "users" },
    // { value: "★★★★★", label: "aclamado por mi novia" },
    { value: "$200", label: "most expensive sticker" },
  ];

  const siteUrl = "https://www.stickerts.com";
</script>

<!-- Root que llena todo el panel del hero y sirve de área de arrastre (bounds) -->
<div
  in:fade|global={{ duration: 400, easing: cubicOut }}
  class="hero absolute inset-0 overflow-hidden"
>
  <!-- Cromos esparcidos — cada uno se arrastra por todo el panel -->
  {#each cromos as cromo, i (cromo.light)}
    <DraggableCard
      bounds="parent"
      rotate={cromo.rot}
      class={`cromo-card cromo-enter absolute rounded-2xl p-0 ${cromo.primary ? "z-[2] w-[144px] md:w-[212px]" : "w-[124px] md:w-[184px]"} ${cromo.mobile ? "" : "hidden md:block"}`}
      style={`--cx:${cromo.x}%;--cy:${cromo.y}%;--mcx:${cromo.mx ?? cromo.x}%;--mcy:${cromo.my ?? cromo.y}%;--enter-delay:${80 + i * 55}ms`}
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
    class="pointer-events-none absolute right-10 top-1/2 z-[1] hidden -translate-y-1/2 flex-col gap-10 lg:right-16 md:flex"
  >
    <div in:fly|global={{ y: 8, duration: 350, delay: 120, easing: cubicOut }}>
      <a
        href={siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Stickerts in a new tab"
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

  <!-- Overlay marca — mobile: logo arriba-derecha (alineado con el de codeline) -->
  <div
    in:fly|global={{ y: 8, duration: 350, delay: 120, easing: cubicOut }}
    class="pointer-events-none absolute right-6 top-6 z-[1] md:hidden"
  >
    <a
      href={siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Stickerts in a new tab"
      class="pointer-events-auto inline-block w-fit transition-[opacity,transform] duration-150 hover:opacity-80 active:scale-[0.97]"
    >
      <img src={logoDark} alt="Stickerts" class="h-6 w-auto dark:hidden" />
      <img
        src={logoLight}
        alt="Stickerts"
        class="hidden h-6 w-auto dark:block"
      />
    </a>
  </div>

  <!-- Overlay stats — mobile: rail horizontal con scroll + snap al pie -->
  <div
    class="absolute inset-x-0 bottom-4 z-[1] flex snap-x snap-mandatory gap-8 overflow-x-auto overscroll-x-contain px-6 scroll-px-6 [scrollbar-width:none] [touch-action:pan-x] md:hidden [&::-webkit-scrollbar]:hidden"
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
</div>

<style>
  /* Posición base de cada cromo (desktop). El drag de neodrag usa `translate:`,
     así que `left/top` acá no se pisan con el arrastre. */
  .hero :global(.cromo-card) {
    left: var(--cx);
    top: var(--cy);
  }

  /* En mobile, usar la posición alternativa (mx/my) si se definió. */
  @media (max-width: 767px) {
    .hero :global(.cromo-card) {
      left: var(--mcx);
      top: var(--mcy);
    }
  }

  /* Entrada al montar la sección: cada cromo aparece con un pop escalonado
     (--enter-delay). El keyframe termina EXACTAMENTE en el transform de reposo
     de la carta (perspective + rotate base + scale 1), así no hay salto hacia
     el tilt. `backwards` la mantiene oculta durante su delay; sin forwards para
     devolver el control del transform a neodrag/tilt al terminar. */
  .hero :global(.cromo-enter) {
    animation: cromo-in 480ms cubic-bezier(0.23, 1, 0.32, 1)
      var(--enter-delay, 0ms) backwards;
  }

  @keyframes cromo-in {
    from {
      opacity: 0;
      transform: perspective(3000px) rotate(var(--base-rotate, 0deg))
        translateY(14px) scale(0.86);
    }

    to {
      opacity: 1;
      transform: perspective(3000px) rotate(var(--base-rotate, 0deg))
        translateY(0) scale(1);
    }
  }

  /* Reduced-motion: conservamos el fade de opacidad (ayuda a entender que los
     cromos aparecen) pero quitamos el desplazamiento y el scale. */
  @media (prefers-reduced-motion: reduce) {
    .hero :global(.cromo-enter) {
      animation: cromo-fade 300ms ease var(--enter-delay, 0ms) backwards;
    }

    @keyframes cromo-fade {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }
  }
</style>
