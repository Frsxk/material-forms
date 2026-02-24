import { Icon } from './Icon';

type FABSize = 'small' | 'medium' | 'large';

interface FABProps {
  icon: string;
  label?: string;
  size?: FABSize;
  onClick?: () => void;
  className?: string;
}

const sizeClasses: Record<FABSize, string> = {
  small: 'w-10 h-10 rounded-[var(--m3-shape-md)]',
  medium: 'w-14 h-14 rounded-[var(--m3-shape-lg)]',
  large: 'w-24 h-24 rounded-[var(--m3-shape-xl)]',
};

export function FAB({ icon, label, size = 'medium', onClick, className = '' }: FABProps) {
  if (label) {
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-3 px-4 h-14 rounded-(--m3-shape-lg) bg-primary-container text-on-primary-container shadow-(--m3-shadow-3) hover:shadow-(--m3-shadow-4) transition-all duration-(--m3-duration-medium) ease-(--m3-ease-spring) hover:scale-105 active:scale-[0.98] cursor-pointer ${className}`}
      >
        <Icon name={icon} size={24} />
        <span className="text-sm font-medium pr-1">{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center bg-primary-container text-on-primary-container shadow-(--m3-shadow-3) hover:shadow-(--m3-shadow-4) transition-all duration-(--m3-duration-medium) ease-(--m3-ease-spring) hover:scale-110 active:scale-[0.98] cursor-pointer ${sizeClasses[size]} ${className}`}
    >
      <Icon name={icon} size={size === 'large' ? 36 : 24} />
    </button>
  );
}
