import type { Variants, Transition } from "framer-motion";

export const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_SNAPPY: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 24,
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: EASE_SMOOTH },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: EASE_SMOOTH },
  }),
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: EASE_SMOOTH },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, delay: i * 0.06, ease: EASE_SNAPPY },
  }),
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: EASE_SMOOTH },
  }),
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: EASE_SMOOTH },
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_SMOOTH },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: EASE_SMOOTH },
  },
};

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: EASE_SNAPPY },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 6,
    transition: { duration: 0.15 },
  },
};

export const pulseGlow: Variants = {
  animate: {
    scale: [1, 1.15, 1],
    opacity: [0.4, 0.7, 0.4],
    transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
  },
};

export const floatY: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

export const shimmerSweep: Variants = {
  animate: {
    x: ["-100%", "100%"],
    transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
  },
};

export const buttonTap = {
  scale: 0.97,
};

export const buttonHover = {
  scale: 1.02,
};