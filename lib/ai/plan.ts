import { z } from 'zod';

export const itinerarySchema = z.object({
  summary: z.string(),
  neighborhoods: z.array(z.object({ name: z.string(), reason: z.string() })),
  itinerary: z.array(
    z.object({
      day: z.string(),
      morning: z.string(),
      afternoon: z.string(),
      evening: z.string()
    })
  ),
  foodAndActivities: z.array(z.string()),
  costRanges: z.array(z.string()),
  packingTips: z.array(z.string())
});

export type Itinerary = z.infer<typeof itinerarySchema>;

export const fallbackPlan: Itinerary = {
  summary:
    'A balanced five-day escape centered on local food markets, walkable neighborhoods, and relaxed cultural highlights.',
  neighborhoods: [
    { name: 'Old Town Core', reason: 'Walkable access to historic landmarks and cafes.' },
    { name: 'Riverside District', reason: 'Evening promenades and sunset dining options.' }
  ],
  itinerary: [
    {
      day: 'Day 1',
      morning: 'Arrival, coffee crawl, and light walking tour.',
      afternoon: 'Museum visit and relaxed lunch.',
      evening: 'Sunset viewpoint and casual tapas.'
    },
    {
      day: 'Day 2',
      morning: 'Market breakfast and neighborhood stroll.',
      afternoon: 'Architecture highlights and shopping lanes.',
      evening: 'Rooftop dinner reservation.'
    },
    {
      day: 'Day 3',
      morning: 'Day trip or coastal escape.',
      afternoon: 'Beach or park downtime.',
      evening: 'Live music and local bar.'
    }
  ],
  foodAndActivities: ['Chef’s tasting menu reservation', 'Street food tour', 'Local bakery crawl'],
  costRanges: ['Meals: €15-€40', 'Attractions: €10-€30', 'Transit: €8-€20'],
  packingTips: ['Comfortable walking shoes', 'Light jacket for evenings', 'Portable charger']
};
