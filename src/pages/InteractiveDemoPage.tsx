import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header'
import AnimatedFooter from '../components/AnimatedFooter'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { FiMessageSquare, FiImage, FiMic, FiCpu, FiCommand, FiPenTool, FiZap } from 'react-icons/fi'

const GPTDemo = () => {
	const { t } = useLanguage()
	const { user, setIsLoginOpen } = useAuth()
	const [input, setInput] = useState('')
	const [response, setResponse] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = () => {
		if (!user) {
			setIsLoginOpen(true);
			return;
		}
		setIsLoading(true)
		// Simulate API call
		setTimeout(() => {
			setResponse(t('gpt_demo_response'))
			setIsLoading(false)
		}, 1000)
	}

	return (
		<div className="space-y-4">
			<textarea
				value={input}
				onChange={(e) => setInput(e.target.value)}
				className="w-full h-32 p-4 rounded-xl bg-white bg-opacity-5 text-white placeholder-violet-300"
				placeholder={t('demo_input_placeholder')}
			/>
			<button
				onClick={handleSubmit}
				disabled={isLoading}
				className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors disabled:opacity-50"
			>
				{isLoading ? t('processing') : t('demo_send_message')}
			</button>
			{response && (
				<div className="p-4 rounded-xl bg-white bg-opacity-5">
					<p className="text-violet-200">{response}</p>
				</div>
			)}
		</div>
	)
}

const ClaudeDemo = () => {
	const { t } = useLanguage()
	const { user, setIsLoginOpen } = useAuth()
	const [input, setInput] = useState('')
	const [response, setResponse] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [context, setContext] = useState<string[]>([])

	const handleSubmit = () => {
		if (!user) {
			setIsLoginOpen(true);
			return;
		}
		setIsLoading(true)
		// Simulate API call with context awareness
		setTimeout(() => {
			const newResponse = t('claude_demo_response')
			setResponse(newResponse)
			setContext([...context, input, newResponse])
			setIsLoading(false)
		}, 1000)
	}

	return (
		<div className="space-y-4">
			{context.length > 0 && (
				<div className="space-y-4 mb-6">
					{context.map((message, index) => (
						<div
							key={index}
							className={`p-4 rounded-xl ${
								index % 2 === 0
									? 'bg-purple-500 bg-opacity-10 ml-auto max-w-[80%]'
									: 'bg-white bg-opacity-5 mr-auto max-w-[80%]'
							}`}
						>
							<p className="text-violet-200">{message}</p>
						</div>
					))}
				</div>
			)}
			<textarea
				value={input}
				onChange={(e) => setInput(e.target.value)}
				className="w-full h-32 p-4 rounded-xl bg-white bg-opacity-5 text-white placeholder-violet-300"
				placeholder={t('claude_input_placeholder')}
			/>
			<div className="flex justify-between items-center">
				<button
					onClick={() => setContext([])}
					className="px-6 py-3 text-violet-300 hover:text-white transition-colors"
				>
					{t('clear_input')}
				</button>
				<button
					onClick={handleSubmit}
					disabled={isLoading}
					className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors disabled:opacity-50"
				>
					{isLoading ? t('processing') : t('send_message')}
				</button>
			</div>
		</div>
	)
}

const LlamaDemo = () => {
	const { t } = useLanguage()
	const { user, setIsLoginOpen } = useAuth()
	const [input, setInput] = useState('')
	const [response, setResponse] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [temperature, setTemperature] = useState(0.7)
	const [maxTokens, setMaxTokens] = useState(100)

	const handleSubmit = () => {
		if (!user) {
			setIsLoginOpen(true);
			return;
		}
		setIsLoading(true)
		// Simulate API call with parameters
		setTimeout(() => {
			setResponse(t('llama_demo_response').replace('{temp}', temperature.toString()).replace('{tokens}', maxTokens.toString()))
			setIsLoading(false)
		}, 1000)
	}

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<label className="block text-violet-200">{t('temperature')}: {temperature}</label>
				<input
					type="range"
					min="0"
					max="1"
					step="0.1"
					value={temperature}
					onChange={(e) => setTemperature(parseFloat(e.target.value))}
					className="w-full"
				/>
			</div>
			<div className="space-y-4">
				<label className="block text-violet-200">{t('max_length')}: {maxTokens}</label>
				<input
					type="range"
					min="10"
					max="500"
					step="10"
					value={maxTokens}
					onChange={(e) => setMaxTokens(parseInt(e.target.value))}
					className="w-full"
				/>
			</div>
			<textarea
				value={input}
				onChange={(e) => setInput(e.target.value)}
				className="w-full h-32 p-4 rounded-xl bg-white bg-opacity-5 text-white placeholder-violet-300"
				placeholder={t('llama_input_placeholder')}
			/>
			<button
				onClick={handleSubmit}
				disabled={isLoading}
				className="w-full px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors disabled:opacity-50"
			>
				{isLoading ? t('processing') : t('generate_button')}
			</button>
			{response && (
				<div className="p-4 rounded-xl bg-white bg-opacity-5">
					<p className="text-violet-200">{response}</p>
				</div>
			)}
		</div>
	)
}

