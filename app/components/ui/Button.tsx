import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Icon } from './Icon';

type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: string;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  filled:
    'bg-primary text-on-primary hover:shadow-[var(--m3-shadow-1)] active:scale-[0.98]',
  tonal:
    'bg-secondary-container text-on-secondary-container hover:bg-[color-mix(in_srgb,var(--m3-secondary-container),var(--m3-on-secondary-container)_8%)] active:scale-[0.98]',
  outlined:
    'border border-outline text-primary hover:bg-primary/[0.08] active:scale-[0.98]',
  text: 'text-primary hover:bg-primary/[0.08] active:scale-[0.98]',
};

export function Button({
  variant = 'filled',
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-(--m3-duration-medium) ease-(--m3-ease-standard) cursor-pointer disabled:opacity-38 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
}
