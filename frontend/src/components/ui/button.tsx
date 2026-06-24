import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-[#007AFF] text-white hover:bg-[#007AFF]/90',
  secondary: 'bg-[#F2F2F7] text-[#007AFF] hover:bg-[#E5E5EA]',
  destructive: 'bg-[#FF3B30] text-white hover:bg-[#FF3B30]/90',
  outline: 'bg-transparent text-[#007AFF] border border-[#007AFF] hover:bg-[#007AFF]/5',
  ghost: 'bg-transparent text-[#007AFF] hover:bg-[#F2F2F7]',
  link: 'bg-transparent text-[#007AFF] underline-offset-4 hover:underline p-0 h-auto',
};

const sizes = {
  sm: 'h-7 px-3 text-[13px]',
  md: 'h-10 px-5 text-[15px]',
  lg: 'h-12 px-8 text-[17px]',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 active:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          variants[variant],
          variant !== 'link' && sizes[size],
          (disabled || isLoading) && 'opacity-40 cursor-not-allowed active:opacity-40',
          className
        )}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
