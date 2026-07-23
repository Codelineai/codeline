<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { prefersReducedMotion } from "svelte/motion";
  import ScrambleText from "$lib/components/scramble-text.svelte";

  // Frases que rota el subtítulo. La primera enlaza el nombre a X; el prefijo "By "
  // es estático (no scramblea ni enlaza). Los placeholders son a reemplazar.
  type Phrase = { prefix?: string; text: string; href?: string };
  const phrases: Phrase[] = [
    { prefix: "By ", text: "Nicolás Baquero", href: "https://x.com/Cheveniko" },
    // { text: "Nicolás Baquero" }, // placeholder — reemplazar
    // { text: "Nicolás Baquero" }, // placeholder — reemplazar
  ];

  // Pausa (ms) que se mantiene una frase revelada antes de rotar a la siguiente.
  const HOLD_MS = 5000;

  let index = $state(0);
  const current = $derived(phrases[index]);

  let holdTimer: ReturnType<typeof setTimeout> | undefined;
  let paused = false;
  let awaitingAdvance = false;

  function clearHold() {
    if (holdTimer !== undefined) {
      clearTimeout(holdTimer);
      holdTimer = undefined;
    }
  }

  function handleComplete() {
    if (prefersReducedMotion.current || phrases.length <= 1) return;
    clearHold();
    holdTimer = setTimeout(fire, HOLD_MS);
  }

  function fire() {
    holdTimer = undefined;
    // Si estamos pausados (hover/focus o tab oculta), diferimos el avance.
    if (paused) {
      awaitingAdvance = true;
      return;
    }
    index = (index + 1) % phrases.length;
  }

  function pause() {
    paused = true;
  }

  function resume() {
    if (!paused) return;
    paused = false;
    if (awaitingAdvance) {
      awaitingAdvance = false;
      index = (index + 1) % phrases.length;
    }
  }

  function handleVisibility() {
    if (document.hidden) pause();
    else resume();
  }

  onMount(() => {
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  });

  onDestroy(clearHold);
</script>

<p
  in:fly|global={{ y: 6, duration: 300, delay: 150, easing: cubicOut }}
  class="mt-4 text-center text-lg text-muted-foreground"
  onmouseenter={pause}
  onmouseleave={resume}
  onfocusin={pause}
  onfocusout={resume}
>
  {#if current.prefix}{current.prefix}{/if}{#key index}<svelte:element
      this={current.href ? "a" : "span"}
      href={current.href}
      target={current.href ? "_blank" : undefined}
      rel={current.href ? "noopener noreferrer" : undefined}
      aria-label={current.href ? "Perfil de Nicolás Baquero en X" : undefined}
      class={current.href
        ? "inline-block text-muted-foreground underline-offset-4 transition-[color,transform] duration-150 hover:text-foreground hover:underline active:scale-[0.97]"
        : ""}
      ><ScrambleText
        text={current.text}
        onComplete={handleComplete}
        scrambledClassName="text-muted-foreground/50"
      /></svelte:element
    >{/key}
</p>
