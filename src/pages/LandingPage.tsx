import { motion } from 'framer-motion'
import { FiSearch, FiClock, FiGrid, FiBarChart2, FiLayers, FiCpu } from 'react-icons/fi'
import { Navigation } from '../components/Navigation'
import { BackgroundPattern } from '../components/BackgroundPattern'
import { DashboardPreview } from '../components/DashboardPreview'
import SubscriptionToolsSection from '../components/SubscriptionToolsSection'

const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6 }
}

export function LandingPage() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
			<Navigation />
			
			{/* Hero Section */}
			<section className="relative h-screen flex items-center justify-center overflow-hidden">
				<BackgroundPattern />
				
				<div className="container mx-auto px-4 z-10">
					<motion.div 
						className="text-center max-w-4xl mx-auto"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 mb-6">
							All Your AI Models in One Place
						</h1>
						<p className="text-xl text-neutral-700 mb-8">
							Access and manage all your Cloudflare AI models through a single, 
							intuitive interface. Track conversations, analyze patterns, and 
							unlock insights with our powerful dashboard.
						</p>
						<div className="flex gap-4 justify-center">
							<button className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
								Explore Models
							</button>
							<button className="px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
								Learn More
							</button>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-24 bg-white">
				<div className="container mx-auto px-4">
					<motion.h2 
						className="text-4xl font-bold text-center mb-16"
						{...fadeInUp}
					>
						Why Choose Our Platform?
					</motion.h2>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						<FeatureCard 
							icon={<FiSearch className="w-8 h-8" />}
							title="Smart Search"
							description="Find previous conversations quickly with our advanced search capabilities across all AI models."
						/>
						<FeatureCard 
							icon={<FiClock className="w-8 h-8" />}
							title="Chat History"
							description="Access your complete conversation history, organized by model and date for easy reference."
						/>
						<FeatureCard 
							icon={<FiGrid className="w-8 h-8" />}
							title="Category Navigation"
							description="Browse conversations by AI model category, making it simple to find specific interactions."
						/>
						<FeatureCard 
							icon={<FiBarChart2 className="w-8 h-8" />}
							title="Analytics Dashboard"
							description="Visualize your AI interaction patterns with beautiful, intuitive dashboards."
						/>
						<FeatureCard 
							icon={<FiLayers className="w-8 h-8" />}
							title="Multi-Model Support"
							description="Access all Cloudflare AI models from a single interface, streamlining your workflow."
						/>
						<FeatureCard 
							icon={<FiCpu className="w-8 h-8" />}
							title="Real-time Processing"
							description="Experience fast, responsive interactions with all AI models through our optimized platform."
						/>
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section id="how-it-works" className="py-24 bg-neutral-50">
				<div className="container mx-auto px-4">
					<motion.h2 
						className="text-4xl font-bold text-center mb-16"
						{...fadeInUp}
					>
						How It Works
					</motion.h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<StepCard 
							number="01"
							title="Choose Your Model"
							description="Select from our comprehensive collection of Cloudflare AI models, each optimized for specific tasks."
						/>
						<StepCard 
							number="02"
							title="Start Chatting"
							description="Engage with the AI model through our intuitive chat interface, designed for natural conversations."
						/>
						<StepCard 
							number="03"
							title="Track & Analyze"
							description="Access your conversation history and gain insights through our powerful analytics dashboard."
						/>
					</div>
				</div>
			</section>

			{/* Dashboard Preview Section */}
			<section id="dashboard" className="py-24 bg-white">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<motion.div 
							className="space-y-6"
							{...fadeInUp}
						>
							<h2 className="text-4xl font-bold">
								Beautiful Analytics Dashboard
							</h2>
							<p className="text-lg text-neutral-700">
								Our intuitive dashboard provides deep insights into your AI interactions:
							</p>
							<ul className="space-y-4">
								<li className="flex items-center gap-3">
									<div className="w-2 h-2 rounded-full bg-primary-500" />
									<span>Visual representation of chat history and patterns</span>
								</li>
								<li className="flex items-center gap-3">
									<div className="w-2 h-2 rounded-full bg-primary-500" />
									<span>Model usage statistics and performance metrics</span>
								</li>
								<li className="flex items-center gap-3">
									<div className="w-2 h-2 rounded-full bg-primary-500" />
									<span>Category-based conversation organization</span>
								</li>
								<li className="flex items-center gap-3">
									<div className="w-2 h-2 rounded-full bg-primary-500" />
									<span>Advanced search and filtering capabilities</span>
								</li>
							</ul>
						</motion.div>
						
						<motion.div 
							className="rounded-xl overflow-hidden shadow-2xl"
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
						>
							<DashboardPreview />
						</motion.div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-24 bg-gradient-to-r from-primary-600 to-secondary-600">
				<div className="container mx-auto px-4">
					<div className="text-center text-white max-w-3xl mx-auto">
						<motion.h2 
							className="text-4xl font-bold mb-6"
							{...fadeInUp}
						>
							Ready to Transform Your AI Experience?
						</motion.h2>
						<motion.p 
							className="text-xl mb-8 opacity-90"
							{...fadeInUp}
						>
							Join thousands of users who are already leveraging the power of 
							Cloudflare AI models through our platform.
						</motion.p>
						<motion.button 
							className="px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-neutral-100 transition-colors"
							{...fadeInUp}
						>
							Get Started Now
						</motion.button>
					</div>
				</div>
			</section>
		</div>
	)
}

function FeatureCard({ icon, title, description }: { 
	icon: React.ReactNode
	title: string
	description: string 
}) {
	return (
		<motion.div 
			className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow"
			whileHover={{ y: -5 }}
			{...fadeInUp}
		>
			<div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
				{icon}
			</div>
			<h3 className="text-xl font-semibold mb-3">{title}</h3>
			<p className="text-neutral-600">{description}</p>
		</motion.div>
	)
}

function StepCard({ number, title, description }: {
	number: string
	title: string
	description: string
}) {
	return (
		<motion.div 
			className="p-6 rounded-xl bg-white shadow-lg"
			{...fadeInUp}
		>
			<div className="text-4xl font-bold text-primary-500 mb-4">
				{number}
			</div>
			<h3 className="text-xl font-semibold mb-3">{title}</h3>
			<p className="text-neutral-600">{description}</p>
		</motion.div>
	)
}
