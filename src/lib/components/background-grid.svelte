<script lang="ts">
  import type { ClassValue } from "svelte/elements";

  interface Props {
    gridSize?: number;
    dotSize?: number;
    lineColor?: string;
    dotColor?: string;
    lineOpacity?: number;
    dotOpacity?: number;
    class?: ClassValue;
  }

  let {
    gridSize = 80,
    dotSize = 3,
    lineColor = "var(--border)",
    dotColor = "var(--muted-foreground)",
    lineOpacity = 0.65,
    dotOpacity = 0.5,
    class: className,
  }: Props = $props();

  const uid = $props.id();

  function clampOpacity(value: number) {
    if (!Number.isFinite(value)) {
      return 1;
    }

    return Math.min(1, Math.max(0, value));
  }

  let safeGridSize = $derived(
    Number.isFinite(gridSize) && gridSize > 0 ? gridSize : 80,
  );
  let safeDotSize = $derived(
    Number.isFinite(dotSize) && dotSize >= 0 ? dotSize : 3,
  );
  let safeLineOpacity = $derived(clampOpacity(lineOpacity));
  let safeDotOpacity = $derived(clampOpacity(dotOpacity));
  let patternId = $derived(`${uid}-background-grid`);
</script>

<svg
  aria-hidden="true"
  class={["pointer-events-none absolute inset-0 h-full w-full", className]}
  fill="none"
>
  <defs>
    <pattern
      id={patternId}
      width={safeGridSize}
      height={safeGridSize}
      patternUnits="userSpaceOnUse"
    >
      <path
        d={`M ${safeGridSize} 0 L 0 0 0 ${safeGridSize}`}
        stroke={lineColor}
        stroke-opacity={safeLineOpacity}
      />
      <circle
        cx="0"
        cy="0"
        r={safeDotSize}
        fill={dotColor}
        fill-opacity={safeDotOpacity}
      />
    </pattern>
  </defs>

  <rect width="100%" height="100%" fill={`url(#${patternId})`} />
</svg>
