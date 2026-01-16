import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-sm text-white/60">Manage saved searches and alerts.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Saved searches</CardTitle>
            <CardDescription>Free plan allows 2 saved searches.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/70">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold">London → Lisbon</p>
              <p>Weekend • €150 max • Beach</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold">Paris → Rome</p>
              <p>4-5 days • €200 max • Culture</p>
            </div>
            <Button variant="secondary">Upgrade for unlimited</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Premium status</CardTitle>
            <CardDescription>Manage billing in Stripe.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/70">
            <p>Current plan: Free</p>
            <Button>Manage / cancel</Button>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold">Alert history</p>
              <p className="text-white/60">No alerts yet.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
