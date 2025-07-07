import { NextResponse } from "next/server"
import OpenAI from "openai"
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions"

const openai = new OpenAI()

export async function POST(request: Request) {
  try {
    const { tags } = await request.json() as { tags: string[] }

    if (!tags || tags.length === 0) {
      return NextResponse.json({ error: "No tags provided" }, { status: 400 })
    }

    const prompt = `You are an expert startup mentor in the pet-care space.\n` +
      `Based on the following category tags, suggest three compelling problem statements and three matching strength statements for a founder's pitch.\n` +
      `Tags: ${tags.join(", ")}.\n\n` +
      `Return raw JSON exactly in this shape (no markdown): { "problems": string[], "strengths": string[] } where each array has 3 elements.`

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ]

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages,
    })

    const content = completion.choices[0].message?.content?.trim() || ""

    let out: { problems: string[]; strengths: string[] }
    try {
      out = JSON.parse(content)
    } catch {
      // fallback: split by newline
      const lines = content.split("\n").filter(Boolean)
      out = {
        problems: lines.slice(0, 3),
        strengths: lines.slice(3, 6),
      }
    }

    return NextResponse.json(out)
  } catch (err) {
    console.error("/api/generate-problem error", err)
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
} 