const ImageDemo = () => {
	const { t } = useLanguage()
	const { user, setIsLoginOpen } = useAuth()
	const [prompt, setPrompt] = useState('')
	const [image, setImage] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const handleGenerate = () => {
		if (!user) {
			setIsLoginOpen(true);
			return;
		}
		setIsLoading(true)
		// Simulate API call
		setTimeout(() => {
			setImage('/placeholder-image.jpg')
			setIsLoading(false)
		}, 1500)
	}

	return (
		<div className="space-y-4">
			<input
				type="text"
				value={prompt}
				onChange={(e) => setPrompt(e.target.value)}
				className="w-full p-4 rounded-xl bg-white bg-opacity-5 text-white placeholder-violet-300"
				placeholder={t('image_input_placeholder')}
			/>
			<button
				onClick={handleGenerate}
				disabled={isLoading}
				className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors disabled:opacity-50"
			>
				{isLoading ? t('processing') : t('generate_button')}
			</button>
			{image && (
				<div className="rounded-xl overflow-hidden">
					<img src={image} alt={t('generated_image')} className="w-full" />
				</div>
			)}
		</div>
	)
}

const SpeechDemo = () => {
	const { t } = useLanguage()
	const { user, setIsLoginOpen } = useAuth()
	const [isRecording, setIsRecording] = useState(false)
	const [transcript, setTranscript] = useState('')

	const toggleRecording = () => {
		if (!user) {
			setIsLoginOpen(true);
			return;
		}
		setIsRecording(!isRecording)
		if (!isRecording) {
			// Simulate recording
			setTimeout(() => {
				setTranscript(t('speech_demo_transcript'))
				setIsRecording(false)
			}, 3000)
		}
	}

	return (
		<div className="space-y-4">
			<button
				onClick={toggleRecording}
				className={`w-full px-6 py-3 rounded-full font-semibold transition-all ${
					isRecording
						? 'bg-red-500 hover:bg-red-600'
						: 'bg-purple-500 hover:bg-purple-600'
				} text-white`}
			>
				{isRecording ? t('stop_recording') : t('start_recording')}
			</button>
			{transcript && (
				<div className="p-4 rounded-xl bg-white bg-opacity-5">
					<p className="text-violet-200">{transcript}</p>
				</div>
			)}
		</div>
	)
}

const StableDiffusionDemo = () => {
	const { t } = useLanguage()
	const { user, setIsLoginOpen } = useAuth()
	const [prompt, setPrompt] = useState('')
	const [negativePrompt, setNegativePrompt] = useState('')
	const [image, setImage] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [guidance, setGuidance] = useState(7.5)

	const handleGenerate = () => {
		if (!user) {
			setIsLoginOpen(true);
			return;
		}
		setIsLoading(true)
		// Simulate API call
		setTimeout(() => {
			setImage('/placeholder-image.jpg')
			setIsLoading(false)
		}, 1500)
	}

	return (
		<div className="space-y-4">
			<textarea
				value={prompt}
				onChange={(e) => setPrompt(e.target.value)}
				className="w-full h-32 p-4 rounded-xl bg-white bg-opacity-5 text-white placeholder-violet-300"
				placeholder={t('stable_diffusion_prompt_placeholder')}
			/>
			<textarea
				value={negativePrompt}
				onChange={(e) => setNegativePrompt(e.target.value)}
				className="w-full h-20 p-4 rounded-xl bg-white bg-opacity-5 text-white placeholder-violet-300"
				placeholder={t('stable_diffusion_negative_prompt_placeholder')}
			/>
			<div className="space-y-2">
				<label className="block text-violet-200">{t('guidance_scale')}: {guidance}</label>
				<input
					type="range"
					min="1"
					max="20"
					step="0.5"
					value={guidance}
					onChange={(e) => setGuidance(parseFloat(e.target.value))}
					className="w-full"
				/>
			</div>
			<button
				onClick={handleGenerate}
				disabled={isLoading || !prompt.trim()}
				className="w-full px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors disabled:opacity-50"
			>
				{isLoading ? t('generating') : t('generate_image')}
			</button>
			{image && (
				<div className="rounded-xl overflow-hidden">
					<img src={image} alt={prompt} className="w-full" />
				</div>
			)}
		</div>
	)
}

