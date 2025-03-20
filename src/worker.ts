import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { logger } from 'hono/logger'
import { Ai } from '@cloudflare/ai'
import { cors } from 'hono/cors'

type Bindings = {
	__STATIC_CONTENT: string
	AI: Ai
	DEEPSEEK_API_KEY?: string  // Optional API key in environment
}

const app: any = new Hono<{ Bindings: Bindings }>()

// Add CORS middleware for development
app.use('*', cors())

// Add logger middleware
app.use('*', logger())

// Middleware to handle errors
app.onError((err, c) => {
	console.error(`Error occurred:`, {
		message: err.message,
		stack: err.stack,
		url: c.req.url,
		method: c.req.method
	})
	return c.json({
		error: 'Internal Server Error',
		message: err.message
	}, 500)
})

// Health check endpoint
app.get('/health', (c) => c.json({ status: 'ok' }))

// Deepseek model endpoint
app.post('/api/deepseek', async (c) => {
	try {
		// Check for API key when configured
		const envApiKey = c.env.DEEPSEEK_API_KEY
		if (envApiKey) {
			const apiKey = c.req.header('X-API-Key')
			if (!apiKey || apiKey !== envApiKey) {
				return c.json({ error: 'Unauthorized. Invalid or missing API key.' }, 401)
			}
		}

		const body = await c.req.json()
		const { messages } = body

		if (!messages || !Array.isArray(messages)) {
			return c.json({ error: 'Invalid request. Messages array is required.' }, 400)
		}

		// Handle case where AI binding might not be available (development)
		if (!c.env.AI) {
			return c.json({ 
				error: 'AI binding not available',
				message: 'This endpoint requires Cloudflare Workers AI binding. Make sure you are deploying to Cloudflare with the proper AI binding configuration.'
			}, 500)
		}

		// Call the AI model
		const stream = await c.env.AI.run(
			'@cf/deepseek-ai/deepseek-r1-distill-qwen-32b' as any,
			{
				messages,
				stream: true,
			} as any
		)

		return new Response(stream as any, {
			headers: { 'content-type': 'text/event-stream' },
		})
	} catch (error) {
		console.error('Error calling Deepseek model:', error)
		return c.json({ 
			error: 'Failed to process request',
			message: error instanceof Error ? error.message : 'Unknown error'
		}, 500)
	}
})

import { handlePayPalWebhook } from './api/paypal-webhook';
import { Context } from 'hono';

app.post('/api/paypal-webhook', async (c: Context<{ Bindings: Bindings }>) => {
  return handlePayPalWebhook(c.req as any);
});

// Serve static assets
app.use('*', serveStatic({ root: './', manifest: '' }))

// Fallback for SPA routing
app.use('*', serveStatic({ path: './index.html', manifest: '' }))

export default app
