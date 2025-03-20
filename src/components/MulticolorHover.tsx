import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface MulticolorHoverProps {
    children: ReactNode
    className?: string
}

export default function MulticolorHover({ children, className = '' }: MulticolorHoverProps) {
    return (
        <motion.div
            className={`group relative inline-block ${className}`}
            whileHover={{ scale: 1.01 }}
        >
            {/* Hover Effect */}
            <div className="absolute -inset-1 rounded-md opacity-0 group-hover:opacity-40 transition-all duration-300 blur-[0.5px] bg-gradient-to-r from-violet-400 via-purple-500 to-violet-600" />

            {/* Content */}
            <div className="relative">{children}</div>

            {/* Subtle Glow */}
            <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-15 transition-opacity duration-300 bg-white" />
        </motion.div>
    )
} 