const DeepSeekDemo = () => {
	const { t } = useLanguage()
	const { user, setIsLoginOpen } = useAuth()
	const [input, setInput] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [response, setResponse] = useState<string | null>(null)
	const [settings, setSettings] = useState({
		temperature: 0.7,
		maxTokens: 1000,
		topP: 0.9,
		topK: 50,
	})

	const handleSettingsChange = (key: keyof typeof settings, value: number) => {
		setSettings((prev) => ({
			...prev,
			[key]: value,
		}))
	}

	const handleSubmit = async () => {
		if (!user) {
			setIsLoginOpen(true);
			return;
		}
		if (!input.trim()) return

		setError(null)
		setIsLoading(true)
		setResponse(null)

		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 2000))
			setResponse(t('deepseek_demo_response'))
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err))
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<label className="block text-violet-200">{t('temperature')}: {settings.temperature}</label>
						<input
							type="range"
							min="0"
							max="2"
							step="0.1"
							value={settings.temperature}
							onChange={(e) => handleSettingsChange('temperature', parseFloat(e.target.value))}
							className="w-full"
						/>
					</div>
					<div className="space-y-2">
						<label className="block text-violet-200">{t('max_tokens')}: {settings.maxTokens}</label>
						<input
							type="range"
							min="100"
							max="4000"
							step="100"
							value={settings.maxTokens}
							onChange={(e) => handleSettingsChange('maxTokens', parseInt(e.target.value))}
							className="w-full"
						/>
					</div>
					<div className="space-y-2">
						<label className="block text-violet-200">{t('top_p')}: {settings.topP}</label>
						<input
							type="range"
							min="0"
							max="1"
							step="0.1"
							value={settings.topP}
							onChange={(e) => handleSettingsChange('topP', parseFloat(e.target.value))}
							className="w-full"
						/>
					</div>
					<div className="space-y-2">
						<label className="block text-violet-200">{t('top_k')}: {settings.topK}</label>
						<input
							type="range"
							min="1"
							max="100"
							step="1"
							value={settings.topK}
							onChange={(e) => handleSettingsChange('topK', parseInt(e.target.value))}
							className="w-full"
						/>
					</div>
				</div>
			</div>
			<textarea
				value={input}
				onChange={(e) => setInput(e.target.value)}
				className="w-full h-32 p-4 rounded-xl bg-white bg-opacity-5 text-white placeholder-violet-300"
				placeholder={t('deepseek_input_placeholder')}
			/>
			<button
				onClick={handleSubmit}
				disabled={isLoading || !input.trim()}
				className="w-full px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors disabled:opacity-50"
			>
				{isLoading ? t('processing') : t('generate_button')}
			</button>
			{error && (
				<div className="p-4 rounded-xl bg-red-500 bg-opacity-10 border border-red-500">
					<p className="text-red-400">{error}</p>
				</div>
			)}
			{response && (
				<div className="p-4 rounded-xl bg-white bg-opacity-5">
					<p className="text-violet-200 whitespace-pre-wrap">{response}</p>
				</div>
			)}
		</div>
	)
}

interface DemoInterface {
	id: string
	title: string
	description: string
	icon: JSX.Element
	component: React.FC
	modelId?: string
	modelName?: string
	metrics?: {
		latency: string
		availability: string
		[key: string]: string
	}
}

