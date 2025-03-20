/**
 * Development proxy for DeepSeek API requests
 * 
 * This file simulates the Cloudflare Worker AI functionality during local development
 * since Cloudflare bindings are not available in the local environment.
 */

// Check if request includes API key (for development only)
const validateApiKey = (apiKey?: string): boolean => {
  // In development, accept any non-empty API key
  return !!apiKey
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()
    const { messages } = body
    
    // Get API key from headers
    const apiKey = request.headers.get('X-API-Key')
    
    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request. Messages array is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // If API key is provided, validate it
    if (apiKey && !validateApiKey(apiKey)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Invalid API key.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create a text encoder for the stream
    const encoder = new TextEncoder()
    
    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Simulate thinking time
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Extract the last user message for the response
          const lastUserMessage = messages
            .filter((m: any) => m.role === 'user')
            .pop()?.content || ''
          
          // Generate a simulated response
          const simulatedResponse = `This is a simulated response in development mode for: "${lastUserMessage}". 
            
In production with Cloudflare Workers, this would connect to the DeepSeek-R1-Distill-Qwen-32B model.

Key features of this model:
- 80,000 token context window
- State-of-the-art performance for dense models
- Excels at reasoning and creative tasks
- Outperforms OpenAI-o1-mini across benchmarks

To use the actual model, deploy to Cloudflare Workers with the AI binding configured.`
          
          // Send response in chunks to simulate streaming
          let currentPosition = 0
          const chunkSize = 10
          
          while (currentPosition < simulatedResponse.length) {
            const chunk = simulatedResponse.slice(
              currentPosition, 
              Math.min(currentPosition + chunkSize, simulatedResponse.length)
            )
            
            // Format as SSE
            const sseData = `data: ${JSON.stringify({ response: chunk })}\n\n`
            controller.enqueue(encoder.encode(sseData))
            
            currentPosition += chunkSize
            await new Promise(resolve => setTimeout(resolve, 50))
          }
          
          // End the stream
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      }
    })
    
    // Return the stream with the correct headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    })
  } catch (error) {
    console.error('Error in DeepSeek proxy:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
} 