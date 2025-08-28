'use client';
import { motion } from 'framer-motion';

export function OutputCard({ children }:{children: React.ReactNode}){
  return (
    <motion.div
      initial={{opacity:0, y:6}}
      animate={{opacity:1, y:0}}
      transition={{duration: .3}}
      className="card"
    >
      {children}
    </motion.div>
  )
}
