import type { Deal } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Props = {
  deals: Deal[];
  onSelect: (deal: Deal) => void;
};

export const DealsList = ({ deals, onSelect }: Props) => (
  <div className="space-y-4">
    {deals.map((deal) => (
      <Card key={deal.id} className="bg-white/5">
        <CardHeader>
          <CardTitle>{deal.destination}</CardTitle>
          <CardDescription>
            {deal.departFrom} → {deal.departTo} • {deal.provider}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Best price</span>
            <span className="text-lg font-semibold">€{deal.minPrice}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" size="sm" onClick={() => onSelect(deal)}>
            View deal
          </Button>
        </CardFooter>
      </Card>
    ))}
  </div>
);
