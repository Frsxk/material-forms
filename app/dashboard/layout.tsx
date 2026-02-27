'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/app/components/ThemeProvider';
import { Icon } from '@/app/components/ui/Icon';
import { Logo } from '@/app/components/ui/Logo';

type DashboardSection = 'overview' | 'forms' | 'analytics';

const NAV_ITEMS: { icon: string; label: string; section: DashboardSection }[] = [
  { icon: 'bar_chart', label: 'Analytics', section: 'analytics' },
  { icon: 'description', label: 'My Forms', section: 'forms' },
];

function ProfilePopup({ open, onClose, triggerRef }: { open: boolean; onClose: () => void; triggerRef: React.RefObject<HTMLButtonElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        ref.current && !ref.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose, triggerRef]);

  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : user?.email.slice(0, 2).toUpperCase() || 'U';

  return (
    <div
      ref={ref}
      className={`absolute top-14 right-0 w-[min(320px,calc(100vw-2rem))] rounded-3xl bg-surface-container border border-outline-variant shadow-lg z-50 overflow-hidden origin-top-right transition-all duration-200 ease-out ${
        open
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
      }`}
    >

      {/* Avatar + Name + Email */}
      <div className="flex flex-col items-center py-4 px-6">
        <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-semibold text-xl mb-3 uppercase">
          {initials}
        </div>
        <p className="text-base font-semibold text-on-surface">{user?.name || 'User'}</p>
        <p className="text-sm text-on-surface-variant truncate w-full text-center">{user?.email}</p>
      </div>

      <div className="h-px bg-outline-variant mx-4" />

      {/* Actions */}
      <div className="py-2 px-2">
        <button
          onClick={() => {
            onClose();
            logout();
          }}
          className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl hover:bg-surface-container-high transition-colors text-left cursor-pointer"
        >
          <Icon name="logout" size={20} className="text-on-surface-variant ml-1.5 mr-0.5" />
          <span className="text-sm text-on-surface">Sign out</span>
        </button>
      </div>
    </div>
  );
}

import { useAuth } from '@/app/components/AuthProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, toggleTheme } = useTheme();
  const { user, loading } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const avatarRef = useRef<HTMLButtonElement>(null);

  const handleNavClick = (section: DashboardSection) => {
    setActiveSection(section);
    const el = document.getElementById(`section-${section}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = user.name ? user.name.slice(0, 2).toUpperCase() : user.email.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Navigation Rail (desktop) */}
      <aside className="hidden md:flex flex-col items-center w-20 py-6 gap-6 bg-surface border-r border-outline-variant shrink-0">
        <Link href="/" className="mb-4">
          <Logo size={40} />
        </Link>

        <nav className="flex flex-col items-center gap-2 flex-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.section)}
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 cursor-pointer ${
                activeSection === item.section
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
              title={item.label}
            >
              <Icon name={item.icon} size={24} filled={activeSection === item.section} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top App Bar */}
        <header className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 border-b border-outline-variant bg-surface sticky top-0 z-10">
          {/* Mobile: logo + title */}
          <div className="flex items-center gap-3">
            <Link href="/" className="md:hidden">
              <Logo size={32} />
            </Link>
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-on-surface">Dashboard</h1>
              <p className="text-xs md:text-sm text-on-surface-variant hidden sm:block">Manage your forms</p>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2 relative">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} size={20} />
            </button>
            <button
              ref={avatarRef}
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-medium text-sm cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all uppercase"
              aria-label="Account menu"
            >
              {initials}
            </button>
            <ProfilePopup open={profileOpen} onClose={() => setProfileOpen(false)} triggerRef={avatarRef} />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* Bottom Navigation Bar (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container border-t border-outline-variant flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => handleNavClick(item.section)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-2xl transition-colors cursor-pointer ${
              activeSection === item.section
                ? 'text-on-primary-container'
                : 'text-on-surface-variant'
            }`}
          >
            <div className={`px-4 py-1 rounded-full transition-colors ${activeSection === item.section ? 'bg-primary-container' : ''}`}>
              <Icon name={item.icon} size={22} filled={activeSection === item.section} />
            </div>
            <span className="text-[11px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
