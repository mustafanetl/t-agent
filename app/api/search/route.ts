import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getFlightProvider } from '@/lib/providers/flight';

const searchSchema = z.object({
  origins: z.array(z.string().min(2)).min(1),
  tripLength: z.string(),
  partyType: z.string(),
  vibeTags: z.array(z.string()),
  budget: z.number(),
  directOnly: z.boolean()
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = searchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid search payload' }, { status: 400 });
  }

  const provider = getFlightProvider();
  const deals = await provider.searchDeals(parsed.data);

  return NextResponse.json({ deals, provider: provider.name });
}