export default function InteractiveDemoPage() {
	const { isDarkTheme } = useApp()
	const { t } = useLanguage()
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const [selectedDemo, setSelectedDemo] = useState(searchParams.get('model') || 'deepseek')

	// Enhanced demos array with model information
	const demos: DemoInterface[] = [
		{
			id: 'deepseek',
			title: 'DeepSeek',
			description:  t('deepseek_description'),
			icon: <FiZap className="w-6 h-6" />,
			component: DeepSeekDemo,
			modelId: 'deepseek',
			modelName: 'DeepSeek-R1-Distill-Qwen-32B',
			metrics: {
				latency: '~1.5s',
				availability: '99.9%',
				tokens: t('up_to') + ' 8k ' + t('tokens')
			}
		},
		{
			id: 'gpt4',
			title: t('tab_text_generation'),
			description: t('demo_text_generation_desc'),
			icon: <FiMessageSquare className="w-6 h-6" />,
			component: GPTDemo,
			modelId: 'gpt4',
			modelName: 'GPT-4',
			metrics: {
				latency: '~1s',
				availability: '99.9%',
				tokens: t('up_to') + ' 8k ' + t('tokens')
			}
		},
		{
			id: 'claude',
			title: t('tab_claude'),
			description: t('claude_desc'),
			icon: <FiCpu className="w-6 h-6" />,
			component: ClaudeDemo,
			modelId: 'claude',
			modelName: 'Claude',
			metrics: {
				latency: '~1.2s',
				availability: '99.9%',
				tokens: t('up_to') + ' 100k ' + t('tokens')
			}
		},
		{
			id: 'stable-diffusion',
			title: t('stable_diffusion'),
			description: t('stable_diffusion_desc'),
			icon: <FiPenTool className="w-6 h-6" />,
			component: StableDiffusionDemo,
			modelId: 'stable-diffusion',
			modelName: t('stable_diffusion'),
			metrics: {
				latency: '~4s',
				availability: '99.9%',
				resolution: t('up_to') + ' 2048x2048'
			}
		},
		{
			id: 'image',
			title: t('tab_image_generation'),
			description: t('demo_image_generation_desc'),
			icon: <FiImage className="w-6 h-6" />,
			component: ImageDemo,
			modelId: 'dalle3',
			modelName: 'DALL-E 3',
			metrics: {
				latency: '~3s',
				availability: '99.9%',
				resolution: t('up_to') + ' 1024x1024'
			}
		},
		{
			id: 'speech',
			title: t('tab_speech_recognition'),
			description: t('demo_speech_recognition_desc'),
			icon: <FiMic className="w-6 h-6" />,
			component: SpeechDemo,
			modelId: 'whisper',
			modelName: 'Whisper',
			metrics: {
				latency: '~2s',
				availability: '99.9%',
				languages: '100+ ' + t('supported')
			}
		},
		{
			id: 'code',
			title: t('tab_code_generation'),
			description: t('code_generation_desc'),
			icon: <FiCommand className="w-6 h-6" />,
			component: LlamaDemo,
			modelId: 'llama',
			modelName: 'LLaMA',
			metrics: {
				latency: '~2s',
				availability: '99.9%',
				tokens: t('up_to') + ' 4k ' + t('tokens')
			}
		},
	]

	// Effect to handle model parameter
	useEffect(() => {
		const modelParam = searchParams.get('model')
		if (modelParam) {
			const demo = demos.find(d => d.modelId === modelParam)
			if (demo) {
				setSelectedDemo(demo.id)
			}
		}
	}, [searchParams])

	const selectedDemoInfo = demos.find((demo) => demo.id === selectedDemo)
	const selectedDemoComponent = selectedDemoInfo?.component || GPTDemo

	return (
		<div className="min-h-screen bg-theme-gradient">
			<Header variant="default" />
			<div className="pt-32 pb-20">
				<div className="container mx-auto px-4">
					{/* Header */}
					<div className="text-center mb-12">
						<h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
							{selectedDemoInfo?.id === 'stable-diffusion' ? t('stable_diffusion') : selectedDemoInfo?.modelName || t('demo_title')}
						</h1>
						<p className="text-violet-200 text-lg">
							{selectedDemoInfo?.description || t('demo_subtitle')}
						</p>
					</div>

					{/* Model Metrics */}
					{selectedDemoInfo?.metrics && (
						<div className="max-w-4xl mx-auto mb-8">
							<div className="grid grid-cols-3 gap-4">
								{Object.entries(selectedDemoInfo.metrics).map(([key, value]) => (
									<div key={key} className="bg-white bg-opacity-5 rounded-lg p-4">
										<h3 className="text-violet-300 text-sm mb-1">
											{key === 'tokens' ? t('context_length') : t(`model_card_${key}`)}
										</h3>
										<p className="text-white text-xl font-semibold">{value}</p>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Demo Selector */}
					<div className="max-w-4xl mx-auto">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
							{demos.map((demo) => (
								<motion.button
									key={demo.id}
									onClick={() => {
										setSelectedDemo(demo.id)
										navigate(`/interactive-demo?model=${demo.modelId}`, { replace: true })
									}}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className={`p-4 rounded-xl transition-all ${
										selectedDemo === demo.id
											? 'bg-purple-500 text-white'
											: 'bg-white bg-opacity-5 text-violet-200 hover:bg-opacity-10'
									}`}
								>
									<div className="flex flex-col items-center text-center">
										{demo.icon}
										<span className="mt-2 font-medium">{demo.title}</span>
									</div>
								</motion.button>
							))}
						</div>

						{/* Demo Content */}
						<div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6">
							<AnimatePresence mode="wait">
								<motion.div
									key={selectedDemo}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.3 }}
								>
									{selectedDemoComponent && React.createElement(selectedDemoComponent)}
								</motion.div>
							</AnimatePresence>
						</div>
					</div>
				</div>
			</div>
			<AnimatedFooter />
		</div>
	)
}