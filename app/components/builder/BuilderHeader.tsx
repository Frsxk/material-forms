'use client';

import Link from 'next/link';
import { Icon } from '@/app/components/ui/Icon';
import { Logo } from '@/app/components/ui/Logo';
import { useTheme } from '@/app/components/ThemeProvider';

interface BuilderHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  formId: string;
}

export function BuilderHeader({ title, onTitleChange, formId }: BuilderHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between px-3 md:px-6 h-14 md:h-16 border-b border-outline-variant bg-surface z-10">
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <Link href="/dashboard" className="hover:scale-105 transition-transform shrink-0">
          <Logo size={32} className="md:w-9 md:h-9" />
        </Link>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-sm md:text-base font-medium text-on-surface bg-transparent border-none outline-none px-2 md:px-3 py-1.5 rounded-lg hover:bg-surface-container-high focus:bg-surface-container-high transition-colors w-full max-w-[200px] md:max-w-[300px] truncate"
          placeholder="Untitled Form"
        />
      </div>

      <div className="flex items-center gap-1 md:gap-3 shrink-0">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} size={20} />
        </button>
        <Link
          href={`/builder/${formId}/stats`}
          className="inline-flex items-center gap-2 rounded-full bg-surface-container-high px-3 md:px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest transition-colors"
        >
          <Icon name="bar_chart" size={18} />
          <span className="hidden sm:inline">Stats</span>
        </Link>
        <Link
          href={`/f/${formId}`}
          className="hidden sm:inline-flex items-center gap-2 rounded-full bg-surface-container-high px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest transition-colors"
        >
          <Icon name="visibility" size={18} />
          Preview
        </Link>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 md:px-5 py-2 text-sm font-medium text-on-primary hover:shadow-(--m3-shadow-1) transition-all cursor-pointer">
          <Icon name="publish" size={18} className="sm:hidden" />
          <span className="hidden sm:inline">Publish</span>
        </button>
      </div>
    </header>
  );
}
