"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type DefinitionRotatorProps = {
  items: string[];
  intervalMs?: number; // total time between cycles
  typeDelayMs?: number; // per-character delay
  holdMs?: number; // pause after fully typed before deleting
  startDelayMs?: number; // delay before typing begins on mount
};

export function DefinitionRotator({ items, intervalMs = 4200, typeDelayMs = 50, holdMs = 2250, startDelayMs = 160 }: DefinitionRotatorProps) {
  const prefersReduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  const safeItems = useMemo(() => (items.length > 0 ? items : [""]), [items]);

  useEffect(() => {
    const current = safeItems[index] ?? "";
    if (prefersReduced) {
      setTyped(current);
      return;
    }

    let timeout: number | undefined;
    const atEnd = typed.length === current.length;
    const atStart = typed.length === 0;

    if (!isDeleting) {
      if (!atEnd) {
        const delay = typed.length === 0 ? startDelayMs : typeDelayMs;
        timeout = window.setTimeout(() => {
          setTyped(current.slice(0, typed.length + 1));
        }, delay);
      } else {
        setIsHolding(true);
        timeout = window.setTimeout(() => {
          setIsHolding(false);
          setIsDeleting(true);
        }, holdMs);
      }
    } else {
      if (!atStart) {
        timeout = window.setTimeout(() => {
          setTyped(current.slice(0, typed.length - 1));
        }, Math.max(35, typeDelayMs * 0.6));
      } else {
        setIsDeleting(false);
        setIsHolding(false);
        setIndex((i) => (i + 1) % safeItems.length);
      }
    }

    return () => {
      if (timeout) window.clearTimeout(timeout);
    };
  }, [typed, isDeleting, index, safeItems, typeDelayMs, holdMs, prefersReduced]);

  const current = safeItems[index] ?? "";
  const letters = current.split("");

  if (prefersReduced) {
    return (
      <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 tracking-tight whitespace-nowrap">
        {current}
      </p>
    );
  }

  const display = typed.length === 0 ? "\u00A0" : typed; // keep height when empty

  return (
    <div className="relative inline-flex items-baseline overflow-hidden whitespace-nowrap align-baseline min-h-[1em]">
      <span className="text-base text-neutral-700 dark:text-neutral-300 tracking-tight leading-tight">
        {display}
      </span>
      <BlinkCursor active={isHolding} />
    </div>
  );
}

function BlinkCursor({ active = false }: { active?: boolean }) {
  return (
    <span
      aria-hidden
      className={`ml-[1px] inline-block align-baseline leading-tight select-none text-neutral-500 dark:text-neutral-400 ${
        active ? "animate-[cursor-blink_1.1s_steps(1)_infinite]" : ""
      }`}
    >
      |
    </span>
  );
}


