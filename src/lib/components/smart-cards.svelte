<script lang="ts">
  import type { Attachment } from "svelte/attachments";
  import { cubicOut } from "svelte/easing";
  import { fade, fly } from "svelte/transition";
  import logomark from "$lib/assets/logomark.svg";

  const waves = [
    { id: "wave-a", delay: "0ms" },
    { id: "wave-b", delay: "250ms" },
    { id: "wave-c", delay: "500ms" },
  ] as const;

  const contactActions = ["message", "mail", "phone", "link"] as const;

  const stats = [
    { value: "+100", label: "tarjetas entregadas" },
    { value: "+5.000", label: "taps compartidos" },
    { value: "+2.000", label: "contactos guardados" },
  ];

  // Offset de secuencia inicial por card (01 → 02 → 03). En hover se
  // reproduce el demo de la card al instante (offset 0).
  const seqDelays = ["0ms", "80ms", "160ms"];

  // Un contador por card: al cambiar, `{#key}` remonta la ilustración y
  // re-dispara las animaciones CSS one-shot.
  let replay = $state([0, 0, 0]);
  // Tras el primer hover dejamos de aplicar el offset de secuencia.
  let hovered = $state([false, false, false]);

  function replayCard(i: number) {
    hovered[i] = true;
    replay[i] += 1;
  }

  const seqFor = (i: number) => (hovered[i] ? "0ms" : seqDelays[i]);

  // Las animaciones quedan en pausa (mostrando su estado inicial) hasta que
  // la card entra en el viewport; ahí se "arman" y corre el one-shot. Esto
  // importa en mobile, donde las cards están apiladas y bajo el fold.
  let inView = $state([false, false, false]);

  function revealOnce(onEnter: () => void): Attachment<HTMLElement> {
    return (node) => {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              onEnter();
              io.disconnect();
              break;
            }
          }
        },
        { threshold: 0.35, rootMargin: "0px 0px -12% 0px" },
      );
      io.observe(node);

      return () => io.disconnect();
    };
  }
</script>

<section
  class="w-full max-w-6xl px-4 py-6 sm:px-6"
  aria-label="Pasos para compartir con Smart Cards"
