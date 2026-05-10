// ============================================================
// Animation Engine
// Resolves CMS animation configs into motion-compatible props.
// Integrates with the `motion` library (Framer Motion).
// ============================================================

export interface CMSAnimationConfig {
  type?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'bounce' | 'none';
  duration?: number;   // seconds
  delay?: number;      // seconds
  easing?: string;
  trigger?: 'always' | 'on-scroll' | 'on-hover';
  stagger?: number;    // stagger delay for children (ms)
}

export type MotionVariants = {
  hidden: Record<string, any>;
  visible: Record<string, any>;
};

/**
 * Resolve CMS animation config to Framer Motion variants.
 */
export function resolveAnimationVariants(config?: CMSAnimationConfig): MotionVariants | null {
  if (!config || config.type === 'none' || !config.type) return null;

  // Check if animations are globally disabled via CSS var
  const enabled = getComputedStyle(document.documentElement)
    .getPropertyValue('--animations-enabled').trim();
  if (enabled === '0') return null;

  const duration = config.duration ?? 0.5;
  const delay = config.delay ?? 0;
  const easing = config.easing ?? 'easeOut';

  const transition = { duration, delay, ease: easing };

  switch (config.type) {
    case 'fade':
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition },
      };

    case 'slide-up':
      return {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition },
      };

    case 'slide-down':
      return {
        hidden: { opacity: 0, y: -40 },
        visible: { opacity: 1, y: 0, transition },
      };

    case 'slide-left':
      return {
        hidden: { opacity: 0, x: 60 },
        visible: { opacity: 1, x: 0, transition },
      };

    case 'slide-right':
      return {
        hidden: { opacity: 0, x: -60 },
        visible: { opacity: 1, x: 0, transition },
      };

    case 'zoom':
      return {
        hidden: { opacity: 0, scale: 0.85 },
        visible: { opacity: 1, scale: 1, transition },
      };

    case 'bounce':
      return {
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1, y: 0,
          transition: { ...transition, type: 'spring', stiffness: 400, damping: 15 },
        },
      };

    default:
      return null;
  }
}

/**
 * Get motion props for a CMS section.
 * Returns { initial, animate, variants, transition } or empty object.
 */
export function getSectionMotionProps(config?: CMSAnimationConfig): Record<string, any> {
  const variants = resolveAnimationVariants(config);
  if (!variants) return {};

  return {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, margin: '-50px' },
    variants,
  };
}

/**
 * Get stagger container props.
 */
export function getStaggerProps(staggerMs: number = 100): Record<string, any> {
  const staggerSec = staggerMs / 1000;
  return {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, margin: '-50px' },
    variants: {
      hidden: {},
      visible: {
        transition: { staggerChildren: staggerSec },
      },
    },
  };
}
