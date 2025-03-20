import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import Header from '../components/Header'
import AnimatedFooter from '../components/AnimatedFooter'

export default function TermsPage() {
	const { t } = useLanguage()
	const [activeTab, setActiveTab] = useState('usage-terms')

	useEffect(() => {
		// Update active tab based on URL hash
		const hash = window.location.hash.slice(1)
		if (hash) {
			setActiveTab(hash)
		}
	}, [])

	const handleTabClick = (tab: string) => {
		setActiveTab(tab)
		const element = document.getElementById(tab)
		// element?.scrollIntoView({ behavior: 'smooth' })
		// window.history.pushState(null, '', `#${tab}`)
	}

	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex-grow bg-theme-gradient py-32">
				<div className="container mx-auto px-4">
					<div className="max-w-5xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-8"
						>
							<h1 className="text-4xl font-bold text-white mb-8 tracking-tight">
								{t('terms_title')}
							</h1>
							<div className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg w-fit mb-8 transition-all duration-300 hover:bg-opacity-15">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<p className="text-violet-200 font-medium">
									<span className="text-violet-400">{t('terms_last_updated')}:</span> January 1, 2024
								</p>
							</div>

							<div className="space-y-4 mb-8">
								<div className="flex items-center space-x-2 px-4 py-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg transition-all duration-300 hover:bg-opacity-15 border border-violet-500/10 hover:border-violet-500/20">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<p className="text-violet-200">{t('terms_intro')}</p>
								</div>
								<div className="flex items-center space-x-2 px-4 py-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg transition-all duration-300 hover:bg-opacity-15 border border-violet-500/10 hover:border-violet-500/20">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<p className="text-violet-200">{t('terms_acceptance')}</p>
								</div>
							</div>

							{/* Table of Contents */}
							<nav className="mb-8 w-full flex justify-center">
								<div className="max-w-4xl w-full bg-gradient-to-r from-purple-500/10 to-violet-500/10 dark:from-purple-900/20 dark:to-violet-900/20 backdrop-blur-sm rounded-xl shadow-lg p-6">
									<div className="flex flex-wrap justify-center gap-4 px-2">
										{['usage-terms', 'user-responsibilities', 'service-limitations', 'intellectual-property', 'privacy-data'].map((tab, index) => (
											<button
												key={tab}
												onClick={() => handleTabClick(tab)}
												className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md
													${activeTab === tab
														? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg ring-2 ring-purple-500/50'
														: 'bg-white/5 text-violet-200 hover:bg-white/10 hover:text-white'}`}
											>
												{t(`terms_section_${index + 1}`)}
											</button>
										))}
									</div>
								</div>
							</nav>

							{/* Content Sections */}
							<div className="relative overflow-hidden">
								<div className="absolute top-0 left-0 right-0 h-1 bg-white/10 rounded-full overflow-hidden">
									<motion.div
										className="h-full bg-gradient-to-r from-purple-500 to-violet-500"
										animate={{
											width: `${((['usage-terms', 'user-responsibilities', 'service-limitations', 'intellectual-property', 'privacy-data'].indexOf(activeTab) + 1) * 20)}%`
										}}
										transition={{ type: "spring", stiffness: 300, damping: 30 }}
									/>
								</div>

								{/* Section Navigation */}
								<div className="flex justify-between mb-6 px-4">
									<button
										onClick={() => {
											const currentIndex = ['usage-terms', 'user-responsibilities', 'service-limitations', 'intellectual-property', 'privacy-data'].indexOf(activeTab);
											if (currentIndex > 0) {
												handleTabClick(['usage-terms', 'user-responsibilities', 'service-limitations', 'intellectual-property', 'privacy-data'][currentIndex - 1]);
											}
										}}
										className={`p-2 rounded-lg transition-all duration-300 ${['usage-terms'].includes(activeTab) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
										disabled={['usage-terms'].includes(activeTab)}
									>
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
										</svg>
									</button>
									<button
										onClick={() => {
											const currentIndex = ['usage-terms', 'user-responsibilities', 'service-limitations', 'intellectual-property', 'privacy-data'].indexOf(activeTab);
											if (currentIndex < 4) {
												handleTabClick(['usage-terms', 'user-responsibilities', 'service-limitations', 'intellectual-property', 'privacy-data'][currentIndex + 1]);
											}
										}}
										className={`p-2 rounded-lg transition-all duration-300 ${['privacy-data'].includes(activeTab) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
										disabled={['privacy-data'].includes(activeTab)}
									>
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
										</svg>
									</button>
								</div>

								<motion.div
									className="flex"
									animate={{
										x: -document.getElementById(activeTab)?.offsetLeft || 0
									}}
									transition={{ type: "spring", stiffness: 300, damping: 30 }}
								>
									<section id="usage-terms" className="w-full flex-shrink-0 mb-12 px-4">
										<h2 className="text-2xl font-semibold text-white mb-6">
											{t('terms_section_1')}
										</h2>
										<ul className="space-y-4 text-violet-200 list-disc pl-5">
											<li>{t('terms_usage_1')}</li>
											<li>{t('terms_usage_2')}</li>
											<li>{t('terms_usage_3')}</li>
											<li>{t('terms_usage_4')}</li>
										</ul>
									</section>

									<section id="user-responsibilities" className="w-full flex-shrink-0 mb-12 px-4">
										<h2 className="text-2xl font-semibold text-white mb-6">
											{t('terms_section_2')}
										</h2>
										<ul className="space-y-4 text-violet-200 list-disc pl-5">
											<li>{t('terms_responsibility_1')}</li>
											<li>{t('terms_responsibility_2')}</li>
											<li>{t('terms_responsibility_3')}</li>
											<li>{t('terms_responsibility_4')}</li>
										</ul>
									</section>

									<section id="service-limitations" className="w-full flex-shrink-0 mb-12 px-4">
										<h2 className="text-2xl font-semibold text-white mb-6">
											{t('terms_section_3')}
										</h2>
										<ul className="space-y-4 text-violet-200 list-disc pl-5">
											<li>{t('terms_limitation_1')}</li>
											<li>{t('terms_limitation_2')}</li>
											<li>{t('terms_limitation_3')}</li>
											<li>{t('terms_limitation_4')}</li>
										</ul>
									</section>

									<section id="intellectual-property" className="w-full flex-shrink-0 mb-12 px-4">
										<h2 className="text-2xl font-semibold text-white mb-6">
											{t('terms_section_4')}
										</h2>
										<ul className="space-y-4 text-violet-200 list-disc pl-5">
											<li>{t('terms_intellectual_1')}</li>
											<li>{t('terms_intellectual_2')}</li>
											<li>{t('terms_intellectual_3')}</li>
											<li>{t('terms_intellectual_4')}</li>
										</ul>
									</section>

									<section id="privacy-data" className="w-full flex-shrink-0 px-4">
										<h2 className="text-2xl font-semibold text-white mb-6">
											{t('terms_section_5')}
										</h2>
										<ul className="space-y-4 text-violet-200 list-disc pl-5">
											<li>{t('terms_privacy_1')}</li>
											<li>{t('terms_privacy_2')}</li>
											<li>{t('terms_privacy_3')}</li>
											<li>{t('terms_privacy_4')}</li>
										</ul>
									</section>
								</motion.div>
							</div>
						</motion.div>
					</div>
				</div>
			</main>
			<AnimatedFooter />
		</div>
	)
}
