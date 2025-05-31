import { Message } from './ChatBot'
import { User, Bot } from 'lucide-react'

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  
  // Use a more consistent timestamp format to avoid hydration issues
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex space-x-2 max-w-xs lg:max-w-md ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary-500' : 'bg-gray-200'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-gray-600" />
          )}
        </div>
        
        <div className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <p className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    </div>
  )
} 