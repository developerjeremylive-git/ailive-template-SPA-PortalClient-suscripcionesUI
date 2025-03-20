export function BackgroundPattern() {
	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			<div className="absolute inset-0" style={{
				backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.1) 1px, transparent 0)`,
				backgroundSize: '40px 40px'
			}} />
			
			{/* Gradient Orbs */}
			<div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/30 rounded-full blur-3xl" />
			<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/30 rounded-full blur-3xl" />
			
			{/* Animated Particles */}
			<div className="absolute inset-0">
				{Array.from({ length: 50 }).map((_, i) => (
					<div
						key={i}
						className="absolute w-1 h-1 bg-primary-500/20 rounded-full"
						style={{
							top: `${Math.random() * 100}%`,
							left: `${Math.random() * 100}%`,
							animation: `float ${5 + Math.random() * 5}s linear infinite`,
							animationDelay: `${-Math.random() * 5}s`
						}}
					/>
				))}
			</div>
		</div>
	)
} 