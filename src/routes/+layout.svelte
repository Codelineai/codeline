<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import { Button } from "$lib/components/ui/button";
  import { ModeWatcher, mode, toggleMode } from "mode-watcher";

  let { children } = $props();
  let targetMode = $derived(mode.current === "light" ? "dark" : "light");
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<ModeWatcher defaultMode="dark" />
{@render children()}

<Button
  variant="outline"
  size="sm"
  class="fixed right-4 bottom-4"
  onclick={toggleMode}
  aria-label={`Cambiar a tema ${targetMode === "dark" ? "oscuro" : "claro"}`}
>
  Tema {targetMode === "dark" ? "oscuro" : "claro"}
</Button>
