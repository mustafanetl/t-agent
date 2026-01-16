'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Deal } from '@/lib/types';

type Props = {
  deal: Deal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlan: () => void;
};

export const DealDrawer = ({ deal, open, onOpenChange, onPlan }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{deal?.destination ?? 'Deal details'}</DialogTitle>
        <DialogDescription>
          {deal ? `${deal.departFrom} → ${deal.departTo}` : 'Details coming soon.'}
        </DialogDescription>
      </DialogHeader>
      {deal && (
        <div className="space-y-4 text-sm text-white/70">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Route</p>
            <p className="text-base text-white">Multiple origins → {deal.destination}</p>
            <p className="text-white/70">Direct or 1-stop options available.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Price</p>
            <p className="text-2xl font-semibold text-white">€{deal.minPrice}</p>
            <p className="text-white/70">Includes carry-on. Limited availability.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Button size="lg" onClick={onPlan}>
              Plan my trip
            </Button>
            <Button variant="outline" size="lg">
              Save search
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);
