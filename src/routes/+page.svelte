<script lang="ts">
  import PixelTrail from "$lib/components/pixel-trail.svelte";

  const projects: { name: string; url: string }[] = [
    { name: "Project One", url: "#" },
    { name: "Project Two", url: "#" },
    { name: "Project Three", url: "#" },
  ];
</script>

<main class="relative h-screen overflow-hidden bg-background">
  <PixelTrail
    pixelColor="oklch(0.649 0.209 294.245 / 0.4)"
    pixelSize={24}
    fadeDuration={700}
  />

  <div class="relative z-10 flex h-full w-full items-center px-12 lg:px-20">
    <div class="flex w-full max-w-screen-xl mx-auto items-center gap-16">
      <!-- Left: project links -->
      <div class="flex-1">
        <p
          class="label text-muted-foreground text-sm mb-8"
          style="text-wrap: balance;"
        >
          <span class="text-primary">//</span> projects
        </p>
        <nav class="flex flex-col gap-1">
          {#each projects as project, i (project.name)}
            <a
              href={project.url}
              class="link group flex items-baseline gap-3 w-fit py-1"
              style="animation-delay: {i * 60 + 200}ms"
            >
              <span
                class="text-muted-foreground text-sm transition-colors duration-150 group-hover:text-accent group-focus-visible:text-accent"
                >//</span
              >
              <span
                class="text-foreground text-base transition-colors duration-150 group-hover:text-accent group-focus-visible:text-accent"
                >{project.name}</span
              >
            </a>
          {/each}
        </nav>
      </div>

      <!-- Right: logo -->
      <div class="flex-1 flex justify-end items-center">
        <svg
          class="logo w-full max-w-lg"
          viewBox="0 0 1148 197"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="codeline"
        >
          <path
            d="M116.38 170.1H107.43V179.05H98.48V188.01H89.52V196.96H35.81V188.01H26.85V179.05H17.9V170.1H8.95V161.15H0V89.53H8.95V80.57H17.9V71.62H26.85V62.67H35.81V53.72H89.52V62.67H98.48V71.62H107.43V80.57H116.38V98.48H89.52V89.53H80.57V80.57H44.76V89.53H35.81V98.48H26.85V152.2H35.81V161.15H44.76V170.1H80.57V161.15H89.52V152.2H116.38V170.1Z"
            fill="currentColor"
          />
          <path
            d="M246.79 161.15H237.84V170.1H228.89V179.05H219.94V188H210.99V196.95H166.23V188H157.28V179.05H148.33V170.1H139.38V161.15H130.43V89.53H139.38V80.58H148.33V71.63H157.28V62.68H166.23V53.73H210.99V62.68H219.94V71.63H228.89V80.58H237.84V89.53H246.79V161.15ZM219.93 152.2V98.48H210.98V89.53H202.03V80.58H175.17V89.53H166.22V98.48H157.27V152.2H166.22V161.15H175.17V170.1H202.03V161.15H210.98V152.2H219.93Z"
            fill="currentColor"
          />
          <path
            d="M377.2 196.96H350.34V179.05H341.39V188H332.44V196.95H287.68V188H278.73V179.05H269.78V170.1H260.83V80.57H269.78V71.62H278.73V62.67H287.68V53.72H332.44V62.67H341.39V71.62H350.34V0H377.2V196.96ZM350.34 152.2V98.48H341.39V89.53H332.44V80.58H296.63V89.53H287.68V161.15H296.63V170.1H332.44V161.15H341.39V152.2H350.34Z"
            fill="currentColor"
          />
          <path
            d="M507.61 125.34H498.66V134.29H489.71V143.24H418.09V161.14H427.04V170.09H498.66V196.95H418.09V188H409.14V179.05H400.19V170.1H391.24V80.57H400.19V71.62H409.14V62.67H418.09V53.72H480.76V62.67H489.71V71.62H498.66V80.57H507.61V125.33V125.34ZM480.75 116.39V89.53H471.8V80.58H427.04V89.53H418.09V116.39H480.76H480.75Z"
            fill="currentColor"
          />
          <path
            d="M745.38 196.96H628.99V170.1H673.75V80.57H655.85V53.71H700.61V170.1H745.37V196.96H745.38ZM700.61 26.86H673.75V0H700.61V26.86Z"
            fill="currentColor"
          />
          <path
            d="M875.79 196.96H848.93V89.53H839.98V80.57H804.17V89.53H795.21V98.48H786.26V196.96H759.4V53.72H786.26V71.62H795.21V62.67H804.17V53.72H848.93V62.67H857.88V71.62H866.84V80.57H875.79V196.96Z"
            fill="currentColor"
          />
          <path
            d="M1006.2 125.34H997.25V134.29H988.3V143.24H916.68V161.14H925.63V170.09H997.25V196.95H916.68V188H907.73V179.05H898.78V170.1H889.83V80.57H898.78V71.62H907.73V62.67H916.68V53.72H979.35V62.67H988.3V71.62H997.25V80.57H1006.2V125.33V125.34ZM979.34 116.39V89.53H970.39V80.58H925.63V89.53H916.68V116.39H979.35H979.34Z"
            fill="currentColor"
          />
          <path
            d="M561.25 170.1V161.15H552.3V0H525.44V26.86V170.1H534.4V179.05H543.35V188.01H552.3V196.96H614.97V170.1H561.25Z"
            fill="currentColor"
          />
          <path
            d="M1081.84 59.8001H1075.61V72.2701H1069.37V84.7401H1063.14V97.2101H1056.9V109.68H1050.67V122.15H1044.44V134.62H1038.2V147.09H1031.97V159.56H1025.73V172.03H1019.5V184.5H1013.26V196.96H1038.2V184.49H1044.43V172.02H1050.67V159.55H1056.9V147.08H1063.13V134.61H1069.37V122.14H1075.6V109.67H1081.84V97.2H1088.07V84.7301H1094.31V72.2701H1100.54V53.5701H1081.84V59.8001Z"
            fill="var(--primary)"
          />
          <path
            d="M1129.02 53.5701V59.8001H1122.79V72.2701H1116.55V84.7401H1110.32V97.2101H1104.09V109.68H1097.85V122.15H1091.62V134.62H1085.38V147.09H1079.15V159.56H1072.91V172.03H1066.68V184.5H1060.44V196.96H1085.38V184.49H1091.61V172.02H1097.85V159.55H1104.08V147.08H1110.31V134.61H1116.55V122.14H1122.78V109.67H1129.02V97.2101H1135.25V84.7401H1141.49V72.2701H1147.72V53.5701H1129.02Z"
            fill="var(--primary)"
          />
        </svg>
      </div>
    </div>
  </div>
</main>

<style>
  .label {
    opacity: 1;
    transform: translateY(0);
    transition:
      opacity 300ms cubic-bezier(0.23, 1, 0.32, 1),
      transform 300ms cubic-bezier(0.23, 1, 0.32, 1);

    @starting-style {
      opacity: 0;
      transform: translateY(8px);
    }
  }

  .link {
    opacity: 1;
    transform: translateY(0);
    animation: fadeUp 250ms cubic-bezier(0.23, 1, 0.32, 1) both;
    text-decoration: none;
  }

  .link:active span {
    transform: scale(0.96);
    display: inline-block;
  }

  @media (hover: hover) and (pointer: fine) {
    .link span {
      transition-property: color, transform;
      transition-duration: 150ms;
      transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
    }

    .link:hover span:last-child,
    .link:focus-visible span:last-child {
      transform: translateX(4px);
    }
  }

  .logo {
    opacity: 1;
    transform: scale(1);
    transition:
      opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 100ms,
      transform 400ms cubic-bezier(0.23, 1, 0.32, 1) 100ms;

    @starting-style {
      opacity: 0;
      transform: scale(0.97);
    }
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
