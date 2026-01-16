import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const searchInputSchema = z.object({
  userId: z.string(),
  origins: z.array(z.string()),
  tripLength: z.string(),
  departFrom: z.string().optional(),
  departTo: z.string().optional(),
  budget: z.number(),
  vibeTags: z.array(z.string()),
  partyType: z.string()
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const searches = await prisma.search.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ searches });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = searchInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: parsed.data.userId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!user.isPremium) {
    const count = await prisma.search.count({ where: { userId: parsed.data.userId } });
    if (count >= 2) {
      return NextResponse.json({ error: 'Free plan search limit reached' }, { status: 402 });
    }
  }

  const search = await prisma.search.create({
    data: {
      userId: parsed.data.userId,
      origins: parsed.data.origins,
      tripLength: parsed.data.tripLength,
      departFrom: parsed.data.departFrom ?? null,
      departTo: parsed.data.departTo ?? null,
      budget: parsed.data.budget,
      vibeTags: parsed.data.vibeTags,
      partyType: parsed.data.partyType
    }
  });

  return NextResponse.json({ search });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const schema = z.object({ id: z.string() });
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  await prisma.search.delete({ where: { id: parsed.data.id } });
  return NextResponse.json({ ok: true });
}
