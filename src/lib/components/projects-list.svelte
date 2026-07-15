<script lang="ts">
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { cn } from "$lib/utils";
  import { projects } from "$lib/projects";

  interface Props {
    onselect: (index: number) => void;
  }

  let { onselect }: Props = $props();
</script>

<div class="flex h-full flex-col overflow-y-auto px-6 py-6 md:px-8 md:py-10">
  <ul class="flex flex-col">
    {#each projects as project, i (project.slug)}
      <li
        class={cn(i < projects.length - 1 && "border-b border-border")}
        in:fly|global={{ y: 6, duration: 300, delay: i * 50, easing: cubicOut }}
      >
        <a
          href={`#${project.slug}`}
          class="flex min-h-[44px] w-full cursor-pointer items-center text-left text-muted-foreground transition-[color,transform] duration-150 hover:text-foreground active:scale-[0.96]"
          onclick={(event) => {
            event.preventDefault();
            onselect(i);
          }}
        >
          {project.name}
        </a>
      </li>
    {/each}
  </ul>
</div>
