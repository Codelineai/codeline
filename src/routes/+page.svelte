<script lang="ts">
  import { fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import BackgroundGrid from "$lib/components/background-grid.svelte";
  import HomeButton from "$lib/components/home-button.svelte";
  import Logo from "$lib/components/logo.svelte";
  import PixelTrail from "$lib/components/pixel-trail.svelte";
  import ProjectDetail from "$lib/components/project-detail.svelte";
  import ProjectsList from "$lib/components/projects-list.svelte";
  import { projects } from "$lib/projects";

  let selected = $state<number | null>(null);
</script>

<main class="flex h-screen flex-col overflow-hidden bg-background md:flex-row">
  <div class="relative flex min-h-0 flex-1 overflow-hidden">
    {#if selected !== null}
      <div
        transition:fade={{ duration: 150, easing: cubicOut }}
        class="absolute left-6 top-6 z-20"
      >
        <HomeButton onclick={() => (selected = null)} />
      </div>
    {/if}

    {#if selected === null}
      <div
        transition:fade={{ duration: 150, easing: cubicOut }}
        class="absolute inset-0 flex items-center overflow-hidden"
      >
        <BackgroundGrid gridSize={80} />
        <div class="absolute inset-0 hidden md:block">
          <PixelTrail
            pixelColor="oklch(0.649 0.209 294.245)"
            pixelSize={80}
            fadeDuration={300}
          />
        </div>
        <div class="relative z-10 mx-auto w-full max-w-lg px-8">
          <Logo />
        </div>
      </div>
    {/if}

    {#if selected !== null}
      {@const ProjectComponent = projects[selected].component}
      <div
        transition:fade={{ duration: 150, easing: cubicOut }}
        class="absolute inset-0 flex items-center justify-center"
      >
        <ProjectComponent />
      </div>
    {/if}
  </div>

  <div class="bg-border h-px w-full shrink-0 md:h-full md:w-px" aria-hidden="true"></div>

  <div class="relative h-2/5 w-full md:h-full md:w-96">
    {#if selected === null}
      <div
        transition:fade={{ duration: 150, easing: cubicOut }}
        class="absolute inset-0"
      >
        <ProjectsList onselect={(i) => (selected = i)} />
      </div>
    {/if}

    {#if selected !== null}
      <div
        transition:fade={{ duration: 150, easing: cubicOut }}
        class="absolute inset-0"
      >
        <ProjectDetail
          project={projects[selected]}
          hasPrev={selected > 0}
          hasNext={selected < projects.length - 1}
          onprev={() => {
            if (selected !== null) selected--;
          }}
          onnext={() => {
            if (selected !== null) selected++;
          }}
          onback={() => (selected = null)}
        />
      </div>
    {/if}
  </div>
</main>
