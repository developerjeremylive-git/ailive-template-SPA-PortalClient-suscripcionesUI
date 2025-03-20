import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'

interface ExploreModelsPopupProps {
	isOpen: boolean
	onClose: () => void
}

const models = [
	{
		id: 'gpt4',
		name: 'GPT-4',
		descKey: 'gpt4_desc',
		icon: '🤖',
		category: 'Language',
		features: ['feature_natural_language', 'feature_content_generation', 'feature_code_assistance'],
	},
	{
		id: 'dalle3',
		name: 'DALL-E 3',
		descKey: 'dalle3_desc',
		icon: '🎨',
		category: 'Image',
		features: ['feature_text_to_image', 'feature_image_editing', 'feature_style_transfer'],
	},
	{
		id: 'whisper',
		name: 'Whisper',
		descKey: 'whisper_desc',
		icon: '🎤',
		category: 'Speech',
		features: ['feature_speech_to_text', 'feature_language_detection', 'feature_accent_handling'],
	},
	{
		id: 'stable-diffusion',
		name: 'Stable Diffusion',
		descKey: 'stable_diffusion_xl_desc',
		icon: '✨',
		category: 'Image',
		features: ['feature_image_generation', 'feature_inpainting', 'feature_outpainting'],
	},
	{
		id: 'claude',
		name: 'Claude',
		descKey: 'claude_desc',
		icon: '🧠',
		category: 'Language',
		features: ['feature_task_assistance', 'feature_research', 'feature_analysis'],
	},
	{
		id: 'llama',
		name: 'LLaMA',
		descKey: 'llama_desc',
		icon: '🦙',
		category: 'Language',
		features: ['feature_text_generation', 'feature_translation', 'feature_classification'],
	},
]

export default function ExploreModelsPopup({ isOpen, onClose }: ExploreModelsPopupProps) {
	const navigate = useNavigate()
	const { isDarkTheme } = useApp()
	const { t } = useLanguage()

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className={`w-full max-w-6xl transform overflow-hidden rounded-2xl ${
								isDarkTheme 
									? 'bg-gradient-to-br from-gray-900 to-gray-800' 
									: 'bg-gradient-to-br from-purple-900 to-violet-900'
							} p-8 shadow-xl transition-all`}>
								<div className="flex justify-between items-center mb-8">
									<Dialog.Title as="h3" className="text-3xl font-bold text-white">
										{t('explore_models_title')}
									</Dialog.Title>
									<button
										onClick={onClose}
										className="text-violet-200 hover:text-white transition-colors"
									>
										<XMarkIcon className="h-6 w-6" />
									</button>
								</div>

								<p className="text-violet-200 mb-8">
									{t('explore_models_desc')}
								</p>

								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{models.map((model) => (
										<motion.div
											key={model.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											whileHover={{ scale: 1.05 }}
											className={`${isDarkTheme ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-white/5 to-white/10'} backdrop-blur-sm rounded-xl p-6 cursor-pointer transition-all hover:bg-opacity-10 border border-violet-400/10 hover:border-violet-400/20`}
											onClick={() => {
												onClose()
												navigate(`/models/${model.id}`)
											}}
										>
											<div className="text-4xl mb-4">{model.icon}</div>
											<h4 className="text-xl font-semibold text-white mb-2">
												{model.name}
											</h4>
											<p className="text-violet-200 text-sm mb-4">
												{t(model.descKey)}
											</p>
											<div className="mb-4">
												<span className="inline-block px-3 py-1 rounded-full text-xs bg-purple-500 text-white">
													{t(`${model.category.toLowerCase()}_models`)}
												</span>
											</div>
											<ul className="space-y-2">
												{model.features.map((feature, index) => (
													<li
														key={index}
														className="text-sm text-violet-200 flex items-center"
													>
														<span className="mr-2">•</span>
														{t(feature)}
													</li>
												))}
											</ul>
											<div className="mt-4">
												<span className="text-purple-300 hover:text-white transition-colors">
													{t('model_card_learn_more')} →
												</span>
											</div>
										</motion.div>
									))}
								</div>

								<div className="mt-8 text-center">
									<Link
										to="/models"
										className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold hover:from-purple-600 hover:to-violet-600 transition-all"
										onClick={onClose}
									>
										{t('view_details')}
									</Link>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}