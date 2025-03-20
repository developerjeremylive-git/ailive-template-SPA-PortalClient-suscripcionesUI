import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useLanguage } from '../context/LanguageContext'

interface AIModel {
    id: string
    title: string
    description: string
    icon: string
    category: string
    metrics: {
        [key: string]: string
    }
}

const models: AIModel[] = [
    {
        id: 'gpt4',
        title: 'GPT-4',
        description: 'Advanced language model for natural conversations and complex tasks',
        icon: '🤖',
        category: 'Language',
        metrics: {
            latency: '~1s',
            availability: '99.9%',
            tokens: '8k context'
        }
    },
    {
        id: 'claude',
        title: 'Claude',
        description: 'Anthropic\'s advanced AI assistant focused on helpful, honest, and safe interactions',
        icon: '🧠',
        category: 'Language',
        metrics: {
            latency: '~1.2s',
            availability: '99.9%',
            tokens: '100k context'
        }
    },
    {
        id: 'dalle3',
        title: 'DALL-E 3',
        description: 'Create stunning artwork and images from textual descriptions',
        icon: '🎨',
        category: 'Image Generation',
        metrics: {
            latency: '~3s',
            availability: '99.9%',
            resolution: 'Up to 1024x1024'
        }
    },
    {
        id: 'stable-diffusion',
        title: 'Stable Diffusion XL',
        description: 'Advanced image generation with precise control and high-quality outputs',
        icon: '✨',
        category: 'Image Generation',
        metrics: {
            latency: '~4s',
            availability: '99.9%',
            resolution: 'Up to 2048x2048'
        }
    },
    {
        id: 'whisper',
        title: 'Whisper',
        description: 'High-accuracy speech recognition and transcription',
        icon: '🎤',
        category: 'Speech Recognition',
        metrics: {
            latency: '~2s',
            availability: '99.9%',
            languages: '100+ supported'
        }
    },
    {
        id: 'llama',
        title: 'LLaMA',
        description: 'Open-source language model for code generation and analysis',
        icon: '🦙',
        category: 'Language',
        metrics: {
            latency: '~2s',
            availability: '99.9%',
            tokens: '4k context'
        }
    }
]

export default function AIModels() {
    const { t } = useLanguage()
    const navigate = useNavigate()
    const [currentModel, setCurrentModel] = useState(0)
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)

    const nextModel = () => {
        setCurrentModel((prev) => (prev + 1) % models.length)
    }

    const prevModel = () => {
        setCurrentModel((prev) => (prev - 1 + models.length) % models.length)
    }

    const handleTryModel = (modelId: string) => {
        navigate(`/interactive-demo?model=${modelId}`)
    }

    return (
        <div className="relative overflow-hidden rounded-xl shadow-2xl mb-12">
            <div className="flex items-center justify-center min-h-[400px] bg-black/20 backdrop-blur-sm">
                <motion.div
                    key={currentModel}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="relative w-full max-w-4xl p-8"
                >
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevModel}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-4 bg-gradient-to-r from-black/50 to-transparent"
                    >
                        <ChevronLeftIcon className="w-8 h-8 text-white hover:text-purple-400 transition-colors" />
                    </button>
                    <button
                        onClick={nextModel}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-4 bg-gradient-to-l from-black/50 to-transparent"
                    >
                        <ChevronRightIcon className="w-8 h-8 text-white hover:text-purple-400 transition-colors" />
                    </button>

                    {/* Model Card */}
                    <div className="text-center px-16">
                        <div className="text-6xl mb-6">{models[currentModel].icon}</div>
                        <h2 className="text-4xl font-bold text-white mb-4">
                            {models[currentModel].title}
                        </h2>
                        <p className="text-lg text-purple-200 mb-8">
                            {models[currentModel].description}
                        </p>
                        
                        {/* Metrics */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {Object.entries(models[currentModel].metrics).map(([key, value]) => (
                                <div key={key} className="bg-white bg-opacity-5 rounded-lg p-4">
                                    <h3 className="text-violet-300 text-sm mb-1">
                                        {t(`model_card_${key}`)}
                                    </h3>
                                    <p className="text-white text-xl font-semibold">{value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleTryModel(models[currentModel].id)}
                                className="px-8 py-3 bg-purple-500 text-white rounded-full font-medium hover:bg-purple-600 transition-all"
                            >
                                {t('try_it_now')}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(`/models/${models[currentModel].id}`)}
                                className="px-8 py-3 border border-purple-500 text-purple-500 rounded-full font-medium hover:bg-purple-500 hover:text-white transition-all"
                            >
                                {t('learn_more')}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
} 