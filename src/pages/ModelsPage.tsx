import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import Header from '../components/Header'
import AnimatedFooter from '../components/AnimatedFooter'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'

export interface Model {
	id: string
	name: string
	descriptionKey: string
	icon: string
	category: string
	featureKeys: string[]
	pricing: {
		starter: string
		pro: string
		enterprise: string
	}
	metrics: {
		latency: string
		availability: string
		tokens?: string
		resolution?: string
		languages?: string
	}
}

export default function ModelsPage() {
	const { isDarkTheme } = useApp()
	const { t } = useLanguage()
	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()
	const [selectedCategory, setSelectedCategory] = useState(() => {
		const category = searchParams.get('category')
		return category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All'
	})
	const [searchQuery, setSearchQuery] = useState('')
	const [sortBy, setSortBy] = useState('popular')

	const categories = ['All', t('language'), t('image'), t('speech')]

	const getModels = (t: (key: string) => string): Model[] => [
		{
			id: 'gpt4',
			name: 'GPT-4',
			descriptionKey: 'gpt4_desc',
			icon: '🤖',
			category: t('language'),
			featureKeys: ['feature_natural_language', 'feature_content_generation', 'feature_code_assistance'],
			pricing: {
				starter: '$10/mo',
				pro: '$50/mo',
				enterprise: t('custom'),
			},
			metrics: {
				latency: '~1s',
				availability: '99.9%',
				tokens: t('up_to') + ' 8k ' + t('tokens'),
			},
		},
		{
			id: 'dalle3',
			name: 'DALL-E 3',
			descriptionKey: 'dalle3_desc',
			icon: '🎨',
			category: t('image'),
			featureKeys: ['feature_text_to_image', 'feature_image_editing', 'feature_style_transfer'],
			pricing: {
				starter: '$15/mo',
				pro: '$75/mo',
				enterprise: t('custom'),
			},
			metrics: {
				latency: '~3s',
				availability: '99.9%',
				resolution: t('up_to') + ' 1024x1024',
			},
		},
		{
			id: 'whisper',
			name: 'Whisper',
			descriptionKey: 'whisper_desc',
			icon: '🎤',
			category: t('speech'),
			featureKeys: ['feature_speech_to_text', 'feature_language_detection', 'feature_accent_handling'],
			pricing: {
				starter: '$5/mo',
				pro: '$25/mo',
				enterprise: t('custom'),
			},
			metrics: {
				latency: '~2s',
				availability: '99.9%',
				languages: '100+ ' + t('supported'),
			},
		},
		{
			id: 'stable-diffusion',
			name: t('stable_diffusion'),
			descriptionKey: 'stable_diffusion_desc',
			icon: '✨',
			category: t('image'),
			featureKeys: ['feature_image_generation', 'feature_inpainting', 'feature_outpainting'],
			pricing: {
				starter: '$12/mo',
				pro: '$60/mo',
				enterprise: t('custom'),
			},
			metrics: {
				latency: '~4s',
				availability: '99.9%',
				resolution: t('up_to') + ' 2048x2048',
			},
		},
		{
			id: 'claude',
			name: 'Claude',
			descriptionKey: 'claude_desc',
			icon: '🧠',
			category: t('language'),
			featureKeys: ['feature_task_assistance', 'feature_research', 'feature_analysis'],
			pricing: {
				starter: '$8/mo',
				pro: '$40/mo',
				enterprise: t('custom'),
			},
			metrics: {
				latency: '~1s',
				availability: '99.9%',
				tokens: t('up_to') + ' 100k ' + t('tokens'),
			},
		},
		{
			id: 'llama',
			name: 'LLaMA',
			descriptionKey: 'llama_desc',
			icon: '🦙',
			category: t('language'),
			featureKeys: ['feature_text_generation', 'feature_translation', 'feature_classification'],
			pricing: {
				starter: 'Free',
				pro: '$30/mo',
				enterprise: t('custom'),
			},
			metrics: {
				latency: '~2s',
				availability: '99.9%',
				tokens: t('up_to') + ' 4k ' + t('tokens'),
			},
		},
	]

	const models = getModels(t)

	useEffect(() => {
		const category = searchParams.get('category')
		if (category) {
			// Capitalize first letter to match our category format
			const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1)
			if (categories.includes(formattedCategory)) {
				setSelectedCategory(formattedCategory)
			}
		}
	}, [searchParams])

	const filteredModels = models
		.filter((model) => 
			selectedCategory === 'All' || model.category === selectedCategory)
		.filter((model) => 
			searchQuery === '' || 
			model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			model.descriptionKey.toLowerCase().includes(searchQuery.toLowerCase()))
		.sort((a, b) => {
			switch (sortBy) {
				case 'name':
					return a.name.localeCompare(b.name)
				case 'newest':
					// For demo purposes, we'll just reverse the order
					return -1
				default: // 'popular'
					return 0
			}
		})

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category)
		if (category === 'All') {
			setSearchParams({})
		} else {
			setSearchParams({ category: category.toLowerCase() })
		}
	}

	const handleModelClick = (modelId: string) => {
		navigate(`/models/${modelId}`)
	}

	return (
		<div className="min-h-screen bg-theme-gradient">
			<Header variant="models" />
			<div className="pt-32 pb-20">
				<div className="container mx-auto px-4">
					{/* Header */}
					<div className="mb-12">
						<h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
							{t('models_title')}
						</h1>
						<p className="text-violet-200 text-lg">
							{t('models_subtitle')}
						</p>
					</div>

					{/* Filters */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
						<div>
							<label className="block text-sm font-medium text-violet-200 mb-2">
								{t('category')}
							</label>
							<select
								value={selectedCategory}
								onChange={(e) => handleCategoryChange(e.target.value)}
								className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-violet-400/30 text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
							>
								{categories.map((category) => (
									<option
										key={category}
										value={category}
										className="bg-gray-800"
									>
										{category}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-violet-200 mb-2">
								{t('search_models')}
							</label>
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-violet-400/30 text-white placeholder-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
								placeholder={t('search_models')}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-violet-200 mb-2">
								{t('sort_by')}
							</label>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-violet-400/30 text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
							>
								<option value="popular" className="bg-gray-800">
									{t('sort_popular')}
								</option>
								<option value="newest" className="bg-gray-800">
									{t('sort_newest')}
								</option>
								<option value="name" className="bg-gray-800">
									{t('sort_name')}
								</option>
							</select>
						</div>
					</div>

					{/* Models Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{filteredModels.map((model, index) => (
							<motion.div
								key={model.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(123, 43, 249, 0.2)' }}
								className={`group ${isDarkTheme ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-white/5 to-white/10'} backdrop-blur-sm rounded-xl p-6 cursor-pointer transition-all hover:bg-opacity-10 border border-violet-400/10 hover:border-violet-400/20`}
								onClick={() => handleModelClick(model.id)}
							>
								<div className="flex items-center mb-6">
									<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-[2px] mr-4 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-pink-500/30">
										<div className="w-full h-full rounded-2xl bg-[var(--theme-background)] flex items-center justify-center">
											<span className="text-3xl">{model.icon}</span>
										</div>
									</div>
									<div>
										<h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-2">{model.name}</h2>
										<span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-pink-500/30 transition-all duration-300">{model.category}</span>
									</div>
								</div>
								<p className="text-violet-200 text-sm mb-6">{t(model.descriptionKey)}</p>

								{/* Features */}
								<div className="mb-6">
									<h3 className="text-sm font-semibold text-white mb-2">
										{t('model_card_features')}
									</h3>
									<ul className="space-y-2">
										{model.featureKeys.map((featureKey, index) => (
											<li
												key={index}
												className="text-sm text-violet-200 flex items-center"
											>
												<span className="mr-2">•</span>
												{t(featureKey)}
											</li>
										))}
									</ul>
								</div>

								{/* Metrics */}
								<div className="mb-6">
									<h3 className="text-sm font-semibold text-white mb-2">
										{t('model_card_metrics')}
									</h3>
									<div className="grid grid-cols-2 gap-4">
										{Object.entries(model.metrics).map(([key, value]) => (
											<div key={key}>
												<div className="text-xs text-violet-300 mb-1">
													{t(`model_card_${key}`)}
												</div>
												<div className="text-sm text-white">{value}</div>
											</div>
										))}
									</div>
								</div>

								{/* Pricing */}
								<div>
									<h3 className="text-sm font-semibold text-white mb-2">
										{t('model_card_pricing')}
									</h3>
									<div className="grid grid-cols-3 gap-2">
										{Object.entries(model.pricing).map(([tier, price]) => (
											<div key={tier} className="text-center">
												<div className="text-xs text-violet-300 mb-1">
													{t(`model_card_${tier}`)}
												</div>
												<div className="text-sm text-white">{price}</div>
											</div>
										))}
									</div>
								</div>

								{/* Learn More Button */}
								<motion.div 
									className="mt-6 text-center"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.2 }}
								>
									<button
										className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-medium transition-all hover:from-purple-600 hover:to-pink-600 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 group-hover:shadow-pink-500/30"
									>
										{t('model_card_learn_more')}
									</button>
								</motion.div>
							</motion.div>
						))}
					</div>

					{/* Empty State */}
					{filteredModels.length === 0 && (
						<div className="text-center py-12">
							<p className="text-violet-200">
								{t('no_models_found')}
							</p>
						</div>
					)}
				</div>
			</div>
			<AnimatedFooter />
		</div>
	)
}