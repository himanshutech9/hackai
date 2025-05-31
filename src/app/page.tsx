import ChatBot from '@/components/ChatBot'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🐾 Curio</h1>
          <p className="text-lg text-gray-600 mb-4">
            AI-Powered Stray Animal Rescue Assistant
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            I'm here to help you handle stray animal situations with care and efficiency. 
            Tell me about what you're seeing, and I'll guide you through the best steps to help.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <ChatBot />
        </div>
      </div>
    </main>
  )
} 