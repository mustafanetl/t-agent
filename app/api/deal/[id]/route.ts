import { NextResponse } from 'next/server';
import { mockDeals } from '@/lib/mock-data';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const deal = mockDeals.find((item) => item.id === params.id);
  if (!deal) {
    return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
  }
  return NextResponse.json({ deal });
}
