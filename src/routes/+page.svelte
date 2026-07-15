<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import BackgroundGrid from "$lib/components/background-grid.svelte";
  import HomeButton from "$lib/components/home-button.svelte";
  import Logo from "$lib/components/logo.svelte";
  import PixelTrail from "$lib/components/pixel-trail.svelte";
  import ProjectDetail from "$lib/components/project-detail.svelte";
  import ProjectsList from "$lib/components/projects-list.svelte";
  import { projects } from "$lib/projects";

  let selected = $derived.by(() => {
    const slug = page.url.hash.slice(1);
    const index = projects.findIndex((project) => project.slug === slug);

    return index === -1 ? null : index;
  });

  function navigateToHash(hash: string) {
    const url = new URL(page.url);
    url.hash = hash;

    void goto(url, { noScroll: true, keepFocus: true });
  }

  function selectProject(index: number) {
    navigateToHash(projects[index].slug);
  }

  function clearSelection() {
    navigateToHash("");
  }

  function selectPrevious() {
    if (selected !== null && selected > 0) selectProject(selected - 1);
  }

  function selectNext() {
    if (selected !== null && selected < projects.length - 1)
      selectProject(selected + 1);
  }
</script>

<main class="flex h-dvh flex-col overflow-hidden bg-background md:flex-row">
  <div class="relative flex min-h-0 flex-1 overflow-hidden">
    <BackgroundGrid gridSize={80} />
    {#if selected === null}
      <div
        transition:fade={{ duration: 150, easing: cubicOut }}
        class="absolute inset-0 flex items-center overflow-hidden"
      >
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
    {:else}
      <div
        transition:fade={{ duration: 150, easing: cubicOut }}
        class="absolute left-6 top-6 z-20"
      >
        <HomeButton onclick={clearSelection} />
      </div>
      {@const ProjectComponent = projects[selected].highlightComponent}
      <div
        transition:fade={{ duration: 150, easing: cubicOut }}
        class="absolute inset-0 overflow-y-auto overscroll-contain md:overflow-hidden"
      >
        <div class="flex min-h-full items-center justify-center py-4 md:py-0">
          <ProjectComponent />
        </div>
      </div>
    {/if}
  </div>

  <div
    class="bg-border h-px w-full shrink-0 md:h-full md:w-px"
    aria-hidden="true"
  ></div>

  <div class="relative h-2/5 w-full md:h-full md:w-96">
    {#if selected === null}
      <div
        transition:fade={{ duration: 150, easing: cubicOut }}
        class="absolute inset-0"
      >
        <ProjectsList onselect={selectProject} />
      </div>
    {:else}
      <div
        transition:fade={{ duration: 150, easing: cubicOut }}
        class="absolute inset-0"
      >
        <ProjectDetail
          project={projects[selected]}
          hasPrev={selected > 0}
          hasNext={selected < projects.length - 1}
          onprev={selectPrevious}
          onnext={selectNext}
          onback={clearSelection}
        />
      </div>
    {/if}
  </div>
</main>
