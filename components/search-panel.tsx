'use client';

import * as React from 'react';
import { AirportMultiSelect } from '@/components/airport-multi-select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Deal, SearchInput } from '@/lib/types';

const vibeOptions = [
  'Clubbing',
  'Romance',
  'Chilling',
  'Beach',
  'Nature',
  'Food',
  'Culture',
  'Adventure'
];

type Props = {
  onSearch: (deals: Deal[]) => void;
  onLoading: (loading: boolean) => void;
};

export const SearchPanel = ({ onSearch, onLoading }: Props) => {
  const [origins, setOrigins] = React.useState<string[]>(['LHR']);
  const [tripLength, setTripLength] = React.useState('Weekend');
  const [partyType, setPartyType] = React.useState('Single');
  const [vibes, setVibes] = React.useState<string[]>(['Food']);
  const [budget, setBudget] = React.useState(150);
  const [directOnly, setDirectOnly] = React.useState(false);

  const toggleVibe = (vibe: string) => {
    setVibes((prev) =>
      prev.includes(vibe) ? prev.filter((item) => item !== vibe) : [...prev, vibe]
    );
  };

  const handleSearch = async () => {
    onLoading(true);
    const payload: SearchInput = {
      origins,
      tripLength,
      partyType,
      vibeTags: vibes,
      budget,
      directOnly
    };

    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    onSearch(data.deals ?? []);
    onLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-5">
        <div>
          <Label>Where are you flying from?</Label>
          <AirportMultiSelect selected={origins} onChange={setOrigins} />
        </div>
        <div>
          <Label>Trip length</Label>
          <Select value={tripLength} onValueChange={setTripLength}>
            <SelectTrigger>
              <SelectValue placeholder="Select length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Weekend">Weekend</SelectItem>
              <SelectItem value="4-5 days">4–5 days</SelectItem>
              <SelectItem value="1 week">1 week</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Party</Label>
          <Select value={partyType} onValueChange={setPartyType}>
            <SelectTrigger>
              <SelectValue placeholder="Select party" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Single">Single</SelectItem>
              <SelectItem value="Couple">Couple</SelectItem>
              <SelectItem value="Friends">Friends</SelectItem>
              <SelectItem value="Family">Family</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Vibe</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {vibeOptions.map((vibe) => (
              <button
                key={vibe}
                onClick={() => toggleVibe(vibe)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  vibes.includes(vibe)
                    ? 'border-white bg-white text-slate-900'
                    : 'border-white/20 text-white/70 hover:bg-white/10'
                }`}
              >
                {vibe}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>Budget (max price)</Label>
          <div className="mt-2 flex items-center justify-between text-sm text-white/70">
            <span>€50</span>
            <span className="text-lg font-semibold text-white">€{budget}</span>
            <span>€300</span>
          </div>
          <Slider
            value={[budget]}
            min={50}
            max={300}
            step={5}
            onValueChange={(value) => setBudget(value[0])}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Direct flights only</Label>
            <p className="text-xs text-white/50">Filter for direct routes.</p>
          </div>
          <Switch checked={directOnly} onCheckedChange={setDirectOnly} />
        </div>
        <Button className="w-full" size="lg" onClick={handleSearch}>
          Search deals
        </Button>
        <div className="flex flex-wrap gap-2">
          <Badge>Trusted data</Badge>
          <Badge>AI-ready itineraries</Badge>
        </div>
      </Card>
    </div>
  );
};
