import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function Navigation() {
	const [isScrolled, setIsScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id)
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' })
		}
	}

	return (
		<motion.nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
			}`}
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.6 }}
		>
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-20">
					<div className="flex items-center">
						<Link to="/">
							<motion.div
								className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600"
								whileHover={{ scale: 1.05 }}
							>
								AILive
							</motion.div>
						</Link>
					</div>

					<div className="hidden md:flex items-center space-x-8">
						<NavLink onClick={() => scrollToSection('features')}>Features</NavLink>
						<NavLink onClick={() => scrollToSection('how-it-works')}>How It Works</NavLink>
						<NavLink onClick={() => scrollToSection('dashboard')}>Dashboard</NavLink>
						<button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
							Get Started
						</button>
					</div>

					<button className="md:hidden p-2">
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>
			</div>
		</motion.nav>
	)
}

function NavLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
	return (
		<motion.button
			onClick={onClick}
			className="text-neutral-600 hover:text-neutral-900 transition-colors"
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
		>
			{children}
		</motion.button>
	)
} 