'use client'

import { forwardRef } from 'react'
import Link, { LinkProps } from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'group relative inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        gradient: 'bg-gradient-to-r from-primary to-blue-600 text-white hover:opacity-90 shadow-sm transition-all duration-300',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-8 text-base',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface ButtonLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
  VariantProps<typeof buttonVariants>,
  LinkProps {
  external?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, children, variant, size, isLoading = false, disabled, href, external = false, ...props }, ref) => {
    const linkProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
    
    const content = (
      <>
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
        
        {variant !== 'link' && variant !== 'ghost' && (
          <span className="absolute inset-0 overflow-hidden rounded-md">
            <span className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-white/10 group-active:scale-100 group-active:opacity-0 transition-all duration-300" />
          </span>
        )}
      </>
    );
    
    if (external) {
      return (
        <a
          className={cn(buttonVariants({ variant, size, className }))}
          href={typeof href === 'string' ? href : href.toString()}
          ref={ref}
          {...linkProps}
          {...props}
        >
          {content}
        </a>
      );
    }
    
    return (
      <Link
        className={cn(buttonVariants({ variant, size, className }))}
        href={href}
        ref={ref}
        {...props}
      >
        {content}
      </Link>
    );
  }
);

ButtonLink.displayName = 'ButtonLink';

export { ButtonLink, buttonVariants } 