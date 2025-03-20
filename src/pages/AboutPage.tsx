import { motion } from 'framer-motion'
import Header from '../components/Header'
import AnimatedFooter from '../components/AnimatedFooter'
import { FiUsers, FiTarget, FiHeart, FiGlobe } from 'react-icons/fi'
import { useLanguage } from '../context/LanguageContext'

const teamMembers = [
	{
		name: 'Dr. Alexandra Chen',
		role: 'CEO & Co-founder',
		image: '/team/alexandra.jpg',
		bio: 'Former AI Research Lead at Stanford University with 15+ years of experience in machine learning.',
	},
	{
		name: 'Marcus Thompson',
		role: 'CTO & Co-founder',
		image: '/team/marcus.jpg',
		bio: 'Previously led engineering teams at Google AI and contributed to breakthrough language models.',
	},
	{
		name: 'Dr. Sarah Patel',
		role: 'Head of Research',
		image: '/team/sarah.jpg',
		bio: 'Published researcher in neural networks with focus on model optimization and efficiency.',
	},
	{
		name: 'James Wilson',
		role: 'Head of Product',
		image: '/team/james.jpg',
		bio: 'Product veteran with experience scaling AI products from concept to millions of users.',
	},
]

const values = [
	{
		icon: <FiUsers className="w-8 h-8" />,
		title: 'about_values_1',
		description: 'about_values_1_text',
	},
	{
		icon: <FiTarget className="w-8 h-8" />,
		title: 'about_values_2',
		description: 'about_values_2_text',
	},
	{
		icon: <FiHeart className="w-8 h-8" />,
		title: 'about_values_3',
		description: 'about_values_3_text',
	},
]

const timeline = [
	{
		year: '2020',
		title: 'Company Founded',
		description:
			'AILive was founded with a vision to democratize access to advanced AI models.',
	},
	{
		year: '2021',
		title: 'First API Launch',
		description:
			'Released our first set of AI models via API, serving thousands of developers.',
	},
	{
		year: '2022',
		title: 'Series A Funding',
		description:
			'Raised $50M to accelerate development and expand our model offerings.',
	},
	{
		year: '2023',
		title: 'Global Expansion',
		description:
			'Opened offices in Europe and Asia, serving clients worldwide.',
	},
]

export default function AboutPage() {
	const { t } = useLanguage()

	return (
		<div className="min-h-screen bg-theme-gradient">
			<Header variant="default" />
			<div className="pt-24 pb-32">
				<div className="container mx-auto px-4">
					{/* Hero Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center max-w-4xl mx-auto mb-24"
					>
						<h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-violet-200">
							{t('about_title')}
						</h1>
						<p className="text-xl text-violet-200 leading-relaxed">
							{t('about_description')}
						</p>
					</motion.div>

					{/* Vision & Mission Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-8"
					>
						<div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-8">
							<h2 className="text-2xl font-semibold text-white mb-4">
								{t('about_vision')}
							</h2>
							<p className="text-violet-200">{t('about_vision_text')}</p>
						</div>
						<div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-8">
							<h2 className="text-2xl font-semibold text-white mb-4">
								{t('about_mission')}
							</h2>
							<p className="text-violet-200">{t('about_mission_text')}</p>
						</div>
					</motion.div>

					{/* Values Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="mb-24"
					>
						<h2 className="text-3xl font-bold text-white text-center mb-12">
							{t('about_values')}
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{values.map((value, index) => (
								<motion.div
									key={value.title}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 + index * 0.1 }}
									className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-8 text-center"
								>
									<div className="text-purple-400 mb-4 flex justify-center">
										{value.icon}
									</div>
									<h3 className="text-xl font-semibold text-white mb-4">
										{t(value.title)}
									</h3>
									<p className="text-violet-200">{t(value.description)}</p>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Team Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="mb-24"
					>
						<h2 className="text-3xl font-bold text-white text-center mb-12">
							Our Team
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
							{teamMembers.map((member, index) => (
								<motion.div
									key={member.name}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 + index * 0.1 }}
									className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-6"
								>
									<img
										src={member.image}
										alt={member.name}
										className="w-full h-48 object-cover rounded-xl mb-6"
									/>
									<h3 className="text-xl font-semibold text-white mb-2">
										{member.name}
									</h3>
									<p className="text-purple-400 mb-4">{member.role}</p>
									<p className="text-violet-200">{member.bio}</p>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Timeline Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
					>
						<h2 className="text-3xl font-bold text-white text-center mb-12">
							Our Journey
						</h2>
						<div className="max-w-4xl mx-auto">
							{timeline.map((event, index) => (
								<motion.div
									key={event.year}
									initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.6 + index * 0.1 }}
									className="relative pl-8 pb-12 border-l-2 border-purple-500 last:pb-0"
								>
									<div className="absolute left-0 top-0 w-4 h-4 bg-purple-500 rounded-full -translate-x-[9px]" />
									<div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6">
										<div className="text-purple-400 text-lg font-semibold mb-2">
											{event.year}
										</div>
										<h3 className="text-xl font-semibold text-white mb-2">
											{event.title}
										</h3>
										<p className="text-violet-200">{event.description}</p>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				</div>
			</div>
			<AnimatedFooter />
		</div>
	)
} 