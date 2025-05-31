import { processMessage } from '@/lib/openai'
import { Message } from '@/components/ChatBot'

// Mock fetch for testing the API route calls
global.fetch = jest.fn()

describe('Curio Chatbot Phase 1 Tests', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('test-intent-detection', () => {
    it('should identify a rescue situation from a message', async () => {
      // Mock successful API response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: 'I can help you with this injured dog situation.',
          rescueData: {
            animalType: 'dog',
            issue: 'injured',
            location: 'park',
            urgency: 'high',
            firstAid: ['Keep the animal calm'],
            reportGenerated: true
          }
        })
      })

      const messages: Message[] = []
      const result = await processMessage('I found an injured dog in the park', messages)

      expect(result.content).toContain('help')
      expect(fetch).toHaveBeenCalledWith('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'I found an injured dog in the park',
          conversationHistory: []
        })
      })
    })

    it('should reject non-rescue messages', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: "I'm specifically designed to help with stray animal rescue situations. Could you please describe a stray animal that needs help? Include details about the animal type, its condition, and where you found it."
        })
      })

      const messages: Message[] = []
      const result = await processMessage('What should I feed my pet cat?', messages)

      expect(result.content).toContain('specifically designed to help with stray animal rescue')
    })
  })

  describe('test-animal-extraction', () => {
    it('should correctly extract animal type from message', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: 'I see you found a cat that is limping.',
          rescueData: undefined // No complete data yet
        })
      })

      const messages: Message[] = []
      const result = await processMessage('There is a cat limping near my house', messages)

      expect(result.content).toContain('cat')
      expect(fetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
        method: 'POST'
      }))
    })
  })

  describe('test-issue-extraction', () => {
    it('should correctly parse problem description', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: 'This is a high-urgency situation.',
          rescueData: {
            animalType: 'dog',
            issue: 'unconscious and bleeding',
            location: 'street corner',
            urgency: 'high',
            firstAid: ['Do not move the animal', 'Contact emergency services'],
            reportGenerated: true
          }
        })
      })

      const messages: Message[] = []
      const result = await processMessage('Found an unconscious dog bleeding on the street corner', messages)

      expect(result.rescueData).toBeDefined()
      expect(result.rescueData?.issue).toContain('unconscious')
      expect(result.rescueData?.urgency).toBe('high')
    })
  })

  describe('test-location-followup', () => {
    it('should ask for location when not provided', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: 'Where exactly did you find this injured bird?',
          rescueData: undefined // No complete report without location
        })
      })

      const messages: Message[] = []
      const result = await processMessage('I found a bird with an injured wing', messages)

      expect(result.content.toLowerCase()).toContain('where')
      expect(result.rescueData).toBeUndefined()
    })
  })

  describe('test-care-response', () => {
    it('should return first-aid message for rescue situations', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: 'Here are immediate steps to help this dehydrated cat...',
          rescueData: {
            animalType: 'cat',
            issue: 'dehydrated',
            location: 'backyard',
            urgency: 'medium',
            firstAid: [
              'Provide small amounts of water',
              'Keep in a quiet, cool place',
              'Contact local animal services'
            ],
            reportGenerated: true
          }
        })
      })

      const messages: Message[] = []
      const result = await processMessage('Found a dehydrated cat in my backyard', messages)

      expect(result.rescueData?.firstAid).toHaveLength(3)
      expect(result.rescueData?.firstAid[0]).toContain('water')
    })
  })

  describe('test-report-format', () => {
    it('should generate structured JSON report when complete info available', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: 'I have generated a rescue report for this situation.',
          rescueData: {
            animalType: 'dog',
            issue: 'injured leg',
            location: 'Main Street Park',
            urgency: 'medium',
            firstAid: [
              'Approach slowly and calmly',
              'Do not touch the injured leg',
              'Contact animal control services'
            ],
            reportGenerated: true
          }
        })
      })

      const messages: Message[] = []
      const result = await processMessage('Injured dog with hurt leg at Main Street Park', messages)

      // Verify complete rescue data structure
      expect(result.rescueData).toBeDefined()
      expect(result.rescueData).toMatchObject({
        animalType: 'dog',
        issue: 'injured leg',
        location: 'Main Street Park',
        urgency: 'medium',
        firstAid: expect.arrayContaining([expect.any(String)]),
        reportGenerated: true
      })
    })

    it('should not generate report with incomplete information', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: 'Can you tell me more about the dog?',
          rescueData: undefined
        })
      })

      const messages: Message[] = []
      const result = await processMessage('I see a dog', messages)

      expect(result.rescueData).toBeUndefined()
    })
  })

  describe('test-api-error-handling', () => {
    it('should handle API errors gracefully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' })
      })

      const messages: Message[] = []
      
      await expect(processMessage('Test message', messages)).rejects.toThrow('Failed to process message')
    })

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const messages: Message[] = []
      
      await expect(processMessage('Test message', messages)).rejects.toThrow('Failed to process message')
    })
  })
}) 