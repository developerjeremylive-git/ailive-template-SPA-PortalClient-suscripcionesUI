import React from 'react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiStar, FiUser } from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'

const testimonials = [
	{
		id: 1,
		nameKey: 'testimonial_1_name',
		roleKey: 'testimonial_1_role',
		company: 'TechCorp Solutions',
		image: '/avatars/sarah.jpg',
		rating: 5,
		textKey: 'testimonial_1_text',
		dashboardType: 'analytics',
		metrics: {
			accuracy: '98.5%',
			responseTime: '150ms',
			uptime: '99.99%',
		},
		iconColor: 'bg-purple-500',
	},
	{
		id: 2,
		nameKey: 'testimonial_2_name',
		roleKey: 'testimonial_2_role',
		company: 'InnovateTech',
		image: '/avatars/michael.jpg',
		rating: 5,
		textKey: 'testimonial_2_text',
		dashboardType: 'models',
		metrics: {
			modelsDeployed: 12,
			averageLatency: '120ms',
			successRate: '99.5%',
		},
		iconColor: 'bg-blue-500',
	},
	{
		id: 3,
		nameKey: 'testimonial_3_name',
		roleKey: 'testimonial_3_role',
		company: 'DataDrive AI',
		image: '/avatars/emily.jpg',
		rating: 5,
		textKey: 'testimonial_3_text',
		dashboardType: 'performance',
		metrics: {
			throughput: '1.2M req/day',
			errorRate: '0.01%',
			costSavings: '45%',
		},
		iconColor: 'bg-green-500',
	},
	{
		id: 4,
		nameKey: 'testimonial_4_name',
		roleKey: 'testimonial_4_role',
		company: 'AI Solutions Co',
		image: '/avatars/david.jpg',
		rating: 5,
		textKey: 'testimonial_4_text',
		dashboardType: 'analytics',
		metrics: {
			timeToMarket: '-40%',
			userSatisfaction: '95%',
			roi: '280%',
		},
		iconColor: 'bg-indigo-500',
	},
	{
		id: 5,
		nameKey: 'testimonial_5_name',
		roleKey: 'testimonial_5_role',
		company: 'Neural Systems',
		image: '/avatars/lisa.jpg',
		rating: 5,
		textKey: 'testimonial_5_text',
		dashboardType: 'performance',
		metrics: {
			modelAccuracy: '96.8%',
			inferenceSpeed: '90ms',
			costReduction: '35%',
		},
		iconColor: 'bg-pink-500',
	},
	{
		id: 6,
		nameKey: 'testimonial_6_name',
		roleKey: 'testimonial_6_role',
		company: 'CloudTech AI',
		image: '/avatars/alex.jpg',
		rating: 5,
		textKey: 'testimonial_6_text',
		dashboardType: 'models',
		metrics: {
			apiUptime: '99.99%',
			integrationTime: '-60%',
			supportResponse: '< 1hr',
		},
		iconColor: 'bg-yellow-500',
	}
]

