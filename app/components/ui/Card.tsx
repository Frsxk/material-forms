import { type ReactNode } from 'react';

type CardVariant = 'elevated' | 'filled' | 'outlined';

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

const variantClasses: Record<CardVariant, string> = {
  elevated:
    'bg-surface-container-low shadow-[var(--m3-shadow-1)] hover:shadow-[var(--m3-shadow-2)]',
  filled:
    'bg-surface-container-highest',
  outlined:
    'bg-surface border border-outline-variant',
};

export function Card({ variant = 'elevated', className = '', children, onClick }: CardProps) {
  const interactive = onClick ? 'cursor-pointer active:scale-[0.99]' : '';

  return (
    <div
      className={`rounded-(--m3-shape-md) p-6 transition-all duration-(--m3-duration-medium) ease-(--m3-ease-standard) ${variantClasses[variant]} ${interactive} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
