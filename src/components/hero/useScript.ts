import { useEffect, useRef, useState } from 'react';

/**
 * Tiny timeline engine for the hero demo.
 *
 * Give it an initial state and a list of steps ordered by `at` (ms from the start of the loop).
 * It plays each step once, holds the final frame, fades back to the initial state and loops.
 *
 * Tweaking timings: edit the `at` values in the steps array passed in (see HeroDemo.tsx).
 * Nothing else needs to change; the engine simply fires whatever is due.
 */
export interface ScriptStep<S> {
  /** milliseconds from the start of the loop */
  at: number;
  action: (state: S) => S;
}

export interface ScriptOptions {
  /** how long the finished frame sits before resetting */
  holdMs?: number;
  /** crossfade back to the first frame */
  fadeMs?: number;
}

export function useScript<S>(
  initial: S,
  steps: ScriptStep<S>[],
  playing: boolean,
  { holdMs = 2500, fadeMs = 600 }: ScriptOptions = {}
) {
  const [state, setState] = useState<S>(initial);
  /** 1 normally, 0 while the loop fades back to the start */
  const [opacity, setOpacity] = useState(1);
  const frame = useRef<number | null>(null);
  const startedAt = useRef<number>(0);
  const nextStep = useRef(0);
  const phase = useRef<'playing' | 'holding' | 'fading'>('playing');

  useEffect(() => {
    if (!playing) {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
      return;
    }

    const last = steps.length ? steps[steps.length - 1].at : 0;
    const restart = (now: number) => {
      startedAt.current = now;
      nextStep.current = 0;
      phase.current = 'playing';
      setState(initial);
      setOpacity(1);
    };

    const tick = (now: number) => {
      if (!startedAt.current) startedAt.current = now;
      const elapsed = now - startedAt.current;

      if (phase.current === 'playing') {
        while (nextStep.current < steps.length && steps[nextStep.current].at <= elapsed) {
          const step = steps[nextStep.current++];
          setState((prev) => step.action(prev));
        }
        if (nextStep.current >= steps.length && elapsed >= last) phase.current = 'holding';
      } else if (phase.current === 'holding' && elapsed >= last + holdMs) {
        phase.current = 'fading';
        setOpacity(0);
      } else if (phase.current === 'fading' && elapsed >= last + holdMs + fadeMs) {
        restart(now);
      }

      frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame((now) => {
      restart(now);
      frame.current = requestAnimationFrame(tick);
    });

    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
    // steps and initial are module-level constants in HeroDemo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  return { state, opacity };
}
