import React, { useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'

interface Node {
	x: number
	y: number
	vx: number
	vy: number
}

export default function NeuralNetworkBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const { isGraphEnabled } = useApp()

	useEffect(() => {
		if (!isGraphEnabled) {
			return
		}

		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		// Set canvas size
		const resizeCanvas = () => {
			canvas.width = window.innerWidth
			canvas.height = window.innerHeight
		}
		resizeCanvas()
		window.addEventListener('resize', resizeCanvas)

		// Initialize nodes
		const nodes: Node[] = Array.from({ length: 50 }, () => ({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			vx: (Math.random() - 0.5) * 2,
			vy: (Math.random() - 0.5) * 2,
		}))

		// Animation function
		function animate() {
			if (!ctx || !canvas) return

			ctx.clearRect(0, 0, canvas.width, canvas.height)
			ctx.fillStyle = 'rgba(255, 255, 255, 0.5)' // Cambiado a blanco con opacidad
			ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)' // Cambiado a blanco con opacidad más baja

			// Update and draw nodes
			nodes.forEach((node) => {
				// Update position
				node.x += node.vx
				node.y += node.vy

				// Bounce off walls
				if (node.x < 0 || node.x > canvas.width) node.vx *= -1
				if (node.y < 0 || node.y > canvas.height) node.vy *= -1

				// Draw node
				ctx.beginPath()
				ctx.arc(node.x, node.y, 3, 0, Math.PI * 2)
				ctx.fill()

				// Draw connections
				nodes.forEach((otherNode) => {
					const dx = otherNode.x - node.x
					const dy = otherNode.y - node.y
					const distance = Math.sqrt(dx * dx + dy * dy)

					if (distance < 150) {
						ctx.beginPath()
						ctx.moveTo(node.x, node.y)
						ctx.lineTo(otherNode.x, otherNode.y)
						ctx.stroke()
					}
				})
			})

			requestAnimationFrame(animate)
		}

		const animationFrame = requestAnimationFrame(animate)

		return () => {
			window.removeEventListener('resize', resizeCanvas)
			cancelAnimationFrame(animationFrame)
		}
	}, [isGraphEnabled])

	if (!isGraphEnabled) {
		return null
	}

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 pointer-events-none z-0"
			style={{ background: 'transparent' }}
		/>
	)
} 