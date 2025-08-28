'use client';
import { motion } from 'framer-motion';

export default function Section({ title, subtitle, children }:{title:string, subtitle?:string, children: React.ReactNode}){
  return (
    <motion.section
      initial={{opacity:0, y:10}}
      animate={{opacity:1, y:0}}
      transition={{duration: .35}}
      className="card"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-white/60 mt-1">{subtitle}</p>}
      </div>
      {children}
    </motion.section>
  )
}
