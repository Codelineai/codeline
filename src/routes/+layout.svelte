<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/logomark.svg";
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
  class="fixed right-4 bottom-4 sm:right-auto sm:left-4"
  onclick={toggleMode}
  aria-label={`Switch to ${targetMode === "dark" ? "dark" : "light"} mode`}
>
  {targetMode === "dark" ? "dark" : "light"}
</Button>
