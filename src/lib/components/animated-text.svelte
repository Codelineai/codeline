<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn, type WithoutChildren } from "$lib/utils.js";

  type Props = WithoutChildren<HTMLAttributes<HTMLSpanElement>> & {
    children?: Snippet;
    shimmerWidth?: number;
  };

  let {
    children,
    shimmerWidth = 100,
    class: className,
    style,
    "data-slot": dataSlot = "animated-text",
    ...restProps
  }: Props = $props();

  let safeShimmerWidth = $derived(
    Number.isFinite(shimmerWidth) && shimmerWidth > 0 ? shimmerWidth : 100,
  );
</script>

<span
  data-slot={dataSlot}
  class={cn(
    "animated-shiny-text mx-auto max-w-md bg-linear-to-r from-transparent via-black/80 via-50% to-transparent bg-clip-text bg-no-repeat text-neutral-600/70 dark:via-white/80 dark:text-neutral-400/70",
    className,
  )}
  {style}
  style:--shiny-width={`${safeShimmerWidth}px`}
  {...restProps}
>
  {@render children?.()}
</span>

<style>
  .animated-shiny-text {
    animation: shiny-text 14s infinite;
    background-position: 0 0;
    background-size: var(--shiny-width) 100%;
    transition: background-position 1s cubic-bezier(0.6, 0.6, 0, 1);
  }

  @media (prefers-reduced-motion: reduce) {
    .animated-shiny-text {
      animation: none;
      background-position: 0 0;
    }
  }

  @keyframes shiny-text {
    0%,
    90%,
    100% {
      background-position: calc(-100% - var(--shiny-width)) 0;
    }

    30%,
    60% {
      background-position: calc(100% + var(--shiny-width)) 0;
    }
  }
</style>
