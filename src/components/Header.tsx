import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { WiSnow } from 'react-icons/wi'
import { FiSlash, FiShare2, FiSettings, FiUser } from 'react-icons/fi'
import { RiSunLine, RiMoonClearLine } from 'react-icons/ri'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import UserProfile from './UserProfile'
import AuthButton from './AuthButton'
import AuthPopup from './AuthPopup'

interface HeaderProps {
	variant?: 'default' | 'docs' | 'models'
}

interface Snowflake {
	id: number
	x: number
	y: number
	size: number
	speed: number
}

export default function Header({ variant = 'default' }: HeaderProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)
	const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])
	const settingsRef = useRef<HTMLDivElement>(null)
	const {
		isDarkTheme,
		isSnowEnabled,
		isGraphEnabled,
		toggleTheme,
		toggleSnow,
		toggleGraph,
		toggleBackgroundTheme
	} = useApp()
	const { currentLanguage, setLanguage, t } = useLanguage()
	const { user, isLoginOpen, setIsLoginOpen } = useAuth()
	const location = useLocation()

	useEffect(() => {
		if (!isSnowEnabled) {
			setSnowflakes([])
			return
		}

		// Create initial snowflakes
		const initialSnowflakes = Array.from({ length: 50 }, (_, i) => ({
			id: i,
			x: Math.random() * window.innerWidth,
			y: Math.random() * window.innerHeight,
			size: Math.random() * 4 + 1,
			speed: Math.random() * 2 + 1,
		}))
		setSnowflakes(initialSnowflakes)

		// Animation loop
		const animateSnow = () => {
			setSnowflakes((prev) =>
				prev.map((flake) => ({
					...flake,
					y: flake.y + flake.speed,
					x: flake.x + Math.sin(flake.y * 0.01) * 0.5,
					...(flake.y > window.innerHeight && {
						y: -10,
						x: Math.random() * window.innerWidth,
					}),
				}))
			)
		}

		const interval = setInterval(animateSnow, 50)
		return () => clearInterval(interval)
	}, [isSnowEnabled])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
				setIsSettingsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const getTitle = () => {
		return 'AILive'
	}

	const headerVariants = {
		hidden: { y: -100, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 20,
				duration: 0.5,
			},
		},
	}

	const settingsPopupVariants = {
		hidden: { opacity: 0, scale: 0.95, y: -20 },
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: {
				type: 'spring',
				stiffness: 300,
				damping: 30,
			},
		},
		exit: {
			opacity: 0,
			scale: 0.95,
			y: -20,
			transition: {
				duration: 0.2,
			},
		},
	}

	return (
		<>
			{/* Snow Animation */}
			{isSnowEnabled && (
				<div className="fixed inset-0 pointer-events-none z-40">
					{snowflakes.map((flake) => (
						<motion.div
							key={flake.id}
							className="absolute bg-white rounded-full opacity-60"
							animate={{
								x: flake.x,
								y: flake.y,
							}}
							transition={{
								duration: 0.05,
								ease: 'linear',
							}}
							style={{
								width: flake.size,
								height: flake.size,
							}}
						/>
					))}
				</div>
			)}

			<motion.header
				initial="hidden"
				animate="visible"
				variants={headerVariants}
				className={`fixed top-0 w-full backdrop-blur-sm z-50 ${isDarkTheme ? 'bg-[var(--theme-background)]' : 'bg-[var(--theme-background)]'}`}
			>
				<div className="container mx-auto px-4 py-4">
					<div className="flex justify-between items-center">
						<Link
							to="/"
							className="flex items-center gap-3 text-3xl font-extrabold text-[var(--theme-text-primary)] transition-all duration-300 hover:scale-105"
						>
							<div className="w-11 h-11 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-[2px] shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-pink-500/30">
								<div className="w-full h-full rounded-xl bg-[var(--theme-background)] flex items-center justify-center">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										className="w-7 h-7"
									>
										<path
											d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
											className="fill-purple-500"
										/>
										<path
											d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
											className="fill-pink-500"
										/>
									</svg>
								</div>
							</div>
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 transition-all duration-300">
								{getTitle()}
							</span>
						</Link>

						<div className="flex items-center space-x-6">
							{/* Language Switcher */}
							<div className="flex items-center space-x-3">
								<button
									onClick={() => setLanguage('en')}
									className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-110 ${
										currentLanguage === 'en'
											? 'border-purple-500 shadow-lg shadow-purple-500/30 scale-110'
											: 'border-transparent hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20'
									}`}
									aria-label="Switch to English"
								>
									<img
										src="https://flagcdn.com/w40/us.png"
										alt="USA Flag"
										className="w-full h-full object-cover"
									/>
								</button>
								<button
									onClick={() => setLanguage('es')}
									className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-110 ${
										currentLanguage === 'es'
											? 'border-purple-500 shadow-lg shadow-purple-500/30 scale-110'
											: 'border-transparent hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20'
									}`}
									aria-label="Cambiar a Español"
								>
									<img
										src="https://flagcdn.com/w40/cr.png"
										alt="Costa Rica Flag"
										className="w-full h-full object-cover"
									/>
								</button>
							</div>

							<nav className="hidden md:flex items-center space-x-6">
								<Link
									to="/models"
									className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 
										${location.pathname === '/models' 
											? 'text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30' 
											: 'text-[var(--theme-text-primary)] hover:text-purple-500 hover:bg-purple-500/10'
										}
										before:absolute before:inset-0 before:rounded-lg before:transition-transform before:duration-300
										hover:transform hover:scale-105`}
								>
									{t('explore_models')}
								</Link>
								<Link
									to="/interactive-demo"
									className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 
										${location.pathname === '/interactive-demo' 
											? 'text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30' 
											: 'text-[var(--theme-text-primary)] hover:text-purple-500 hover:bg-purple-500/10'
										}
										before:absolute before:inset-0 before:rounded-lg before:transition-transform before:duration-300
										hover:transform hover:scale-105`}
								>
									{t('try_demo')}
								</Link>
								<Link
									to="/pricing"
									className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 
										${location.pathname === '/pricing' 
											? 'text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30' 
											: 'text-[var(--theme-text-primary)] hover:text-purple-500 hover:bg-purple-500/10'
										}
										before:absolute before:inset-0 before:rounded-lg before:transition-transform before:duration-300
										hover:transform hover:scale-105`}
								>
									{t('pricing')}
								</Link>
							</nav>

							<div className="flex items-center space-x-3">
								{/* Settings button */}
								<div ref={settingsRef} className="relative">
									<button
										onClick={() => setIsSettingsOpen(!isSettingsOpen)}
										className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-500 hover:from-purple-500/20 hover:to-pink-500/20 hover:scale-110 transform transition-all duration-300"
										aria-label={t('settings')}
									>
										<FiSettings className="w-5 h-5" />
									</button>

									<AnimatePresence>
										{isSettingsOpen && (
											<motion.div
												initial="hidden"
												animate="visible"
												exit="exit"
												variants={settingsPopupVariants}
												className="absolute right-0 mt-3 w-64 rounded-2xl overflow-hidden bg-[var(--theme-background)] border border-purple-500/20 shadow-xl shadow-purple-500/20 z-50"
											>
												{/* Theme Toggle */}
												<motion.button
													onClick={toggleBackgroundTheme}
													className="w-full flex items-center justify-between px-5 py-3 text-sm text-[var(--theme-text-primary)] hover:bg-purple-500/10 transition-all duration-300"
													whileHover={{ x: 4 }}
												>
													<span className="font-medium">{t('theme')}</span>
													{!isDarkTheme ? (
														<RiSunLine className="w-5 h-5 text-amber-500" />
													) : (
														<RiMoonClearLine className="w-5 h-5 text-purple-400" />
													)}
												</motion.button>

												{/* Graph Toggle */}
												<motion.button
													onClick={toggleGraph}
													className="w-full flex items-center justify-between px-5 py-3 text-sm text-[var(--theme-text-primary)] hover:bg-purple-500/10 transition-all duration-300"
													whileHover={{ x: 4 }}
												>
													<span className="font-medium">{t('graph_animation')}</span>
													<div className="relative">
														<FiShare2 className={`w-5 h-5 ${isGraphEnabled ? 'text-green-500' : 'text-red-500'}`} />
														{!isGraphEnabled && (
															<FiSlash className="w-5 h-5 absolute top-0 left-0 text-red-500 animate-pulse" />
														)}
													</div>
												</motion.button>

												{/* Snow Toggle */}
												<motion.button
													onClick={toggleSnow}
													className="w-full flex items-center justify-between px-5 py-3 text-sm text-[var(--theme-text-primary)] hover:bg-purple-500/10 transition-all duration-300"
													whileHover={{ x: 4 }}
												>
													<span className="font-medium">{t('snow_effect')}</span>
													<div className="relative">
														<WiSnow className={`w-6 h-6 ${isSnowEnabled ? 'text-blue-400' : 'text-red-500'}`} />
														{!isSnowEnabled && (
															<FiSlash className="w-5 h-5 absolute top-0 left-0 text-red-500 animate-pulse" />
														)}
													</div>
												</motion.button>
											</motion.div>
										)}
									</AnimatePresence>
								</div>

								{/* Auth Button */}
								<AuthButton variant="header" className="hidden sm:flex" />

								{/* User Profile */}
								{user && (
									<UserProfile />
								)}

								{/* Mobile menu button */}
								<button
									onClick={() => setIsMenuOpen(!isMenuOpen)}
									className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-500 hover:from-purple-500/20 hover:to-pink-500/20 hover:scale-110 transform transition-all duration-300"
									aria-label={isMenuOpen ? t('close_menu') : t('open_menu')}
								>
									<svg
										className="h-5 w-5"
										stroke="currentColor"
										fill="none"
										viewBox="0 0 24 24"
									>
										{isMenuOpen ? (
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M6 18L18 6M6 6l12 12"
											/>
										) : (
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M4 6h16M4 12h16M4 18h16"
											/>
										)}
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Mobile menu */}
				<AnimatePresence>
					{isMenuOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							className="md:hidden border-t border-[var(--border)] bg-[var(--theme-background)] bg-opacity-95 backdrop-blur-lg"
						>
							<div className="px-4 py-3 space-y-2">
								<Link
									to="/models"
									className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-300 
										${location.pathname === '/models' 
											? 'text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30' 
											: 'text-[var(--theme-text-primary)] hover:text-purple-500 hover:bg-purple-500/10'
										}`}
									onClick={() => setIsMenuOpen(false)}
								>
									{t('explore_models')}
								</Link>
								<Link
									to="/interactive-demo"
									className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-300 
										${location.pathname === '/interactive-demo' 
											? 'text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30' 
											: 'text-[var(--theme-text-primary)] hover:text-purple-500 hover:bg-purple-500/10'
										}`}
									onClick={() => setIsMenuOpen(false)}
								>
									{t('try_demo')}
								</Link>
								<Link
									to="/pricing"
									className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-300 
										${location.pathname === '/pricing' 
											? 'text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30' 
											: 'text-[var(--theme-text-primary)] hover:text-purple-500 hover:bg-purple-500/10'
										}`}
									onClick={() => setIsMenuOpen(false)}
								>
									{t('pricing')}
								</Link>

								{/* Add Auth Button for mobile */}
								<div className="px-3 py-2">
									<AuthButton variant="header" className="w-full justify-center" />
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.header>

			<AuthPopup />
		</>
	)
}