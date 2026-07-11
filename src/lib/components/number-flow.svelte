<script lang="ts">
  import { untrack } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { prefersReducedMotion, Tween } from "svelte/motion";

  type SupportedNotation = Exclude<
    NonNullable<Intl.NumberFormatOptions["notation"]>,
    "scientific" | "engineering"
  >;
  type NumberFlowFormat = Omit<Intl.NumberFormatOptions, "notation"> & {
    notation?: SupportedNotation;
  };

  type AnimationCallback = (event: CustomEvent<void>) => void;

  type DigitGlyph = {
    key: string;
    value: string;
    digit: number;
  };

  type Segment = {
    key: string;
    value: string;
    digit?: number;
  };

  type DisplayPart = Intl.NumberFormatPart & {
    key: string;
    segments: Segment[];
    isNumeric: boolean;
  };

  interface Props {
    value: number;
    locales?: Intl.LocalesArgument;
    format?: NumberFlowFormat;
    prefix?: string;
    suffix?: string;
    animated?: boolean;
    respectMotionPreference?: boolean;
    duration?: number;
    class?: string;
    ref?: HTMLSpanElement | null;
    onAnimationsStart?: AnimationCallback;
    onAnimationsFinish?: AnimationCallback;
  }

  let {
    value,
    locales = undefined,
    format = {},
    prefix = "",
    suffix = "",
    animated = true,
    respectMotionPreference = true,
    duration = 650,
    class: className = "",
    ref = $bindable<HTMLSpanElement | null>(null),
    onAnimationsStart,
    onAnimationsFinish,
  }: Props = $props();

  const initialTarget = untrack(() => (Number.isFinite(value) ? value : 0));
  const initialTargetWasFinite = untrack(() => Number.isFinite(value));
  const tween = new Tween(initialTarget);

  let mounted = false;
  let animationId = 0;
  let currentTarget = initialTarget;
  let previousTargetWasFinite = initialTargetWasFinite;

  let safeDuration = $derived(
    Number.isFinite(duration) ? Math.max(0, duration) : 650,
  );
  let tweenTarget = $derived(Number.isFinite(value) ? value : 0);
  let targetIsFinite = $derived(Number.isFinite(value));
  let motionEnabled = $derived(
    animated &&
      !(respectMotionPreference && prefersReducedMotion.current) &&
      safeDuration > 0,
  );
  let formatter = $derived.by(() => new Intl.NumberFormat(locales, format));
  let accessibleLabel = $derived(
    `${prefix}${formatter.format(value)}${suffix}`,
  );
  let displayNumber = $derived.by(() => {
    if (!Number.isFinite(value)) return value;

    const next = motionEnabled ? tween.current : value;

    return shouldSnapToInteger(value, format) ? Math.round(next) : next;
  });
  let digitGlyphs = $derived.by(() => getDigitGlyphs(locales, formatter));
  let digitMap = $derived.by(() =>
    Object.fromEntries(digitGlyphs.map((glyph) => [glyph.value, glyph.digit])),
  );
  let displayParts = $derived.by(() =>
    getDisplayParts(formatter, displayNumber, digitMap),
  );
  let digitTransitionDuration = $derived(
    Math.round(Math.min(180, Math.max(80, safeDuration * 0.22))),
  );
  let digitDurationStyle = $derived(`${digitTransitionDuration}ms`);

  $effect(() => {
    const nextTarget = tweenTarget;
    const targetChanged =
      !Object.is(nextTarget, currentTarget) ||
      targetIsFinite !== previousTargetWasFinite;

    if (!mounted) {
      mounted = true;
      currentTarget = nextTarget;
      previousTargetWasFinite = targetIsFinite;
      void tween.set(nextTarget, { duration: 0 });
      return;
    }

    if (!targetChanged) {
      if (!motionEnabled || !targetIsFinite) {
        animationId += 1;
        void tween.set(nextTarget, { duration: 0 });
      }

      return;
    }

    const canAnimate =
      motionEnabled && targetIsFinite && previousTargetWasFinite;
    const run = ++animationId;

    currentTarget = nextTarget;
    previousTargetWasFinite = targetIsFinite;

    if (!canAnimate) {
      void tween.set(nextTarget, { duration: 0 });
      return;
    }

    onAnimationsStart?.(new CustomEvent("animationsstart"));

    void tween
      .set(nextTarget, {
        duration: safeDuration,
        easing: cubicOut,
      })
      .then(() => {
        if (run === animationId) {
          onAnimationsFinish?.(new CustomEvent("animationsfinish"));
        }
      });
  });

  function shouldSnapToInteger(target: number, options: NumberFlowFormat) {
    return (
      Number.isInteger(target) &&
      options.minimumFractionDigits === undefined &&
      options.maximumFractionDigits === undefined &&
      options.minimumSignificantDigits === undefined &&
      options.maximumSignificantDigits === undefined
    );
  }

  function getDigitGlyphs(
    nextLocales: Intl.LocalesArgument,
    nextFormatter: Intl.NumberFormat,
  ): DigitGlyph[] {
    const { numberingSystem } = nextFormatter.resolvedOptions();
    const digitFormatter = new Intl.NumberFormat(nextLocales, {
      useGrouping: false,
      maximumFractionDigits: 0,
      numberingSystem,
    });

    return Array.from({ length: 10 }, (_, digit) => ({
      key: `digit-${digit}`,
      value:
        digitFormatter
          .formatToParts(digit)
          .find((part) => part.type === "integer")?.value ?? String(digit),
      digit,
    }));
  }

  function getDisplayParts(
    nextFormatter: Intl.NumberFormat,
    nextValue: number,
    nextDigitMap: Readonly<Record<string, number>>,
  ): DisplayPart[] {
    const typeCounts: Record<string, number> = {};

    return nextFormatter.formatToParts(nextValue).map((part) => {
      const typeCount = typeCounts[part.type] ?? 0;
      typeCounts[part.type] = typeCount + 1;

      return {
        ...part,
        key: `${part.type}-${typeCount}`,
        segments: getSegments(part, nextDigitMap, typeCount),
        isNumeric: part.type === "integer" || part.type === "fraction",
      };
    });
  }

  function getSegments(
    part: Intl.NumberFormatPart,
    nextDigitMap: Readonly<Record<string, number>>,
    partOccurrence: number,
  ): Segment[] {
    const chars = Array.from(part.value);

    return chars.map((char, index) => {
      const digit = nextDigitMap[char];
      const place = part.type === "integer" ? chars.length - index - 1 : index;

      return {
        key: `${part.type}-${partOccurrence}-${digit === undefined ? "char" : "digit"}-${place}`,
        value: char,
        digit,
      };
    });
  }
