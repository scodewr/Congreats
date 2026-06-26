import { motion, useReducedMotion } from 'framer-motion'

interface AnimatedRouteProps {
  children: React.ReactNode
}

export default function AnimatedRoute({ children }: AnimatedRouteProps) {
  const reducedMotion = useReducedMotion()

  const variants = {
    initial: { opacity: 0, x: reducedMotion ? 0 : 24 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: reducedMotion ? 0 : -24 },
  }

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
