import * as React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'text-xs font-bold tracking-wider uppercase whitespace-nowrap',
    'inline-flex items-center justify-center gap-2 shrink-0 rounded-full cursor-pointer outline-none transition-all duration-300',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-invalid:ring-destructive/20 aria-invalid:border-destructive dark:aria-invalid:ring-destructive/40 ',
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    'shadow-sm hover:shadow-md'
  ],
  {
    variants: {
      variant: {
        default: 'bg-button text-button-foreground hover:bg-muted focus:bg-muted',
        destructive: [
          'bg-destructive text-destructive-foreground',
          'hover:bg-destructive-hover focus:bg-destructive-hover focus-visible:ring-destructive-foreground/20',
          'dark:focus-visible:ring-destructive-foreground/40',
          'shadow-sm shadow-red-500/20 hover:shadow-md hover:shadow-red-500/30'
        ],
        outline: [
          'border bg-background',
          'hover:bg-accent hover:text-accent-foreground',
          'dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        ],
        primary: [
          'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
          'hover:from-blue-600 hover:to-indigo-700',
          'focus:from-blue-600 focus:to-indigo-700',
          'shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30'
        ],
        secondary: [
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          'shadow-sm shadow-gray-500/10 hover:shadow-md hover:shadow-gray-500/20'
        ],
        ghost: [
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
          'shadow-none hover:shadow-sm'
        ],
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };