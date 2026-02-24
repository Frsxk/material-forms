'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/app/components/ThemeProvider';
import { Icon } from '@/app/components/ui/Icon';
import { Logo } from '@/app/components/ui/Logo';

export function LandingHeader() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-outline-variant/50">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={36} />
          <span className="text-lg font-semibold text-on-surface">Material Forms</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/login"
            className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-on-primary hover:shadow-(--m3-shadow-1) transition-all duration-300"
          >
            Get Started
          </Link>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} size={20} />
          </button>
        </nav>

        {/* Mobile buttons */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} size={20} />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <Icon name={mobileOpen ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out border-t border-outline-variant/50 ${
          mobileOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 border-t-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-3 bg-surface/95 backdrop-blur-lg">
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <Icon name="login" size={20} />
            Sign In
          </Link>
          <Link
            href="/register"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-on-primary bg-primary hover:shadow-(--m3-shadow-1) transition-all"
          >
            <Icon name="rocket_launch" size={20} />
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
