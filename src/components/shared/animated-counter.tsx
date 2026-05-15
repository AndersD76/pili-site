"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    const numericMatch = value.match(/^(\d+)/);
    if (!numericMatch || !numericMatch[1]) {
      // Non-numeric value — show immediately via a microtask to avoid
      // synchronous setState inside an effect body (react-hooks/set-state-in-effect).
      const id = setTimeout(() => setDisplay(value), 0);
      return () => clearTimeout(id);
    }

    const matched = numericMatch[1];
    const target = parseInt(matched, 10);
    const suffix = value.slice(matched.length);
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current) + suffix);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
