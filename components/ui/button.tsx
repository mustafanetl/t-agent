import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 disabled:pointer-events-none disabled:opacity-50',
          variant === 'default' && 'bg-white text-slate-900 hover:bg-slate-100',
          variant === 'secondary' && 'bg-white/10 text-white hover:bg-white/20',
          variant === 'outline' && 'border border-white/20 text-white hover:bg-white/10',
          variant === 'ghost' && 'text-white hover:bg-white/10',
          size === 'default' && 'h-10 px-5',
          size === 'sm' && 'h-8 px-3 text-xs',
          size === 'lg' && 'h-12 px-8 text-base',
          size === 'icon' && 'h-10 w-10 rounded-full',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
