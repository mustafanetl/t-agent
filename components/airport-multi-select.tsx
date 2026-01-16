'use client';

import * as React from 'react';
import { airports } from '@/lib/airports';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

type Props = {
  selected: string[];
  onChange: (next: string[]) => void;
};

export const AirportMultiSelect = ({ selected, onChange }: Props) => {
  const [query, setQuery] = React.useState('');

  const filtered = airports.filter((airport) => {
    const label = `${airport.city} ${airport.iata} ${airport.country}`.toLowerCase();
    return label.includes(query.toLowerCase()) && !selected.includes(airport.iata);
  });

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search city or airport"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label="Search city or airport"
      />
      <div className="flex flex-wrap gap-2">
        {selected.length === 0 && (
          <span className="text-xs text-white/50">Select one or more origins.</span>
        )}
        {selected.map((code) => (
          <Badge key={code} className="flex items-center gap-2">
            {code}
            <button
              className="text-white/60 hover:text-white"
              onClick={() => onChange(selected.filter((item) => item !== code))}
              aria-label={`Remove ${code}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      {query && (
        <div className="max-h-40 overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-2">
          {filtered.length === 0 && <p className="p-2 text-xs text-white/50">No matches.</p>}
          {filtered.map((airport) => (
            <button
              key={airport.iata}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10"
              onClick={() => {
                onChange([...selected, airport.iata]);
                setQuery('');
              }}
            >
              <span>
                {airport.city} ({airport.iata})
              </span>
              <span className="text-xs text-white/50">{airport.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
