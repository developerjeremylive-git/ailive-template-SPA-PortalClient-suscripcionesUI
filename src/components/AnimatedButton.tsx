import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedButtonProps {
    children: ReactNode
    onClick?: () => void
    className?: string
    type?: 'button' | 'submit' | 'reset'
}

export default function AnimatedButton({
    children,
    onClick,
    className = '',
    type = 'button',
}: AnimatedButtonProps) {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative group ${className}`}
        >
            {/* Animated Border */}
            <div className="absolute -inset-[1px] rounded-md bg-gradient-to-r from-violet-400 via-purple-500 to-violet-600 opacity-70 group-hover:opacity-100 blur-[0.5px] transition-all duration-300" />
            
            {/* Button Content */}
            <div className="relative px-6 py-2.5 rounded-md bg-purple-900 text-white font-medium text-sm">
                {children}
            </div>

            {/* Inner Glow Effect */}
            <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white" />
        </motion.button>
    )
} 