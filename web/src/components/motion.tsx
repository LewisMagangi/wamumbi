"use client"

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react"
import { useEffect, useRef, type ReactNode } from "react"

/** Fade + rise into view once. Quiet by design; disabled for reduced motion. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Counts up to a number when it scrolls into view (the page's one "signature" moment). */
export function CountUp({ to, suffix = "", className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" })
  const reduce = useReducedMotion()
  const value = useMotionValue(reduce ? to : 0)
  const text = useTransform(value, (v) => `${Math.round(v).toLocaleString()}${suffix}`)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(value, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1] })
    return () => controls.stop()
  }, [inView, reduce, to, value])

  return (
    <span ref={ref} className={className} aria-label={`${to.toLocaleString()}${suffix}`}>
      <motion.span aria-hidden>{text}</motion.span>
    </span>
  )
}
