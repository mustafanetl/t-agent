import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold">Simple pricing</h1>
        <p className="mt-2 text-sm text-white/60">Cancel anytime. No hidden fees.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <p className="text-sm text-white/60">Explore up to 2 saved searches.</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-white/70">
              <li>• Browse Europe deal map</li>
              <li>• Save 2 searches</li>
              <li>• Top picks list</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Keep browsing</Button>
          </CardFooter>
        </Card>
        <Card className="border-white/30 bg-white/10">
          <CardHeader>
            <CardTitle>Premium €5/mo</CardTitle>
            <p className="text-sm text-white/60">AI itineraries + unlimited alerts.</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-white/70">
              <li>• AI itinerary builder</li>
              <li>• Unlimited saved searches</li>
              <li>• Price-drop alerts</li>
              <li>• Priority deal refresh</li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-3">
            <Button size="lg">Subscribe</Button>
            <span className="text-xs text-white/50">Cancel anytime.</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
