import { NextResponse } from "next/server"
import OpenAI from "openai"
import { ChatCompletionMessageParam } from "openai/resources/chat/completions"

// Initialize OpenAI client – expects OPENAI_API_KEY in env
const openai = new OpenAI()

export async function POST(request: Request) {
  try {
    const { state, specificKey, context } = await request.json()

    // Construct a concise prompt for the assistant
    const basePrompt = `You are a seasoned venture analyst helping founders craft compelling narratives for their pitch deck.\n\n` +
      `Based on the startup details provided below, write persuasive, professional prose for the following sections:\n` +
      `• Product / Market Fit (pmf) – 1-2 short paragraphs.\n` +
      `• Business Model & Revenue (biz) – 1-2 short paragraphs.\n` +
      `• Industry Vision (vision) – 1-2 short paragraphs.\n\n` +
      `Return ONLY raw JSON with exactly these keys: {"pmf": string, "biz": string, "vision": string}.\n` +
      `Do not wrap the JSON in markdown.\n\n` +
      `STARTUP DATA:\n${JSON.stringify(state, null, 2)}`

    const userContext = context ? `\n\nADDITIONAL GUIDANCE FROM FOUNDER:\n${context}` : ""

    const targetedPrompt = specificKey
      ? `You are a seasoned venture analyst helping founders craft compelling narratives for their pitch deck.\n\n` +
        `Write the "${specificKey}" section only, as a concise paragraph (max 150 words). Do not return any other text.${userContext}\n\n` +
        `STARTUP DATA:\n${JSON.stringify(state, null, 2)}`
      : basePrompt

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: targetedPrompt },
    ]

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // fast & cost-effective. Change if full 4o is desired.
      temperature: 0.7,
      messages,
    })

    const content = completion.choices[0].message?.content?.trim() || ""

    let narratives: Record<string, string>

    if (specificKey) {
      narratives = { [specificKey]: content }
    } else {
      try {
        narratives = JSON.parse(content)
      } catch (err) {
        // Fallback – if model did not return valid json, send the raw text under pmf key
        narratives = { pmf: content }
      }
    }

    return NextResponse.json({ narratives })
  } catch (error) {
    console.error("/api/generate-narratives error", error)
    return NextResponse.json({ error: "Failed to generate narratives" }, { status: 500 })
  }
} 