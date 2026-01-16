'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const sheetHeights = {
  collapsed: 'h-[25vh]',
  half: 'h-[55vh]',
  full: 'h-[85vh]'
};

type Props = {
  children: React.ReactNode;
};

export const BottomSheet = ({ children }: Props) => {
  const [state, setState] = React.useState<'collapsed' | 'half' | 'full'>('half');

  return (
    <div
      className={cn(
        'bottom-sheet fixed bottom-0 left-0 z-20 w-full rounded-t-3xl border-t border-white/10 bg-slate-950/95 p-4 backdrop-blur md:hidden',
        sheetHeights[state]
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-2">
          {(['collapsed', 'half', 'full'] as const).map((mode) => (
            <button
              key={mode}
              className={cn(
                'h-2 w-8 rounded-full transition',
                state === mode ? 'bg-white' : 'bg-white/30'
              )}
              onClick={() => setState(mode)}
              aria-label={`Set sheet to ${mode}`}
            />
          ))}
        </div>
        <span className="text-xs text-white/50">Tap to resize</span>
      </div>
      <div className="h-full overflow-y-auto pb-10">{children}</div>
    </div>
  );
};