>
  <h2
    in:fly|global={{ y: 8, duration: 350, easing: cubicOut }}
    class="mb-6 text-center text-2xl font-semibold tracking-tight text-foreground sm:mb-8 sm:text-3xl"
  >
    Smart Cards
  </h2>

  <ol
    class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3"
  >
    <li
      in:fade={{ duration: 160, easing: cubicOut }}
      class="overflow-hidden rounded-[1.375rem] border border-border bg-card shadow-[0_18px_50px_-30px_rgba(0,0,0,0.25)] dark:shadow-[0_24px_60px_-36px_rgba(0,0,0,0.9)]"
    >
      <div
        class="relative flex h-60 items-center justify-center overflow-hidden bg-[radial-gradient(80%_80%_at_50%_40%,rgba(229,241,127,0.08),transparent_70%)] p-6 sm:h-64 xl:h-72"
        class:sc-armed={inView[0]}
        style:--seq={seqFor(0)}
        {@attach revealOnce(() => (inView[0] = true))}
        onpointerenter={() => replayCard(0)}
        aria-hidden="true"
        role="presentation"
      >
        <!-- La tarjeta aparece una sola vez (fuera del key) para no re-fadear
             en hover; solo el barrido se re-dispara. -->
        <div class="sc-perspective relative">
          <div
            class="sc-card3d relative h-[8.8rem] w-[14rem] overflow-hidden rounded-2xl border border-border bg-[linear-gradient(145deg,#17171f,#0d0d12)] shadow-[0_26px_50px_-20px_rgba(0,0,0,0.55)]"
          >
            <div class="absolute inset-0 flex items-center justify-center">
              <img src={logomark} alt="" class="h-12 w-auto select-none" />
            </div>
            {#key replay[0]}
              <div
                class="sc-shine absolute -top-[40%] left-0 h-[180%] w-11 bg-[linear-gradient(90deg,transparent,rgba(229,241,127,0.16),transparent)]"
              ></div>
            {/key}
          </div>
        </div>
      </div>

      <div class="border-t border-border px-6 pb-6 pt-5">
        <p class="mb-1.5 text-xs tracking-[0.18em] text-muted-foreground">01</p>
        <h3
          class="text-balance text-lg font-semibold leading-snug text-foreground"
        >
          Tu tarjeta, tu marca
        </h3>
      </div>
    </li>

    <li
      in:fade={{ delay: 45, duration: 500, easing: cubicOut }}
      class="overflow-hidden rounded-[1.375rem] border border-border bg-card shadow-[0_18px_50px_-30px_rgba(0,0,0,0.25)] dark:shadow-[0_24px_60px_-36px_rgba(0,0,0,0.9)]"
    >
      <div
        class="relative flex h-60 items-center justify-center overflow-hidden bg-[radial-gradient(80%_80%_at_62%_50%,rgba(148,120,255,0.09),transparent_70%)] p-6 sm:h-64 xl:h-72"
        class:sc-armed={inView[1]}
        style:--seq={seqFor(1)}
        {@attach revealOnce(() => (inView[1] = true))}
        onpointerenter={() => replayCard(1)}
        aria-hidden="true"
        role="presentation"
      >
        {#key replay[1]}
          <div
            class="absolute left-[44%] top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            {#each waves as wave (wave.id)}
              <div
                class="sc-wave absolute -m-[3.75rem] size-[7.5rem] rounded-full border-2 border-primary"
                style:--wave-delay={wave.delay}
              ></div>
            {/each}
          </div>

          <div
            class="sc-tap absolute left-[18%] top-[52%] flex h-[5.25rem] w-[8.25rem] origin-center items-center justify-center rounded-xl border border-border bg-[linear-gradient(145deg,#17171f,#0d0d12)] shadow-[0_18px_32px_-16px_rgba(0,0,0,0.55)] sm:left-[20%]"
          >
            <img src={logomark} alt="" class="h-7 w-auto select-none" />
          </div>
        {/key}

        <!-- El teléfono aparece una sola vez (fuera del key) para no re-fadear
             en hover y evitar el flash. -->
        <div
          class="sc-phone sc-phone-in absolute right-[18%] top-1/2 h-[12.875rem] w-[6.5rem] rounded-[1.375rem] border-2 border-border p-2 shadow-[0_20px_40px_-18px_rgba(0,0,0,0.55)] sm:right-[20%]"
        >
          <div
            class="flex size-full items-center justify-center rounded-[0.95rem] bg-[linear-gradient(180deg,#101018,#0b0b10)]"
          >
            <div
              class="flex size-[2.125rem] items-center justify-center rounded-lg border-2 border-primary"
            >
              <div
                class="size-3 rounded-[0.2rem] border-2 border-primary"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-border px-6 pb-6 pt-5">
        <p class="mb-1.5 text-xs tracking-[0.18em] text-muted-foreground">02</p>
        <h3
          class="text-balance text-lg font-semibold leading-snug text-foreground"
        >
          Comparte con un tap
        </h3>
      </div>
    </li>

    <li
      in:fade={{ delay: 90, duration: 160, easing: cubicOut }}
      class="overflow-hidden rounded-[1.375rem] border border-border bg-card shadow-[0_18px_50px_-30px_rgba(0,0,0,0.25)] dark:shadow-[0_24px_60px_-36px_rgba(0,0,0,0.9)] sm:col-span-2 xl:col-span-1"
    >
      <div
        class="relative flex h-72 items-center justify-center overflow-hidden bg-[radial-gradient(80%_80%_at_50%_40%,rgba(229,241,127,0.08),transparent_70%)] p-6"
        class:sc-armed={inView[2]}
        style:--seq={seqFor(2)}
        {@attach revealOnce(() => (inView[2] = true))}
        onpointerenter={() => replayCard(2)}
        aria-hidden="true"
        role="presentation"
      >
        {#key replay[2]}
          <div
            class="sc-phone flex h-[14rem] w-[8rem] rounded-[1.625rem] border-2 border-border p-2 shadow-[0_22px_44px_-18px_rgba(0,0,0,0.55)]"
          >
            <div
              class="flex size-full flex-col items-center overflow-hidden rounded-[1.2rem] bg-[linear-gradient(180deg,#111119,#0b0b10)] px-3 py-4"
            >
              <div
                class="sc-rise size-12 rounded-full border border-accent bg-[linear-gradient(145deg,#26262f,#16161c)]"
              ></div>
              <div
                class="sc-rise mt-4 h-[0.5rem] w-16 rounded-full bg-white/20"
                style:--rise-delay="120ms"
              ></div>
              <div
                class="sc-rise mt-2 h-[0.4rem] w-12 rounded-full bg-white/10"
                style:--rise-delay="240ms"
              ></div>
              <div
                class="sc-rise mt-4 flex h-7 w-full items-center justify-center rounded-lg bg-accent"
                style:--rise-delay="360ms"
              >
                <div class="h-[0.4rem] w-11 rounded-full bg-[#0b0b0e]/55"></div>
              </div>
              <div class="sc-rise mt-4 flex gap-1.5" style:--rise-delay="480ms">
                {#each contactActions as action (action)}
                  <span
                    class="size-4 rounded-md border border-white/15"
                    aria-hidden="true"
                  ></span>
                {/each}
              </div>
            </div>
          </div>
        {/key}
      </div>

      <div class="border-t border-border px-6 pb-6 pt-5">
        <p class="mb-1.5 text-xs tracking-[0.18em] text-muted-foreground">03</p>
        <h3
          class="text-balance text-lg font-semibold leading-snug text-foreground"
        >
          Guarda tu contacto
        </h3>
      </div>
    </li>
  </ol>

  <dl class="mt-8 grid grid-cols-3 gap-4 sm:mt-10 sm:gap-10">
    {#each stats as stat, i (stat.value)}
      <div
        in:fly|global={{
          y: 8,
          duration: 350,
          delay: 200 + i * 80,
          easing: cubicOut,
        }}
        class="flex flex-col items-center gap-1 text-center"
      >
        <dt
          class="text-2xl font-medium tabular-nums text-foreground sm:text-4xl"
        >
          {stat.value}
        </dt>
        <dd
          class="text-[0.7rem] leading-tight text-muted-foreground sm:text-xs"
        >
          {stat.label}
        </dd>
      </div>
    {/each}
  </dl>
</section>

<style>
  /* Curvas fuertes (Emil): las nativas se sienten débiles. */
  section {
    --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
    --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  }

  .sc-perspective {
    perspective: 1000px;
  }

  /* Las animaciones esperan en pausa (estado inicial) hasta que la card entra
     en el viewport y recibe `.sc-armed` (vía IntersectionObserver). */
  .sc-card3d,
  .sc-shine,
  .sc-tap,
  .sc-wave,
  .sc-phone-in,
  .sc-rise {
    animation-play-state: paused;
  }

  .sc-armed .sc-card3d,
  .sc-armed .sc-shine,
  .sc-armed .sc-tap,
  .sc-armed .sc-wave,
  .sc-armed .sc-phone-in,
  .sc-armed .sc-rise {
    animation-play-state: running;
  }

  /* Cuerpo de dispositivo: fijo oscuro (se lee como aparato) en ambos temas. */
  .sc-phone {
    background-color: #0b0b12;
  }

  :global(.dark) .sc-phone {
    background-color: #08080b;
  }

  /* ---- Card 1: la tarjeta 3D entra una vez y queda quieta e inclinada ---- */
  .sc-card3d {
    transform: translateY(0) rotateX(8deg) rotateY(-14deg);
    transform-style: preserve-3d;
    animation: sc-card3d 400ms var(--ease-out) both;
    animation-delay: var(--seq, 0ms);
  }

  /* El barrido cruza una sola vez y termina fuera de cuadro (invisible). */
  .sc-shine {
    transform: translateX(-160%) rotate(20deg);
    animation: sc-shine 750ms var(--ease-out) both;
    animation-delay: calc(var(--seq, 0ms) + 250ms);
  }

  /* ---- Card 2: rebote de "toque" + un ripple; todo vuelve a su base ---- */
  .sc-tap {
    transform: translateY(0) rotate(-6deg);
    animation: sc-tap 1100ms var(--ease-out) both;
    animation-delay: calc(var(--seq, 0ms) + 120ms);
  }

  .sc-wave {
    opacity: 0;
    transform: scale(0.35);
    animation: sc-wave 1200ms var(--ease-out) both;
    animation-delay: calc(var(--seq, 0ms) + 140ms + var(--wave-delay, 0ms));
  }

  /* El teléfono solo aparece (opacity + scale); su Y queda fija en -50%. */
  .sc-phone-in {
    transform: translateY(-50%);
    animation: sc-phone-in 450ms var(--ease-out) both;
    animation-delay: var(--seq, 0ms);
  }

  /* ---- Card 3: el perfil se construye una vez y queda completo ---- */
  .sc-rise {
    opacity: 0;
    transform: translateY(12px);
    animation: sc-rise 500ms var(--ease-out) both;
    animation-delay: calc(var(--seq, 0ms) + var(--rise-delay, 0ms));
  }

  @keyframes sc-card3d {
    from {
      opacity: 0;
      transform: translateY(10px) rotateX(8deg) rotateY(-14deg) scale(0.96);
    }

    to {
      opacity: 1;
      transform: translateY(0) rotateX(8deg) rotateY(-14deg) scale(1);
    }
  }

  @keyframes sc-shine {
    from {
      transform: translateX(-160%) rotate(20deg);
    }

    to {
      transform: translateX(260%) rotate(20deg);
    }
  }

  @keyframes sc-wave {
    0% {
      opacity: 0;
      transform: scale(0.35);
    }

    35% {
      opacity: 0.85;
    }

    100% {
      opacity: 0;
      transform: scale(1.9);
    }
  }

  @keyframes sc-tap {
    0% {
      transform: translateY(0) rotate(-6deg);
    }

    50% {
      transform: translateY(-25px) rotate(-6deg);
    }

    100% {
      transform: translateY(0) rotate(-6deg);
    }
  }

  @keyframes sc-phone-in {
    from {
      opacity: 0;
      transform: translateY(-50%) scale(0.96);
    }

    to {
      opacity: 1;
      transform: translateY(-50%) scale(1);
    }
  }

  @keyframes sc-rise {
    from {
      opacity: 0;
      transform: translateY(12px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sc-card3d,
    .sc-shine,
    .sc-wave,
    .sc-tap,
    .sc-phone-in,
    .sc-rise {
      animation: none;
    }

    .sc-card3d {
      opacity: 1;
      transform: rotateX(7deg) rotateY(-12deg);
    }

    /* Efectos transitorios: ocultos en reposo. */
    .sc-shine,
    .sc-wave {
      opacity: 0;
    }

    .sc-tap {
      transform: rotate(-6deg);
    }

    .sc-phone-in {
      opacity: 1;
      transform: translateY(-50%);
    }

    /* El perfil queda completo y visible. */
    .sc-rise {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
