'use client';

import * as React from 'react';
import { SearchPanel } from '@/components/search-panel';
import { DealsMap } from '@/components/deals-map';
import { DealsList } from '@/components/deals-list';
import { DealDrawer } from '@/components/deal-drawer';
import { PlanFlow } from '@/components/plan-flow';
import { BottomSheet } from '@/components/bottom-sheet';
import type { Deal } from '@/lib/types';
import { mockDeals } from '@/lib/mock-data';

export default function HomePage() {
  const [deals, setDeals] = React.useState<Deal[]>(mockDeals.slice(0, 12));
  const [loading, setLoading] = React.useState(false);
  const [selectedDeal, setSelectedDeal] = React.useState<Deal | null>(null);
  const [showPlanFlow, setShowPlanFlow] = React.useState(false);

  return (
    <div className="relative">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[380px_1fr]">
        <aside className="hidden md:block">
          <SearchPanel onSearch={setDeals} onLoading={setLoading} />
        </aside>
        <section className="flex h-[80vh] flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Europe flight deals</h1>
              <p className="text-sm text-white/60">Browse up to 15 best-value destinations.</p>
            </div>
            <div className="hidden md:block text-xs text-white/50">Updated just now</div>
          </div>
          <div className="relative flex-1">
            <div className="absolute inset-0">
              <DealsMap
                deals={deals.slice(0, 15)}
                selectedDealId={selectedDeal?.id}
                onSelect={setSelectedDeal}
              />
            </div>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-slate-950/70">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-full border border-white/30 border-t-white animate-spin" />
                  <p className="text-sm text-white/70">Scanning deals across Europe…</p>
                </div>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <h2 className="mb-3 text-lg font-semibold">Top picks</h2>
            <DealsList deals={deals.slice(0, 6)} onSelect={setSelectedDeal} />
          </div>
        </section>
      </div>

      <BottomSheet>
        <div className="space-y-6">
          <SearchPanel onSearch={setDeals} onLoading={setLoading} />
          <div>
            <h2 className="mb-3 text-lg font-semibold">Top picks</h2>
            <DealsList deals={deals.slice(0, 6)} onSelect={setSelectedDeal} />
          </div>
        </div>
      </BottomSheet>

      <DealDrawer
        deal={selectedDeal}
        open={!!selectedDeal}
        onOpenChange={(open) => !open && setSelectedDeal(null)}
        onPlan={() => setShowPlanFlow(true)}
      />
      <PlanFlow open={showPlanFlow} onOpenChange={setShowPlanFlow} />
    </div>
  );
}
