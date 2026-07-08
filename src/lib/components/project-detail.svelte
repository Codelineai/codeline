<script lang="ts">
  import type { Project } from "$lib/data/projects";

  interface Props {
    project: Project;
    hasPrev: boolean;
    hasNext: boolean;
    onprev: () => void;
    onnext: () => void;
    onback: () => void;
  }

  let { project, hasPrev, hasNext, onprev, onnext, onback }: Props = $props();
</script>

<div class="flex h-full flex-col overflow-y-auto px-6 py-6 md:px-8 md:py-10">
  <div class="flex flex-col gap-4">
    <h2 class="text-xl font-medium">{project.name}</h2>
    <p class="text-sm text-pretty text-muted-foreground">
      {project.description}
    </p>
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      class="w-fit text-sm text-muted-foreground underline-offset-4 transition-colors duration-150 hover:text-foreground hover:underline"
    >
      Ver proyecto ↗
    </a>
  </div>

  <div class="mt-auto flex flex-col gap-3">
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
