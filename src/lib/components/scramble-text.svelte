<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import { prefersReducedMotion } from "svelte/motion";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn, type WithoutChildren } from "$lib/utils.js";

  const DEFAULT_SCRAMBLE_SPEED = 50;
  const DEFAULT_SCRAMBLED_LETTER_COUNT = 2;
  const DEFAULT_CHARACTERS = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";

  type Props = WithoutChildren<HTMLAttributes<HTMLSpanElement>> & {
    text: string;
    scrambleSpeed?: number;
    scrambledLetterCount?: number;
    characters?: string;
    autoStart?: boolean;
    /** Applies to the revealed portion of the text, matching Fancy's `className` prop. */
    className?: string;
    /** Applies to the scrambled portion of the text. */
    scrambledClassName?: string;
    onStart?: () => void;
    onComplete?: () => void;
  };

  let {
    text,
    scrambleSpeed = DEFAULT_SCRAMBLE_SPEED,
    scrambledLetterCount = DEFAULT_SCRAMBLED_LETTER_COUNT,
    characters = DEFAULT_CHARACTERS,
    autoStart = true,
    class: className,
    className: sourceClassName,
    scrambledClassName,
    onStart,
    onComplete,
    "data-slot": dataSlot = "scramble-text",
    ...restProps
  }: Props = $props();

  let safeScrambleSpeed = $derived(
    Number.isFinite(scrambleSpeed) && scrambleSpeed > 0
      ? scrambleSpeed
      : DEFAULT_SCRAMBLE_SPEED,
  );
  let safeScrambledLetterCount = $derived(
    Number.isFinite(scrambledLetterCount) &&
      Number.isInteger(scrambledLetterCount) &&
      scrambledLetterCount >= 0
      ? scrambledLetterCount
      : DEFAULT_SCRAMBLED_LETTER_COUNT,
  );
  let safeCharacters = $derived(
    typeof characters === "string" && Array.from(characters).length > 0
      ? characters
      : DEFAULT_CHARACTERS,
  );

  let revealedText = $state("");
  let scrambledText = $state("");
  let isAnimating = $state(false);

  let interval: ReturnType<typeof setInterval> | undefined;
  let animationId = 0;
  let visibleCharacterCount = 0;
  let activeText = "";
  let activeTextCharacters: string[] = [];
  let activeCharacters: string[] = [];
  let activeScrambledLetterCount = 0;
  let activeOnComplete: (() => void) | undefined;
  let previousAutoStart: boolean | undefined;
  let previousText: string | undefined;

  /** Starts the scramble animation from an empty visual state. */
  export function start() {
    const run = ++animationId;

    stopTimer();
    isAnimating = true;
    visibleCharacterCount = 0;
    revealedText = "";
    scrambledText = "";
    activeText = text;
    activeTextCharacters = Array.from(text);
    activeCharacters = Array.from(safeCharacters);
    activeScrambledLetterCount = safeScrambledLetterCount;
    activeOnComplete = onComplete;

    onStart?.();

    // Callbacks may synchronously start or reset the component.
    if (run !== animationId || !isAnimating) return;

    if (activeTextCharacters.length === 0 || prefersReducedMotion.current) {
      complete(run);
      return;
    }

    interval = setInterval(() => advance(run), safeScrambleSpeed);
  }

  /** Stops the animation and clears all visual text. */
  export function reset() {
    animationId += 1;
    stopTimer();
    isAnimating = false;
    visibleCharacterCount = 0;
    revealedText = "";
    scrambledText = "";
  }

  function syncAutoStart() {
    const nextAutoStart = autoStart;
    const nextText = text;
    const textChanged = previousText !== undefined && previousText !== nextText;
    const shouldStart =
      nextAutoStart && (!previousAutoStart || previousText !== nextText);

    previousAutoStart = nextAutoStart;
    previousText = nextText;

    if (shouldStart) {
      // Keep animation state and callback props out of this attachment's dependencies.
      untrack(start);
    } else if (textChanged && !nextAutoStart) {
      untrack(reset);
    }
  }

  function syncReducedMotion() {
    if (!isAnimating || !prefersReducedMotion.current) return;

    untrack(() => complete(animationId));
  }

  onDestroy(() => {
    animationId += 1;
    stopTimer();
  });

  function advance(run: number) {
    if (run !== animationId || !isAnimating) return;

    if (prefersReducedMotion.current) {
      complete(run);
      return;
    }

    const nextVisibleCharacterCount = visibleCharacterCount + 1;
    visibleCharacterCount = nextVisibleCharacterCount;
    revealedText = activeTextCharacters
      .slice(0, nextVisibleCharacterCount)
      .join("");
    scrambledText = createScrambledText(
      Math.min(
        activeScrambledLetterCount,
        activeTextCharacters.length - nextVisibleCharacterCount,
      ),
    );

    if (nextVisibleCharacterCount >= activeTextCharacters.length) {
      complete(run);
    }
  }

  function complete(run: number) {
    if (run !== animationId || !isAnimating) return;

    stopTimer();
    revealedText = activeText;
    scrambledText = "";
    isAnimating = false;
    activeOnComplete?.();
  }

  function stopTimer() {
    if (interval === undefined) return;

    clearInterval(interval);
    interval = undefined;
  }

  function createScrambledText(count: number) {
    return Array.from(
      { length: count },
      () =>
        activeCharacters[Math.floor(Math.random() * activeCharacters.length)],
    ).join("");
  }
</script>

<span
  data-slot={dataSlot}
  class={cn("inline-block whitespace-pre-wrap", className)}
  {...restProps}
  {@attach syncAutoStart}
  {@attach syncReducedMotion}
>
  <span class="sr-only">{text}</span>
  <span aria-hidden="true"
    ><span class={cn(sourceClassName)}>{revealedText}</span><span
      class={cn(scrambledClassName)}>{scrambledText}</span
    ></span
  >
</span>
