<script module lang="ts">
  let topZIndex = 1;
</script>

<script lang="ts">
  import { draggable, type DragOptions } from "@neodrag/svelte";
  import { fromAction, type Attachment } from "svelte/attachments";
  import { prefersReducedMotion, Spring } from "svelte/motion";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "$lib/utils";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    children?: Snippet;
    bounds?: DragOptions["bounds"];
    defaultPosition?: DragOptions["defaultPosition"];
    disabled?: boolean;
    selectedOnTop?: boolean;
    tilt?: number;
    rotate?: number;
  }

  let {
    children,
    bounds = "parent",
    defaultPosition,
    disabled = false,
    selectedOnTop = true,
    tilt = 18,
    rotate = 0,
    class: className,
    ...restProps
  }: Props = $props();

  let isDragging = $state(false);
  let rotateX = $state(0);
  let rotateY = $state(0);
  let glareX = $state(50);
  let glareY = $state(50);
  let glareOpacity = $state(0);
  let scale = $state(1);
  let zIndex = $state(1);

  // Inclinación por inercia: la carta se ladea hacia la dirección del arrastre
  // (peso/lag) y al soltar vuelve a 0 con un rebote sutil (damping bajo).
  const fling = new Spring(
    { x: 0, y: 0 },
    { stiffness: 0.16, damping: 0.6 },
  );
  // Velocidad del puntero (px/ms) → grados de inclinación, con tope para que
  // los flings rápidos no exageren.
  const FLING_FACTOR = 26;
  const FLING_MAX = 14;
  let lastOffsetX = 0;
  let lastOffsetY = 0;
  let lastT = 0;

  const clampDeg = (v: number) => Math.max(-FLING_MAX, Math.min(FLING_MAX, v));

  function resetTilt() {
    rotateX = 0;
    rotateY = 0;
    glareX = 50;
    glareY = 50;
    glareOpacity = 0;
    scale = isDragging ? 1.015 : 1;
  }

  function tiltAttachment(currentTilt: number): Attachment<HTMLElement> {
    return (node) => {
      function handlePointerMove(event: PointerEvent) {
        if (prefersReducedMotion.current || disabled) {
          resetTilt();
          return;
        }

        // Durante el arrastre manda la inclinación por inercia (fling); el tilt
        // de hover se suprime porque el cursor queda casi fijo respecto a la carta.
        if (isDragging) return;

        const rect = node.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const xPercent = x / rect.width;
        const yPercent = y / rect.height;
        const deltaX = xPercent - 0.5;
        const deltaY = yPercent - 0.5;

        rotateX = -deltaY * currentTilt;
        rotateY = deltaX * currentTilt;
        glareX = xPercent * 100;
        glareY = yPercent * 100;
        glareOpacity = Math.min(
          0.22,
          Math.abs(deltaX) * 0.32 + Math.abs(deltaY) * 0.22,
        );
        scale = isDragging ? 1.015 : 1.01;
      }

      function handlePointerLeave() {
        resetTilt();
      }

      node.addEventListener("pointermove", handlePointerMove);
      node.addEventListener("pointerleave", handlePointerLeave);
      node.addEventListener("pointercancel", handlePointerLeave);

      return () => {
        node.removeEventListener("pointermove", handlePointerMove);
        node.removeEventListener("pointerleave", handlePointerLeave);
        node.removeEventListener("pointercancel", handlePointerLeave);
      };
    };
  }

  let dragOptions = $derived({
    bounds,
    defaultPosition,
    disabled,
    // Posiciona con la propiedad CSS `translate:` en vez de `transform: translate()`,
    // así el `transform` queda libre para el tilt 3D (perspective/rotate/scale) sin pisarse.
    legacyTranslate: false,
    threshold: { distance: 2 },
    onDragStart: ({ offsetX, offsetY, event }) => {
      isDragging = true;
      scale = prefersReducedMotion.current ? 1 : 1.015;
      lastOffsetX = offsetX;
      lastOffsetY = offsetY;
      lastT = event.timeStamp;

      if (selectedOnTop) {
        topZIndex += 1;
        zIndex = topZIndex;
      }
    },
    onDrag: ({ offsetX, offsetY, event }) => {
      if (prefersReducedMotion.current) return;

      const dt = event.timeStamp - lastT;
      if (dt <= 0) return;

      const vx = (offsetX - lastOffsetX) / dt;
      const vy = (offsetY - lastOffsetY) / dt;
      lastOffsetX = offsetX;
      lastOffsetY = offsetY;
      lastT = event.timeStamp;

      // fling.x → rotateX (mover vertical), fling.y → rotateY (mover horizontal):
      // la carta se ladea hacia la dirección del movimiento.
      fling.target = {
        x: clampDeg(-vy * FLING_FACTOR),
        y: clampDeg(vx * FLING_FACTOR),
      };
    },
    onDragEnd: () => {
      isDragging = false;
      fling.target = { x: 0, y: 0 };
      resetTilt();
    },
  } satisfies DragOptions);
