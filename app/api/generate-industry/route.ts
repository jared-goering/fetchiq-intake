import { NextResponse } from "next/server"
import OpenAI from "openai"
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions/completions"

const openai = new OpenAI()

export async function POST(request: Request) {
  try {
    const { state, specificKey, context } = await request.json()

    const basePrompt = `You are a startup analyst helping founders craft the "Industry Fit" section of their pitch.\n\n` +
      `Generate concise, clear prose for each of these keys:\n` +
      `• industryFit – a 1-2 paragraph overview of how the company fits the pet-care / animal-health industry.\n` +
      `• industryFitAlt – an alternative framing (different angle / wording).\n` +
      `• productDescription – a single paragraph describing the product or service.\n\n` +
      `Return ONLY raw JSON with exactly {"industryFit": string, "industryFitAlt": string, "productDescription": string}.\n` +
      `Do not wrap in markdown.\n\n` +
      `STARTUP DATA:\n${JSON.stringify(state, null, 2)}`

    const userContext = context ? `\n\nADDITIONAL GUIDANCE FROM FOUNDER:\n${context}` : ""

    const prompt = specificKey
      ? `You are a startup analyst helping founders craft the \"Industry Fit\" section of their pitch.\n\n` +
        `Write the \"${specificKey}\" field only (max 150 words). Return plain text.${userContext}\n\n` +
        `STARTUP DATA:\n${JSON.stringify(state, null, 2)}`
      : basePrompt

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ]

    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages,
    })

    const content = resp.choices[0].message?.content?.trim() || ""

    let out: Record<string, string>
    if (specificKey) {
      out = { [specificKey]: content }
    } else {
      try {
        out = JSON.parse(content)
      } catch {
        out = { industryFit: content }
      }
    }

    return NextResponse.json({ content: out })
  } catch (err) {
    console.error("/api/generate-industry error", err)
    return NextResponse.json({ error: "Failed to generate industry content" }, { status: 500 })
  }
} 