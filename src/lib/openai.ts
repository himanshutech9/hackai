import { Message, RescueData } from '@/components/ChatBot'

interface ProcessMessageResponse {
  content: string
  rescueData?: RescueData
}

export async function processMessage(
  userMessage: string, 
  conversationHistory: Message[]
): Promise<ProcessMessageResponse> {
  try {
    // Use server-side API route for production
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        conversationHistory: conversationHistory
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    return data
  } catch (error) {
    console.error('Error processing message:', error)
    throw new Error('Failed to process message')
  }
} 