</script>

<span
  bind:this={ref}
  class={["number-flow", className]}
  data-animated={motionEnabled ? "true" : "false"}
  data-respect-motion={respectMotionPreference ? "true" : "false"}
  style:--number-flow-digit-duration={digitDurationStyle}
>
  <span class="number-flow__sr-only">{accessibleLabel}</span>
  <span class="number-flow__visual" aria-hidden="true">
    {#if prefix}
      <span class="number-flow__affix number-flow__prefix">{prefix}</span>
    {/if}

    {#each displayParts as part (part.key)}
      <span
        class={[
          "number-flow__part",
          `number-flow__part--${part.type}`,
          part.isNumeric && "number-flow__part--numeric",
        ]}
        data-part={part.type}
      >
        {#each part.segments as segment (segment.key)}
          {#if segment.digit === undefined}
            <span class="number-flow__char">{segment.value}</span>
          {:else}
            <span
              class="number-flow__digit"
              style:--number-flow-digit={segment.digit}
            >
              <span class="number-flow__digit-stack">
                {#each digitGlyphs as glyph (glyph.key)}
                  <span class="number-flow__digit-glyph">{glyph.value}</span>
                {/each}
              </span>
            </span>
          {/if}
        {/each}
      </span>
    {/each}

    {#if suffix}
      <span class="number-flow__affix number-flow__suffix">{suffix}</span>
    {/if}
  </span>
</span>

<style>
  .number-flow {
    display: inline-flex;
    align-items: baseline;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  .number-flow__visual,
  .number-flow__part,
  .number-flow__affix {
    display: inline-flex;
    align-items: baseline;
  }

  .number-flow__sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .number-flow__digit {
    display: inline-block;
    height: 1em;
    overflow: hidden;
    vertical-align: -0.05em;
    line-height: 1;
    contain: layout paint;
  }

  .number-flow__digit-stack {
    display: flex;
    flex-direction: column;
    transform: translate3d(0, calc(var(--number-flow-digit, 0) * -1em), 0);
    transition: transform var(--number-flow-digit-duration, 140ms)
      cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform;
  }

  .number-flow__digit-glyph {
    height: 1em;
    line-height: 1;
    text-align: center;
  }

  .number-flow__char {
    display: inline-block;
  }

  .number-flow[data-animated="false"] .number-flow__digit-stack {
    transition-duration: 0ms;
    will-change: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    .number-flow[data-respect-motion="true"] .number-flow__digit-stack {
      transition-duration: 0ms;
      will-change: auto;
    }
  }
</style>
