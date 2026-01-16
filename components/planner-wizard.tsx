'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

const paceOptions = ['Relaxed', 'Balanced', 'Packed'];

type PlannerResponse = {
  summary: string;
  neighborhoods: { name: string; reason: string }[];
  itinerary: { day: string; morning: string; afternoon: string; evening: string }[];
  foodAndActivities: string[];
  costRanges: string[];
  packingTips: string[];
};

export const PlannerWizard = () => {
  const [budget, setBudget] = React.useState(600);
  const [dates, setDates] = React.useState('Oct 12 - Oct 17');
  const [vibe, setVibe] = React.useState('Food');
  const [party, setParty] = React.useState('Couple');
  const [pace, setPace] = React.useState('Balanced');
  const [notes, setNotes] = React.useState('We love cafes and architecture tours.');
  const [loading, setLoading] = React.useState(false);
  const [plan, setPlan] = React.useState<PlannerResponse | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch('/api/planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ budget, dates, vibe, party, pace, notes })
    });
    const data = await res.json();
    setPlan(data.plan ?? null);
    setLoading(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle>Plan your trip</CardTitle>
          <p className="text-sm text-white/60">Confirm your preferences for the AI itinerary.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Budget per person (€)</Label>
            <div className="mt-2 flex items-center justify-between text-sm text-white/70">
              <span>€200</span>
              <span className="text-lg font-semibold text-white">€{budget}</span>
              <span>€1500</span>
            </div>
            <Slider
              value={[budget]}
              min={200}
              max={1500}
              step={25}
              onValueChange={(value) => setBudget(value[0])}
            />
          </div>
          <div>
            <Label>Dates</Label>
            <Input value={dates} onChange={(event) => setDates(event.target.value)} />
          </div>
          <div>
            <Label>Vibe</Label>
            <Select value={vibe} onValueChange={setVibe}>
              <SelectTrigger>
                <SelectValue placeholder="Select vibe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Culture">Culture</SelectItem>
                <SelectItem value="Nature">Nature</SelectItem>
                <SelectItem value="Beach">Beach</SelectItem>
                <SelectItem value="Romance">Romance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Party</Label>
            <Select value={party} onValueChange={setParty}>
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
            <Label>Pace</Label>
            <Select value={pace} onValueChange={setPace}>
              <SelectTrigger>
                <SelectValue placeholder="Select pace" />
              </SelectTrigger>
              <SelectContent>
                {paceOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
          </div>
          <Button size="lg" onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating…' : 'Generate itinerary'}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {loading && (
          <Card>
            <CardContent className="space-y-4">
              <div className="h-4 w-1/2 rounded-full skeleton" />
              <div className="h-24 rounded-2xl skeleton" />
              <div className="h-24 rounded-2xl skeleton" />
              <div className="h-24 rounded-2xl skeleton" />
            </CardContent>
          </Card>
        )}
        {plan && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">{plan.summary}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Where to stay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.neighborhoods.map((item) => (
                  <div key={item.name} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-white/70">{item.reason}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Day-by-day itinerary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.itinerary.map((day) => (
                  <div key={day.day} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold">{day.day}</p>
                    <div className="mt-2 text-sm text-white/70">
                      <p>Morning: {day.morning}</p>
                      <p>Afternoon: {day.afternoon}</p>
                      <p>Evening: {day.evening}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Food & activities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm text-white/70">
                  {plan.foodAndActivities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cost ranges & packing tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-white/70">
                <div>
                  <p className="font-semibold text-white">Estimated ranges (not exact prices)</p>
                  <ul className="list-disc space-y-1 pl-5">
                    {plan.costRanges.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-white">Packing tips</p>
                  <ul className="list-disc space-y-1 pl-5">
                    {plan.packingTips.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
