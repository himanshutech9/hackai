import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Check if this is about a stray animal
    const isRescueSituation = await detectRescueIntent(message)
    
    if (!isRescueSituation) {
      return NextResponse.json({
        content: "I'm specifically designed to help with stray animal rescue situations. Could you please describe a stray animal that needs help? Include details about the animal type, its condition, and where you found it."
      })
    }

    // Extract information from the message
    const extractedData = await extractRescueInfo(message, conversationHistory)
    
    // Generate response with first aid tips
    const response = await generateRescueResponse(message, extractedData, conversationHistory)
    
    // Only return rescue data if all required fields are present
    const hasCompleteData = extractedData.animalType && 
                           extractedData.issue && 
                           extractedData.location &&
                           extractedData.urgency &&
                           extractedData.firstAid

    return NextResponse.json({
      content: response,
      rescueData: hasCompleteData ? extractedData : undefined
    })

  } catch (error) {
    console.error('Error processing chat message:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

async function detectRescueIntent(message: string): Promise<boolean> {
  const prompt = `
Analyze this message and determine if it's about a stray animal that needs rescue or help.

Message: "${message}"

Respond with only "YES" if the message is about:
- A stray, lost, or abandoned animal
- An injured animal
- An animal in distress or danger
- Someone asking for help with an animal they found

Respond with only "NO" if the message is about:
- Pet care questions for owned animals
- General animal information
- Unrelated topics

Response:`

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 10,
    temperature: 0
  })

  return completion.choices[0]?.message?.content?.trim().toUpperCase() === 'YES'
}

async function extractRescueInfo(message: string, history: any[]): Promise<any> {
  const conversationContext = history.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')
  
  const prompt = `
Extract rescue information from this conversation. If information is missing, leave the field empty.

Conversation:
${conversationContext}
Latest message: "${message}"

Extract and return ONLY a JSON object with these fields:
{
  "animalType": "type of animal (dog, cat, bird, etc.) or empty string",
  "issue": "description of the problem/condition or empty string", 
  "location": "where the animal was found or empty string",
  "urgency": "low, medium, or high based on severity",
  "firstAid": ["array of specific first aid tips relevant to this situation"],
  "reportGenerated": true
}

Important: 
- Only include specific, actionable first aid tips
- Set urgency to "high" for severe injuries, "medium" for moderate issues, "low" for minor concerns
- Return valid JSON only, no other text

JSON:`

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
    temperature: 0.3
  })

  try {
    const response = completion.choices[0]?.message?.content?.trim() || '{}'
    return JSON.parse(response)
  } catch (error) {
    console.error('Error parsing extracted data:', error)
    return { reportGenerated: false }
  }
}

async function generateRescueResponse(
  message: string, 
  extractedData: any,
  history: any[]
): Promise<string> {
  const conversationContext = history.slice(-3).map(msg => `${msg.role}: ${msg.content}`).join('\n')
  
  const prompt = `
You are Curio, a compassionate AI assistant specialized in stray animal rescue. 

Current situation:
- Animal type: ${extractedData.animalType || 'not specified'}
- Issue: ${extractedData.issue || 'not specified'}
- Location: ${extractedData.location || 'not specified'}

User message: "${message}"

Previous conversation:
${conversationContext}

Respond with empathy and provide:
1. Acknowledgment of their concern
2. Specific, actionable advice for this situation
3. First aid tips if relevant
4. Request for missing information (location, animal type, or condition) if needed
5. Encouragement and reassurance

Keep your response helpful, concise (2-3 paragraphs), and focused on immediate next steps.
Always prioritize animal and human safety.

Response:`

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 400,
    temperature: 0.7
  })

  return completion.choices[0]?.message?.content?.trim() || "I understand you need help with an animal situation. Could you provide more details about what you're seeing?"
} 