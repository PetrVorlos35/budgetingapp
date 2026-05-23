"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, useTransform, motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  currency?: string;
}

export function AnimatedCounter({ value, currency = "$" }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const [isMounted, setIsMounted] = useState(false);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 25,
    stiffness: 120,
  });

  const display = useTransform(springValue, (current) => {
    return `${currency}${current.toFixed(2)}`;
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      motionValue.set(value);
    }
  }, [isMounted, value, motionValue]);

  if (!isMounted) {
    return <span>{currency}{value.toFixed(2)}</span>;
  }

  return <motion.span ref={ref}>{display}</motion.span>;
}
