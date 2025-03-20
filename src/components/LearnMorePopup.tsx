import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'

interface LearnMorePopupProps {
	isOpen: boolean
	onClose: () => void
}

const features = [
	{
		id: 'unified-platform',
		titleKey: 'card_performance_title',
		descriptionKey: 'card_performance_desc',
		icon: '🔄',
	},
	{
		id: 'easy-integration',
		titleKey: 'card_security_title',
		descriptionKey: 'card_security_desc',
		icon: '🔌',
	},
	{
		id: 'support',
		titleKey: 'card_support_title',
		descriptionKey: 'card_support_desc',
		icon: '🤝',
	},
]

const stats = [
	{ id: 1, nameKey: 'models_available', value: '50+' },
	{ id: 2, nameKey: 'api_requests_daily', value: '1M+' },
	{ id: 3, nameKey: 'enterprise_clients', value: '500+' },
	{ id: 4, nameKey: 'uptime_sla', value: '99.99%' },
]

export default function LearnMorePopup({ isOpen, onClose }: LearnMorePopupProps) {
	const { isDarkTheme } = useApp()
	const { t } = useLanguage()

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black bg-opacity-70 overflow-y-auto min-h-screen pt-16 sm:pt-8" onClose={onClose}>
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
						<Dialog.Panel className={`w-full max-w-6xl transform overflow-hidden rounded-2xl ${isDarkTheme ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-purple-900 to-violet-900'} p-8 shadow-xl transition-all`}>
							<div className="flex justify-between items-center mb-8">
								<Dialog.Title as="h3" className="text-3xl font-bold text-white">
									{t('why_choose_title')}
								</Dialog.Title>
								<button
									onClick={onClose}
									className="text-violet-200 hover:text-white transition-colors"
								>
									<XMarkIcon className="h-6 w-6" />
								</button>
							</div>

							<p className="text-violet-200 mb-8">
								{t('why_choose_desc')}
							</p>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{features.map((feature) => (
									<motion.div
										key={feature.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										className="bg-white bg-opacity-5 rounded-xl p-6"
									>
										<div className="text-4xl mb-4">{feature.icon}</div>
										<h4 className="text-xl font-semibold text-white mb-2">
											{t(feature.titleKey)}
										</h4>
										<p className="text-violet-200 text-sm">
											{t(feature.descriptionKey)}
										</p>
									</motion.div>
								))}
							</div>

							<div className="mt-12">
								<h4 className="text-2xl font-semibold text-white mb-6">
									{t('stats_title')}
								</h4>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
									{stats.map((stat) => (
										<motion.div
											key={stat.id}
											initial={{ opacity: 0, scale: 0.9 }}
											animate={{ opacity: 1, scale: 1 }}
											className="text-center"
										>
											<div className="text-3xl font-bold text-purple-300">
												{stat.value}
											</div>
											<div className="text-sm text-violet-200">
												{t(stat.nameKey)}
											</div>
										</motion.div>
									))}
								</div>
							</div>

							<div className="mt-12 text-center">
								<p className="text-violet-200 mb-6">
									{t('ready_to_transform')}
								</p>
								<div className="flex flex-col sm:flex-row justify-center gap-4">
									<Link
										to="/models"
										className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold hover:from-purple-600 hover:to-violet-600 transition-all"
										onClick={onClose}
									>
										{t('get_started_button')}
									</Link>
									<Link
										to="/docs"
										className="px-6 py-3 rounded-full bg-white bg-opacity-10 text-white font-semibold hover:bg-opacity-20 transition-all"
										onClick={onClose}
									>
										{t('view_docs')}
									</Link>
								</div>
							</div>
						</Dialog.Panel>
					</Transition.Child>
				</div>

			</Dialog>
		</Transition>
	)
}