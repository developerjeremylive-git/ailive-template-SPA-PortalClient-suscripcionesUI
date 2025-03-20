import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import Header from '../components/Header'
import AnimatedFooter from '../components/AnimatedFooter'

export default function DocsPage() {
	const { t } = useLanguage()

	return (
		<div className="flex flex-col min-h-screen bg-grid-pattern">
			<Header />
			<main className="flex-grow bg-theme-gradient py-32">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-16">
							<h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
								{t('docs_title')}
							</h1>
							<p className="text-lg text-violet-200">{t('docs_subtitle')}</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* Quick Start Guide */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
								className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-8 hover:scale-105 transition-transform duration-200"
							>
								<h2 className="text-2xl font-semibold text-white mb-4">
									{t('quick_start')}
								</h2>
								<ul className="space-y-4">
									<li className="flex items-start text-violet-200">
										<span className="mr-4 text-purple-400">1.</span>
										<span>{t('install_ailive_sdk')}</span>
									</li>
									<li className="flex items-start text-violet-200">
										<span className="mr-4 text-purple-400">2.</span>
										<span>{t('configure_api_key')}</span>
									</li>
									<li className="flex items-start text-violet-200">
										<span className="mr-4 text-purple-400">3.</span>
										<span>{t('make_first_api_call')}</span>
									</li>
								</ul>
							</motion.div>

							{/* API Reference */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
								className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-8 hover:scale-105 transition-transform duration-200"
							>
								<h2 className="text-2xl font-semibold text-white mb-4">
									{t('api_reference')}
								</h2>
								<ul className="space-y-4">
									<li className="flex items-start text-violet-200">
										<span className="mr-4">•</span>
										<span>{t('authentication')}</span>
									</li>
									<li className="flex items-start text-violet-200">
										<span className="mr-4">•</span>
										<span>{t('endpoints')}</span>
									</li>
									<li className="flex items-start text-violet-200">
										<span className="mr-4">•</span>
										<span>{t('response_formats')}</span>
									</li>
								</ul>
							</motion.div>

							{/* Examples */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
								className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-8 hover:scale-105 transition-transform duration-200"
							>
								<h2 className="text-2xl font-semibold text-white mb-4">
									{t('examples')}
								</h2>
								<ul className="space-y-4">
									<li className="flex items-start text-violet-200">
										<span className="mr-4">•</span>
										<span>{t('text_generation')}</span>
									</li>
									<li className="flex items-start text-violet-200">
										<span className="mr-4">•</span>
										<span>{t('image_processing')}</span>
									</li>
									<li className="flex items-start text-violet-200">
										<span className="mr-4">•</span>
										<span>{t('speech_recognition')}</span>
									</li>
								</ul>
							</motion.div>

							{/* Guides */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5 }}
								className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-8 hover:scale-105 transition-transform duration-200"
							>
								<h2 className="text-2xl font-semibold text-white mb-4">
									{t('guides')}
								</h2>
								<ul className="space-y-4">
									<li className="flex items-start text-violet-200">
										<span className="mr-4">•</span>
										<span>{t('best_practices')}</span>
									</li>
									<li className="flex items-start text-violet-200">
										<span className="mr-4">•</span>
										<span>{t('error_handling')}</span>
									</li>
									<li className="flex items-start text-violet-200">
										<span className="mr-4">•</span>
										<span>{t('rate_limiting')}</span>
									</li>
								</ul>
							</motion.div>
						</div>
					</div>
				</div>
			</main>
			<AnimatedFooter />
		</div>
	)
}
