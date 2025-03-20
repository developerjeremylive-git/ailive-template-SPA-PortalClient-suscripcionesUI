import React from 'react'
import { motion } from 'framer-motion'
import { FiMessageSquare, FiCpu, FiBarChart2, FiSearch } from 'react-icons/fi'
import { useLanguage } from '../context/LanguageContext'

interface DashboardPreviewProps {
	type: 'analytics' | 'models' | 'performance'
}

export default function DashboardPreview({ type }: DashboardPreviewProps) {
	const { t } = useLanguage()

	const getContent = () => {
		switch (type) {
			case 'analytics':
				return (
					<div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl">
						<div className="mb-6">
							<h3 className="text-lg font-semibold text-white mb-2">{t('dashboard_model_performance')}</h3>
							<div className="grid grid-cols-3 gap-4">
								<div className="bg-gray-800 p-4 rounded-lg">
									<div className="text-sm text-gray-400">{t('dashboard_accuracy')}</div>
									<div className="text-2xl font-bold text-green-400">98.5%</div>
								</div>
								<div className="bg-gray-800 p-4 rounded-lg">
									<div className="text-sm text-gray-400">{t('dashboard_latency')}</div>
									<div className="text-2xl font-bold text-blue-400">45ms</div>
								</div>
								<div className="bg-gray-800 p-4 rounded-lg">
									<div className="text-sm text-gray-400">{t('dashboard_uptime')}</div>
									<div className="text-2xl font-bold text-purple-400">99.9%</div>
								</div>
							</div>
						</div>
						<div className="space-y-4">
							<div className="bg-gray-800 p-4 rounded-lg">
								<div className="flex justify-between items-center mb-2">
									<div className="text-white">{t('dashboard_api_usage')}</div>
									<div className="text-green-400">+24%</div>
								</div>
								<div className="h-4 bg-gray-700 rounded-full overflow-hidden">
									<div className="h-full bg-green-400 w-3/4 rounded-full"></div>
								</div>
							</div>
							<div className="bg-gray-800 p-4 rounded-lg">
								<div className="flex justify-between items-center mb-2">
									<div className="text-white">{t('dashboard_model_training')}</div>
									<div className="text-blue-400">92%</div>
								</div>
								<div className="h-4 bg-gray-700 rounded-full overflow-hidden">
									<div className="h-full bg-blue-400 w-11/12 rounded-full"></div>
								</div>
							</div>
						</div>
					</div>
				)
			case 'models':
				return (
					<div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl">
						<div className="mb-6">
							<h3 className="text-lg font-semibold text-white mb-4">Active Models</h3>
							<div className="space-y-4">
								<div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
									<div className="flex items-center">
										<div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white mr-3">
											GPT
										</div>
										<div>
											<div className="text-white">GPT-4</div>
											<div className="text-sm text-gray-400">Language Model</div>
										</div>
									</div>
									<div className="text-green-400">Active</div>
								</div>
								<div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
									<div className="flex items-center">
										<div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white mr-3">
											SD
										</div>
										<div>
											<div className="text-white">Stable Diffusion</div>
											<div className="text-sm text-gray-400">Image Generation</div>
										</div>
									</div>
									<div className="text-green-400">Active</div>
								</div>
								<div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
									<div className="flex items-center">
										<div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white mr-3">
											W
										</div>
										<div>
											<div className="text-white">Whisper</div>
											<div className="text-sm text-gray-400">Speech Recognition</div>
										</div>
									</div>
									<div className="text-green-400">Active</div>
								</div>
							</div>
						</div>
					</div>
				)
			case 'performance':
				return (
					<div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl">
						<div className="mb-6">
							<h3 className="text-lg font-semibold text-white mb-4">System Performance</h3>
							<div className="grid grid-cols-2 gap-4">
								<div className="bg-gray-800 p-4 rounded-lg">
									<div className="flex justify-between items-center mb-2">
										<div className="text-gray-400">CPU Usage</div>
										<div className="text-blue-400">45%</div>
									</div>
									<div className="h-2 bg-gray-700 rounded-full">
										<div className="h-full w-5/12 bg-blue-400 rounded-full"></div>
									</div>
								</div>
								<div className="bg-gray-800 p-4 rounded-lg">
									<div className="flex justify-between items-center mb-2">
										<div className="text-gray-400">Memory</div>
										<div className="text-purple-400">72%</div>
									</div>
									<div className="h-2 bg-gray-700 rounded-full">
										<div className="h-full w-8/12 bg-purple-400 rounded-full"></div>
									</div>
								</div>
								<div className="bg-gray-800 p-4 rounded-lg">
									<div className="flex justify-between items-center mb-2">
										<div className="text-gray-400">GPU Usage</div>
										<div className="text-green-400">85%</div>
									</div>
									<div className="h-2 bg-gray-700 rounded-full">
										<div className="h-full w-10/12 bg-green-400 rounded-full"></div>
									</div>
								</div>
								<div className="bg-gray-800 p-4 rounded-lg">
									<div className="flex justify-between items-center mb-2">
										<div className="text-gray-400">Network</div>
										<div className="text-yellow-400">2.4 GB/s</div>
									</div>
									<div className="h-2 bg-gray-700 rounded-full">
										<div className="h-full w-6/12 bg-yellow-400 rounded-full"></div>
									</div>
								</div>
							</div>
						</div>
						<div className="space-y-4">
							<div className="bg-gray-800 p-4 rounded-lg">
								<div className="flex justify-between items-center mb-2">
									<div className="text-white">Response Time</div>
									<div className="text-green-400">45ms avg</div>
								</div>
								<div className="h-4 bg-gray-700 rounded-full overflow-hidden">
									<div className="h-full bg-green-400 w-1/4 rounded-full"></div>
								</div>
							</div>
							<div className="bg-gray-800 p-4 rounded-lg">
								<div className="flex justify-between items-center mb-2">
									<div className="text-white">Error Rate</div>
									<div className="text-red-400">0.01%</div>
								</div>
								<div className="h-4 bg-gray-700 rounded-full overflow-hidden">
									<div className="h-full bg-red-400 w-[1%] rounded-full"></div>
								</div>
							</div>
						</div>
					</div>
				)
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="w-full max-w-3xl mx-auto"
		>
			{getContent()}
		</motion.div>
	)
} 