import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import Header from '../components/Header'
import AnimatedFooter from '../components/AnimatedFooter'

export default function ContactPage() {
	const { t } = useLanguage()
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		company: '',
		phone: '',
		modelInterest: '',
		message: '',
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		// Handle form submission
		console.log(formData)
	}

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	return (
		<div className="min-h-screen bg-theme-gradient">
			<Header variant="default" />
			<div className="pt-24 pb-32">
				<div className="container mx-auto px-4">
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center max-w-3xl mx-auto mb-16"
					>
						<h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
							{t('contact_title')}
						</h1>
						<p className="text-lg text-violet-200">
							{t('contact_subtitle')}
						</p>
					</motion.div>

					{/* Contact Form */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="max-w-2xl mx-auto"
					>
						<form
							onSubmit={handleSubmit}
							className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-8"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
								<div>
									<label
										htmlFor="name"
										className="block text-violet-200 mb-2"
									>
										{t('contact_name')}
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-700 text-white placeholder-violet-300 focus:outline-none focus:border-purple-500"
										placeholder={t('contact_placeholder_name')}
										required
									/>
								</div>
								<div>
									<label
										htmlFor="email"
										className="block text-violet-200 mb-2"
									>
										{t('contact_email')}
									</label>
									<input
										type="email"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-700 text-white placeholder-violet-300 focus:outline-none focus:border-purple-500"
										placeholder={t('contact_placeholder_email')}
										required
									/>
								</div>
								<div>
									<label
										htmlFor="company"
										className="block text-violet-200 mb-2"
									>
										{t('contact_company')}
									</label>
									<input
										type="text"
										id="company"
										name="company"
										value={formData.company}
										onChange={handleChange}
										className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-700 text-white placeholder-violet-300 focus:outline-none focus:border-purple-500"
										placeholder={t('contact_placeholder_company')}
										required
									/>
								</div>
								<div>
									<label
										htmlFor="phone"
										className="block text-violet-200 mb-2"
									>
										{t('contact_phone')}
									</label>
									<input
										type="tel"
										id="phone"
										name="phone"
										value={formData.phone}
										onChange={handleChange}
										className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-700 text-white placeholder-violet-300 focus:outline-none focus:border-purple-500"
										placeholder={t('contact_placeholder_phone')}
									/>
								</div>
							</div>

							<div className="mb-6">
								<label
									htmlFor="modelInterest"
									className="block text-violet-200 mb-2"
								>
									{t('contact_model')}
								</label>
								<select
									id="modelInterest"
									name="modelInterest"
									value={formData.modelInterest}
									onChange={handleChange}
									className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-700 text-white focus:outline-none focus:border-purple-500"
									required
								>
									<option value="" className="bg-purple-900">
										{t('contact_select_model')}
									</option>
									<option value="gpt4" className="bg-purple-900">
										GPT-4
									</option>
									<option value="dalle3" className="bg-purple-900">
										DALL-E 3
									</option>
									<option value="whisper" className="bg-purple-900">
										Whisper
									</option>
									<option value="stable-diffusion" className="bg-purple-900">
										Stable Diffusion
									</option>
									<option value="multiple" className="bg-purple-900">
										{t('multiple_models')}
									</option>
								</select>
							</div>

							<div className="mb-6">
								<label
									htmlFor="message"
									className="block text-violet-200 mb-2"
								>
									{t('contact_message')}
								</label>
								<textarea
									id="message"
									name="message"
									value={formData.message}
									onChange={handleChange}
									rows={4}
									className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-purple-700 text-white placeholder-violet-300 focus:outline-none focus:border-purple-500"
									placeholder={t('contact_placeholder_message')}
									required
								></textarea>
							</div>

							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								type="submit"
								className="w-full py-3 px-6 rounded-full bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors"
							>
								{t('contact_submit')}
							</motion.button>
						</form>

						{/* Additional Contact Info */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
						>
							<div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6">
								<h3 className="text-white font-semibold mb-2">{t('contact_email_label')}</h3>
								<p className="text-violet-200">sales@ailive.com</p>
							</div>
							<div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6">
								<h3 className="text-white font-semibold mb-2">{t('contact_phone_label')}</h3>
								<p className="text-violet-200">+1 (555) 123-4567</p>
							</div>
							<div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6">
								<h3 className="text-white font-semibold mb-2">{t('contact_hours_label')}</h3>
								<p className="text-violet-200">{t('contact_hours_value')}</p>
							</div>
						</motion.div>
					</motion.div>
				</div>
			</div>
			<AnimatedFooter />
		</div>
	)
} 