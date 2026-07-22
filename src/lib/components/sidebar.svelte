<script lang="ts">
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { cn } from "$lib/utils";
  import { projects } from "$lib/projects";

  interface Props {
    onselect: (index: number) => void;
  }

  let { onselect }: Props = $props();

  const contacts = [
    { handle: "@Cheveniko", url: "https://x.com/Cheveniko" },
    {
      handle: "Linkedin",
      url: "https://www.linkedin.com/in/nicolas-baquero",
    },
  ];
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

  <footer class="mt-auto border-t border-border pt-8">
    <h2
      in:fly|global={{
        y: 6,
        duration: 300,
        delay: projects.length * 50,
        easing: cubicOut,
      }}
      class="mb-2 text-xs text-muted-foreground"
    >
      Contacto
    </h2>
    <div
      in:fly|global={{
        y: 6,
        duration: 300,
        delay: (projects.length + 1) * 50,
        easing: cubicOut,
      }}
      class="flex flex-wrap gap-x-3 gap-y-1 text-sm"
    >
      {#each contacts as contact (contact.url)}
        <a
          href={contact.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={contact.handle}
          class="text-muted-foreground transition-[color,transform] duration-150 hover:text-foreground active:scale-[0.96]"
        >
          {contact.handle}
        </a>
      {/each}
    </div>
  </footer>
</div>
