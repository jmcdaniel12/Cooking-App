import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

export async function POST(req: NextRequest) {
  const { url } = await req.json()

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  // 1. Fetch the page HTML
  let html: string
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MiseEnPlace/1.0; recipe importer)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(12000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    html = await res.text()
  } catch (err) {
    return NextResponse.json({ error: `Could not fetch URL: ${(err as Error).message}` }, { status: 422 })
  }

  // 2. Strip HTML down to readable text (remove scripts, styles, nav, footer)
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{3,}/g, '\n')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, '')
    .trim()
    .slice(0, 18000) // cap tokens sent to Claude

  // 3. Send to Claude API
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  const prompt = `You are a recipe extraction assistant. Extract the recipe from the following webpage text and return ONLY a valid JSON object — no markdown, no backticks, no explanation.

The JSON must match this exact structure:
{
  "name": "Recipe name",
  "cuisine": "e.g. Italian, Mexican, American",
  "time": 30,
  "servings": 4,
  "tags": ["dinner", "quick"],
  "ingredients": ["ingredient 1, amount", "ingredient 2, amount"],
  "steps": ["Step 1 text", "Step 2 text"],
  "notes": "Any tips or notes from the recipe (optional, empty string if none)"
}

Rules:
- "time" must be a number (total minutes, combine prep + cook if both given)
- "servings" must be a number
- "tags" should include relevant tags from: breakfast, lunch, dinner, quick, vegetarian, vegan, protein, dessert, snack
- "ingredients" should be formatted as "ingredient name, amount" (e.g. "chicken thighs, 4" or "olive oil, 3 tbsp")
- "steps" should be clear, concise sentences — one action per step
- If you cannot find a recipe in this text, return: {"error": "No recipe found"}

Webpage text:
${stripped}`

  let claudeRes: Response
  try {
    claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
  } catch (err) {
    return NextResponse.json({ error: `Claude API error: ${(err as Error).message}` }, { status: 500 })
  }

  const claudeData = await claudeRes.json()
  const text = claudeData?.content?.[0]?.text

  if (!text) {
    return NextResponse.json({ error: 'No response from Claude' }, { status: 500 })
  }

  // 4. Parse the JSON response
  try {
    // Claude might still wrap in backticks despite instructions — strip just in case
    const clean = text.replace(/```json|```/g, '').trim()
    const recipe = JSON.parse(clean)

    if (recipe.error) {
      return NextResponse.json({ error: recipe.error }, { status: 422 })
    }

    return NextResponse.json({ recipe })
  } catch {
    return NextResponse.json({ error: 'Failed to parse recipe from response' }, { status: 500 })
  }
}