export default function TestimonialsSection() {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [selectedTestimonial, setSelectedTestimonial] = useState<typeof testimonials[0] | null>(null)
	const { isDarkTheme } = useApp()
	const { t } = useLanguage()

	const nextTestimonial = () => {
		const nextIndex = (currentIndex + 1) % testimonials.length
		
		// Si quedarían menos de 3 cartas visibles
		if (testimonials.length - nextIndex < 3) {
			// Reiniciar al principio
			setCurrentIndex(0)
		} else {
			setCurrentIndex(nextIndex)
		}
	}

	const prevTestimonial = () => {
		// Si estamos en el inicio (mostrando las primeras 3 cartas)
		if (currentIndex === 0) {
			// Calculamos el índice para mostrar las últimas 3 cartas
			const lastGroupIndex = Math.max(0, testimonials.length - 3)
			setCurrentIndex(lastGroupIndex)
		} else {
			setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
		}
	}

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prev) => {
				// Calculamos el siguiente índice
				const nextIndex = (prev + 1) % testimonials.length
				
				// Si quedan menos de 3 cartas por mostrar al final
				if (testimonials.length - nextIndex < 3) {
					// Volvemos al inicio suavemente
					setTimeout(() => {
						setCurrentIndex(0)
					}, 700)
					return prev
				}
				
				return nextIndex
			})
		}, 5000)

		return () => clearInterval(interval)
	}, [])

	return (
		<section className="py-32 relative">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						{t('trusted_title')}
					</h2>
					<p className="text-violet-200 text-lg max-w-2xl mx-auto">
						{t('trusted_description')}
					</p>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
					<div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} bg-opacity-5 backdrop-blur-sm rounded-xl p-6 text-center`}>
						<div className="text-3xl font-bold text-white mb-2">
							{t('trusted_card_1_title')}
						</div>
						<div className="text-violet-200">
							{t('trusted_card_1_desc')}
						</div>
					</div>
					<div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} bg-opacity-5 backdrop-blur-sm rounded-xl p-6 text-center`}>
						<div className="text-3xl font-bold text-white mb-2">
							{t('trusted_card_2_title')}
						</div>
						<div className="text-violet-200">
							{t('trusted_card_2_desc')}
						</div>
					</div>
					<div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} bg-opacity-5 backdrop-blur-sm rounded-xl p-6 text-center`}>
						<div className="text-3xl font-bold text-white mb-2">
							{t('trusted_card_3_title')}
						</div>
						<div className="text-violet-200">
							{t('trusted_card_3_desc')}
						</div>
					</div>
				</div>

				{/* Testimonials Carousel */}
				<div className="relative max-w-7xl mx-auto mb-32 px-12">
					<div className="overflow-hidden">
						<motion.div
							className="flex"
							animate={{
								x: `-${currentIndex * 33.33}%`
							}}
							transition={{
								duration: 0.7,
								ease: "easeInOut"
							}}
						>
							{testimonials.map((testimonial, index) => (
								<motion.div
									key={testimonial.id}
									className="w-1/3 flex-shrink-0 px-4"
									initial={{ opacity: 0 }}
									animate={{
										opacity: Math.abs(currentIndex - index) < 3 ? 1 : 0.3,
										scale: Math.abs(currentIndex - index) < 3 ? 1 : 0.95,
									}}
									transition={{ duration: 0.5 }}
								>
									<div
										onClick={() => setSelectedTestimonial(testimonial)}
										className={`${
											isDarkTheme ? 'bg-gray-800' : 'bg-white'
										} bg-opacity-5 backdrop-blur-sm rounded-2xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-opacity-10 h-[32rem] flex flex-col`}
									>
										<div className="flex items-center mb-6">
											<div className="relative">
												<div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
													<FiUser className="w-8 h-8 text-gray-500" />
												</div>
												<div className={`absolute -bottom-2 -right-2 ${testimonial.iconColor} rounded-full p-2`}>
													<FiStar className="w-4 h-4 text-white" />
												</div>
											</div>
											<div className="ml-4">
												<h3 className="text-xl font-semibold text-white">
													{t(testimonial.nameKey)}
												</h3>
												<p className="text-violet-200">
													{t(testimonial.roleKey)} at {testimonial.company}
												</p>
											</div>
										</div>
										<div className="flex mb-4">
											{[...Array(testimonial.rating)].map((_, i) => (
												<FiStar
													key={i}
													className="w-5 h-5 text-yellow-400 fill-current"
												/>
											))}
										</div>
										<p className="text-violet-200 mb-4 line-clamp-3 flex-grow">{t(testimonial.textKey)}</p>
										<div className="grid grid-cols-3 gap-2 mt-auto">
											{Object.entries(testimonial.metrics).map(([key, value]) => (
												<div
													key={key}
													className="bg-purple-500 bg-opacity-20 rounded-lg p-2 text-center"
												>
													<div className="text-white font-semibold text-sm">
														{value}
													</div>
													<div className="text-violet-200 text-xs">
														{t(`metric_${key.toLowerCase()}`)}
													</div>
												</div>
											))}
										</div>
									</div>
								</motion.div>
							))}
						</motion.div>
					</div>

					<button
						onClick={prevTestimonial}
						className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full p-4 text-white hover:from-purple-600 hover:to-violet-600 transition-all shadow-lg"
						aria-label={t('carousel_prev')}
					>
						<FiChevronLeft className="w-6 h-6" />
					</button>
					<button
						onClick={nextTestimonial}
						className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full p-4 text-white hover:from-purple-600 hover:to-violet-600 transition-all shadow-lg"
						aria-label={t('carousel_next')}
					>
						<FiChevronRight className="w-6 h-6" />
					</button>
				</div>
			</div>

			{/* Detailed Testimonial Modal */}
			<AnimatePresence>
				{selectedTestimonial && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-md z-50 flex items-center justify-center p-4"
						onClick={() => setSelectedTestimonial(null)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className={`${
								isDarkTheme ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-900 to-violet-800'
							} rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-500/20`}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-center justify-between mb-8 border-b border-purple-500/20 pb-6">
								<div className="flex items-center">
									<div className="relative">
										<div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
											<FiUser className="w-12 h-12 text-gray-500" />
										</div>
										<div className={`absolute -bottom-2 -right-2 ${selectedTestimonial.iconColor} rounded-full p-2`}>
											<FiStar className="w-4 h-4 text-white" />
										</div>
									</div>
									<div className="ml-6">
										<h3 className="text-3xl font-bold text-white mb-2">
											{t(selectedTestimonial.nameKey)}
										</h3>
										<p className="text-violet-200 text-lg">
											{t(selectedTestimonial.roleKey)} at {selectedTestimonial.company}
										</p>
									</div>
								</div>
								<div className="flex gap-1">
									{[...Array(selectedTestimonial.rating)].map((_, i) => (
										<FiStar
											key={i}
											className="w-6 h-6 text-yellow-400 fill-current"
										/>
									))}
								</div>
							</div>

							<div className="mb-8 bg-purple-500/10 rounded-xl p-6">
								<p className="text-lg text-violet-200 leading-relaxed italic">
									"{t(selectedTestimonial.textKey)}"
								</p>
							</div>

							<div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-purple-800'} bg-opacity-50 rounded-xl p-6 mb-8`}>
								<h4 className="text-xl font-semibold text-white mb-4 flex items-center">
									<span className="mr-2">📊</span> {t('testimonial_metrics')}
								</h4>
								<div className="grid grid-cols-3 gap-6">
									{Object.entries(selectedTestimonial.metrics).map(
										([key, value]) => (
											<div key={key} className="text-center transform hover:scale-105 transition-all duration-300">
												<div className="text-2xl font-bold text-purple-300 mb-2">
													{value}
												</div>
												<div className="text-violet-200">
													{t(`metric_${key.toLowerCase()}`)}
												</div>
											</div>
										)
									)}
								</div>
							</div>

							<div className="text-center">
								<button
									onClick={() => setSelectedTestimonial(null)}
									className="px-8 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-full hover:from-purple-600 hover:to-violet-600 transition-all transform hover:scale-105 font-semibold shadow-lg"
								>
									{t('testimonial_close')}
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	)
} 