</script>

<div
  {...restProps}
  {@attach fromAction(draggable, () => dragOptions)}
  {@attach tiltAttachment(tilt)}
  class={cn(
    "draggable-card relative inline-block cursor-grab touch-none select-none overflow-hidden rounded-md bg-card p-6 text-card-foreground shadow-2xl outline outline-1 outline-black/10 will-change-transform active:cursor-grabbing dark:outline-white/10",
    isDragging && "is-dragging",
    disabled && "pointer-events-none opacity-60",
    className,
  )}
  style:--rotate-x={`${rotateX}deg`}
  style:--rotate-y={`${rotateY}deg`}
  style:--fling-x={`${fling.current.x}deg`}
  style:--fling-y={`${fling.current.y}deg`}
  style:--fling-z={`${fling.current.y * 0.3}deg`}
  style:--base-rotate={`${rotate}deg`}
  style:--glare-x={`${glareX}%`}
  style:--glare-y={`${glareY}%`}
  style:--glare-opacity={glareOpacity}
  style:--card-scale={scale}
  style:--z-index={zIndex}
>
  <div class="relative z-10 h-full w-full">
    {@render children?.()}
  </div>
  <div class="draggable-card__glare" aria-hidden="true"></div>
</div>

<style>
  .draggable-card {
    z-index: var(--z-index);
    transform: perspective(3000px) rotate(var(--base-rotate, 0deg))
      rotateX(calc(var(--rotate-x) + var(--fling-x, 0deg)))
      rotateY(calc(var(--rotate-y) + var(--fling-y, 0deg)))
      rotateZ(var(--fling-z, 0deg)) scale(var(--card-scale));
    transform-style: preserve-3d;
    transition:
      transform 100ms cubic-bezier(0.23, 1, 0.32, 1),
      box-shadow 160ms cubic-bezier(0.23, 1, 0.32, 1),
      opacity 160ms ease;
  }

  .draggable-card.is-dragging {
    box-shadow:
      0 24px 70px rgb(0 0 0 / 0.24),
      0 8px 24px rgb(0 0 0 / 0.16);
  }

  .draggable-card__glare {
    pointer-events: none;
    position: absolute;
    inset: 0;
    z-index: 20;
    background: radial-gradient(
      circle at var(--glare-x) var(--glare-y),
      rgb(255 255 255 / 0.75),
      rgb(255 255 255 / 0.18) 26%,
      transparent 54%
    );
    opacity: var(--glare-opacity);
    transition: opacity 160ms cubic-bezier(0.23, 1, 0.32, 1);
  }

  @media (prefers-reduced-motion: reduce) {
    .draggable-card {
      transform: none;
      transition:
        box-shadow 160ms ease,
        opacity 160ms ease;
    }

    .draggable-card__glare {
      display: none;
    }
  }
</style>
