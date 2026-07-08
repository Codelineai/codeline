<script lang="ts">
  import type { ClassValue } from "svelte/elements";

  interface Props {
    pixelSize?: number;
    pixelColor?: string;
    fadeDuration?: number;
    delay?: number;
    class?: ClassValue;
    pixelClass?: ClassValue;
  }

  let {
    pixelSize = 20,
    pixelColor = "currentColor",
    fadeDuration = 500,
    delay = 0,
    class: className,
    pixelClass,
  }: Props = $props();

  let width = $state(0);
  let height = $state(0);

  let safePixelSize = $derived(
    Number.isFinite(pixelSize) && pixelSize > 0 ? pixelSize : 1,
  );
  let safeFadeDuration = $derived(
    Number.isFinite(fadeDuration) ? Math.max(0, fadeDuration) : 0,
  );
  let safeDelay = $derived(Number.isFinite(delay) ? Math.max(0, delay) : 0);
  let columns = $derived(Math.ceil(width / safePixelSize));
  let rows = $derived(Math.ceil(height / safePixelSize));
  let pixels = $derived.by(() => {
    const items: { key: string }[] = [];

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        items.push({ key: `${row}-${column}` });
      }
    }

    return items;
  });

  type AnimatedPixel = HTMLElement & { __pixelTrailAnimation?: Animation };

  let trailContainer: HTMLDivElement | null = null;
  let lastPixelKey: string | null = null;

  function setupContainer(container: HTMLDivElement) {
    trailContainer = container;

    const updateSize = (entry?: ResizeObserverEntry) => {
      const rect = entry?.contentRect ?? container.getBoundingClientRect();

      width = rect.width;
      height = rect.height;
      lastPixelKey = null;
    };

    const observer = new ResizeObserver(([entry]) => updateSize(entry));

    updateSize();
    observer.observe(container);

    return () => {
      observer.disconnect();

      if (trailContainer === container) {
        trailContainer = null;
        lastPixelKey = null;
      }

      for (const pixel of container.children) {
        if (pixel instanceof HTMLElement) {
          (pixel as AnimatedPixel).__pixelTrailAnimation?.cancel();
        }
      }
    };
  }

  function animatePixel(pixel: HTMLElement) {
    const animatedPixel = pixel as AnimatedPixel;
    const existingAnimation = animatedPixel.__pixelTrailAnimation;

    if (existingAnimation) {
      existingAnimation.cancel();
      animatedPixel.__pixelTrailAnimation = undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pixel.style.opacity = "0";
      return;
    }

    pixel.style.opacity = "1";

    if (safeFadeDuration <= 0) {
      return;
    }

    const animation = pixel.animate([{ opacity: 1 }, { opacity: 0 }], {
      delay: safeDelay,
      duration: safeFadeDuration,
      easing: "linear",
      fill: "forwards",
    });

    animatedPixel.__pixelTrailAnimation = animation;

    animation.onfinish = () => {
      if (animatedPixel.__pixelTrailAnimation !== animation) {
        return;
      }

      pixel.style.opacity = "0";
      animatedPixel.__pixelTrailAnimation = undefined;
    };

    animation.oncancel = () => {
      if (animatedPixel.__pixelTrailAnimation === animation) {
        animatedPixel.__pixelTrailAnimation = undefined;
      }
    };
  }

  function handlePointerMove(event: PointerEvent) {
    const container = trailContainer;

    if (!container || columns === 0 || rows === 0) {
      lastPixelKey = null;
      return;
    }

    const rect = container.getBoundingClientRect();

    if (
      event.clientX < rect.left ||
      event.clientX >= rect.right ||
      event.clientY < rect.top ||
      event.clientY >= rect.bottom
    ) {
      lastPixelKey = null;
      return;
    }

    const column = Math.floor((event.clientX - rect.left) / safePixelSize);
    const row = Math.floor((event.clientY - rect.top) / safePixelSize);

    if (row < 0 || row >= rows || column < 0 || column >= columns) {
      lastPixelKey = null;
      return;
    }

    const pixelKey = `${row}-${column}`;

    if (pixelKey === lastPixelKey) {
      return;
    }

    lastPixelKey = pixelKey;

    const pixel = container.children.item(row * columns + column);

    if (pixel instanceof HTMLElement) {
      animatePixel(pixel);
    }
  }

  function resetPointerTrail() {
    lastPixelKey = null;
  }
</script>

<svelte:window
  onpointermove={handlePointerMove}
  onpointerleave={resetPointerTrail}
  onblur={resetPointerTrail}
/>
<svelte:document onvisibilitychange={resetPointerTrail} />

<div
  {@attach setupContainer}
  aria-hidden="true"
  class={[
    "pixel-trail absolute inset-0 grid h-full w-full overflow-hidden pointer-events-none",
    className,
  ]}
  style:grid-template-columns={`repeat(${columns}, ${safePixelSize}px)`}
  style:grid-template-rows={`repeat(${rows}, ${safePixelSize}px)`}
>
  {#each pixels as pixel (pixel.key)}
    <div
      class={["h-full w-full pointer-events-none opacity-0", pixelClass]}
      style:background-color={pixelColor}
    ></div>
  {/each}
</div>
