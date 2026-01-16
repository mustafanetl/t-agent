'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

export const PlanFlow = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [stage, setStage] = React.useState<'login' | 'paywall'>('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (open) {
      setStage(session?.user ? 'paywall' : 'login');
    }
  }, [open, session]);

  const handleLogin = async () => {
    setLoading(true);
    await signIn('credentials', {
      redirect: false,
      email,
      password
    });
    setStage('paywall');
    setLoading(false);
  };

  const handleCheckout = async () => {
    if (!session?.user?.id || !session.user.email) {
      setStage('login');
      return;
    }

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id, email: session.user.email })
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      router.push('/planner');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {stage === 'login' ? (
          <>
            <DialogHeader>
              <DialogTitle>Sign in to continue</DialogTitle>
              <DialogDescription>Save searches and unlock premium planning.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <Button className="w-full" onClick={handleLogin} disabled={loading}>
                {loading ? 'Signing in…' : 'Continue'}
              </Button>
              <p className="text-xs text-white/60">No account? We’ll create one instantly.</p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Premium €5/mo</DialogTitle>
              <DialogDescription>Cancel anytime. Unlock AI itineraries and alerts.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm text-white/70">
              <ul className="space-y-2">
                <li>• AI itinerary with neighborhoods & budget ranges</li>
                <li>• Price-drop alerts sent by email</li>
                <li>• Unlimited saved searches</li>
              </ul>
              <Button className="w-full" onClick={handleCheckout}>
                Continue to Stripe Checkout
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
                Not now
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
