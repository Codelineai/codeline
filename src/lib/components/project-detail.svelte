<script lang="ts">
  import type { Project } from "$lib/projects";
  import AnimatedText from "./animated-text.svelte";
  import Separator from "./ui/separator/separator.svelte";

  interface Props {
    project: Project;
    hasPrev: boolean;
    hasNext: boolean;
    onprev: () => void;
    onnext: () => void;
    onback: () => void;
  }

  let { project, hasPrev, hasNext, onprev, onnext, onback }: Props = $props();

  let Info = $derived(project.infoComponent);
</script>

<div
  class="flex h-full flex-col overflow-y-auto overscroll-contain px-6 py-6 md:px-8 md:py-10"
>
  <div class="flex flex-col gap-4">
    <h2 class="text-xl font-medium text-balance">{project.name}</h2>
    <Info />
  </div>

  <div class="mt-auto flex flex-col gap-3 pt-8">
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver ${project.name} en una nueva pestaña`}
      class="w-full transition-transform duration-150 active:scale-[0.98]"
    >
      <AnimatedText class="block bg-foreground dark:bg-primary w-full text-lg">
        {project.shortUrl} ↗
      </AnimatedText>
    </a>
    <Separator />
    <div class="flex gap-4">
      <button
        disabled={!hasPrev}
        onclick={onprev}
        class="text-xs text-muted-foreground transition-[color,transform] duration-150 hover:text-foreground active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-30"
      >
        ← Anterior
      </button>
      <button
        disabled={!hasNext}
        onclick={onnext}
        class="text-xs text-muted-foreground transition-[color,transform] duration-150 hover:text-foreground active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-30"
      >
        Siguiente →
      </button>
    </div>
    <button
      onclick={onback}
      class="w-fit text-xs text-muted-foreground transition-[color,transform] duration-150 hover:text-foreground active:scale-[0.96]"
    >
      Ver todos
    </button>
  </div>
</div>
