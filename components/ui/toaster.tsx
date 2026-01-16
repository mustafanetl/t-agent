'use client';

import { ToastProvider, useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const ToastViewport = () => {
  const { toasts, remove } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="w-80 rounded-2xl border border-white/10 bg-slate-900 p-4 text-white shadow-xl"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.description && <p className="text-xs text-white/70">{toast.description}</p>}
            </div>
            <Button variant="ghost" size="sm" onClick={() => remove(toast.id)}>
              Close
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export const Toaster = () => (
  <ToastProvider>
    <ToastViewport />
  </ToastProvider>
);
