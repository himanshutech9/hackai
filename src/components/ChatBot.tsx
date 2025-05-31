'use client'

import { useState, useEffect } from 'react'
import { Send, AlertCircle, Heart } from 'lucide-react'
import { processMessage } from '@/lib/openai'
import ChatMessage from './ChatMessage'
import RescueReport from './RescueReport'

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export interface RescueData {
  animalType: string
  issue: string
  location: string
  urgency: 'low' | 'medium' | 'high'
  firstAid: string[]
  reportGenerated: boolean
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rescueData, setRescueData] = useState<RescueData | null>(null)

  // Set initial message after hydration to avoid server/client mismatch
  useEffect(() => {
    setMessages([
      {
        id: '1',
        content: "Hello! I'm Curio, your stray animal rescue assistant. 🐾 I'm here to help you with any stray animal situation you encounter. Please tell me what's happening - describe the animal, its condition, and where you found it.",
        role: 'assistant',
        timestamp: new Date()
      }
    ])
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await processMessage(input, messages)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      if (response.rescueData) {
        setRescueData(response.rescueData)
      }
    } catch (error) {
      console.error('Error processing message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble processing your message right now. Please try again or contact emergency services if this is urgent.",
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-rescue-500 text-white p-4">
        <div className="flex items-center space-x-2">
          <Heart className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Curio Rescue Assistant</h2>
        </div>
        <p className="text-sm opacity-90 mt-1">Helping animals, one rescue at a time</p>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="chat-bubble chat-bubble-bot">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the animal situation you need help with..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </form>

      {/* Emergency Notice */}
      <div className="bg-yellow-50 border-t border-yellow-200 p-3">
        <div className="flex items-center space-x-2 text-yellow-800">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">
            For life-threatening emergencies, contact your local animal emergency services immediately.
          </span>
        </div>
      </div>

      {/* Rescue Report */}
      {rescueData && (
        <div className="border-t">
          <RescueReport data={rescueData} />
        </div>
      )}
    </div>
  )
} 