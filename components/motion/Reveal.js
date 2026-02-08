"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Reveal - A reusable scroll-reveal animation component
 * 
 * Reveals content when it enters the viewport with a subtle fade + slide up effect.
 * Respects user's reduced motion preferences.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to reveal
 * @param {number} props.delay - Delay before animation starts (seconds)
 * @param {number} props.duration - Animation duration (seconds)
 * @param {number} props.y - Initial Y offset (pixels)
 * @param {string} props.as - Wrapper element type (div, section, article, etc.)
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.amount - Viewport amount threshold (0-1)
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 0.55,
  y = 18,
  as = "div",
  className = "",
  amount = 0.25,
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();
  
  const MotionComponent = motion[as] || motion.div;
  
  // If user prefers reduced motion, show content immediately with minimal/no animation
  const variants = {
    hidden: {
      opacity: prefersReducedMotion ? 1 : 0,
      y: prefersReducedMotion ? 0 : y,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };
  
  const transition = {
    duration: prefersReducedMotion ? 0.1 : duration,
    delay: prefersReducedMotion ? 0 : delay,
    ease: [0.25, 0.1, 0.25, 1], // easeOut cubic-bezier
  };
  
  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * RevealGroup - Container for staggered reveal animations
 * 
 * Wraps children and staggers their reveal animations.
 * Each direct child should be a Reveal component or motion element.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Reveal components to stagger
 * @param {number} props.staggerChildren - Delay between each child (seconds)
 * @param {number} props.delayChildren - Initial delay before first child (seconds)
 * @param {string} props.as - Wrapper element type
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.amount - Viewport amount threshold (0-1)
 */
export function RevealGroup({
  children,
  staggerChildren = 0.1,
  delayChildren = 0,
  as = "div",
  className = "",
  amount = 0.25,
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();
  
  const MotionComponent = motion[as] || motion.div;
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerChildren,
        delayChildren: prefersReducedMotion ? 0 : delayChildren,
      },
    },
  };
  
  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={containerVariants}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * RevealItem - Child item for use inside RevealGroup
 * 
 * Inherits animation timing from parent RevealGroup.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to reveal
 * @param {number} props.y - Initial Y offset (pixels)
 * @param {number} props.duration - Animation duration (seconds)
 * @param {string} props.as - Wrapper element type
 * @param {string} props.className - Additional CSS classes
 */
export function RevealItem({
  children,
  y = 18,
  duration = 0.55,
  as = "div",
  className = "",
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();
  
  const MotionComponent = motion[as] || motion.div;
  
  const itemVariants = {
    hidden: {
      opacity: prefersReducedMotion ? 1 : 0,
      y: prefersReducedMotion ? 0 : y,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.1 : duration,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };
  
  return (
    <MotionComponent
      variants={itemVariants}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
