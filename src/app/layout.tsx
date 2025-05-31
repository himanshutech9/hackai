import './globals.css'
import React from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Curio - Stray Animal Rescue Chatbot',
  description: 'AI-powered chatbot to help with stray animal rescue and first aid',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
} 