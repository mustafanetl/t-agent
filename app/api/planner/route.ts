import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fallbackPlan, itinerarySchema } from '@/lib/ai/plan';

const inputSchema = z.object({
  budget: z.number(),
  dates: z.string(),
  vibe: z.string(),
  party: z.string(),
  pace: z.string(),
  notes: z.string().optional()
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = inputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ plan: fallbackPlan, source: 'fallback' });
  }

  const prompt = `You are an expert travel planner. Return ONLY valid JSON in the exact schema:
  { summary: string, neighborhoods: [{name, reason}], itinerary: [{day, morning, afternoon, evening}], foodAndActivities: string[], costRanges: string[], packingTips: string[] }
  Trip details: ${JSON.stringify(parsed.data)}
  Keep cost ranges as ranges, not exact prices.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    }
  );

  if (!response.ok) {
    return NextResponse.json({ plan: fallbackPlan, source: 'fallback' });
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(text);
  } catch (error) {
    return NextResponse.json({ plan: fallbackPlan, source: 'fallback' });
  }

  const validated = itinerarySchema.safeParse(parsedJson);
  if (!validated.success) {
    return NextResponse.json({ plan: fallbackPlan, source: 'fallback' });
  }

  return NextResponse.json({ plan: validated.data, source: 'gemini' });
}
