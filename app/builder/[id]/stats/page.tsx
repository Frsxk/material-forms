'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFormStats } from '@/lib/api';
import type { FormStats } from '@/lib/types';
import { Icon } from '@/app/components/ui/Icon';
import { Logo } from '@/app/components/ui/Logo';
import { useTheme } from '@/app/components/ThemeProvider';
import { useAuth } from '@/app/components/AuthProvider';

const RAIL_ITEMS = [
  { icon: 'edit_note', label: 'Properties', href: 'editor' },
  { icon: 'palette', label: 'Theme', href: 'editor' },
  { icon: 'bar_chart', label: 'Stats', active: true },
];

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;
  const { theme, toggleTheme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  
  const [stats, setStats] = useState<FormStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading || !user) return;

    getFormStats(formId)
      .then(setStats)
      .catch((err) => {
        setError(err.message || 'Failed to load statistics');
      })
      .finally(() => setLoading(false));
  }, [formId, user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="h-screen bg-surface flex items-center justify-center">
        <div className="p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mx-auto mb-4">
            <Icon name="error" size={32} />
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2">Error Loading Stats</h2>
          <p className="text-on-surface-variant mb-6">{error || 'Data not found'}</p>
          <button
            onClick={() => router.push(`/builder/${formId}`)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-on-primary hover:shadow-md transition-all cursor-pointer"
          >
            <Icon name="arrow_back" size={18} />
            Back to Editor
          </button>
        </div>
      </div>
    );
  }

  const formTitle = stats.formTitle ?? 'Form Statistics';

  return (
    <div className="h-screen flex flex-col bg-surface overflow-hidden">
      {/* Header — consistent with builder */}
      <header className="flex items-center justify-between px-3 md:px-6 h-14 md:h-16 border-b border-outline-variant bg-surface z-10">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <Link href="/dashboard" className="hover:scale-105 transition-transform shrink-0">
            <Logo size={32} className="md:w-9 md:h-9" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm md:text-base font-medium text-on-surface px-2 md:px-3 py-1 truncate max-w-[200px] md:max-w-[300px]">
              {formTitle}
            </h1>
            <span className="text-[10px] md:text-xs text-on-surface-variant px-2 md:px-3 font-medium">
              Response Analytics
            </span>
          </div>
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
            href={`/builder/${formId}`}
            className="inline-flex items-center gap-2 rounded-full bg-surface-container-high px-3 md:px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest transition-colors"
          >
            <Icon name="edit" size={16} />
            <span className="hidden sm:inline">Back to Editor</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Navigation Rail — consistent with builder */}
        <aside className="hidden md:flex flex-col items-center w-16 py-6 gap-4 bg-surface border-r border-outline-variant shrink-0 relative z-10">
          {RAIL_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (!item.active) {
                  router.push(`/builder/${formId}`);
                }
              }}
              className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                item.active
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
              title={item.label}
            >
              <Icon name={item.icon} size={22} filled={item.active} />
              <span className="text-[9px] font-medium">{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Stats Content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
              <SummaryCard
                icon="group"
                label="Total Responses"
                value={stats.totalResponses.toString()}
                color="bg-primary-container text-on-primary-container"
              />
              <SummaryCard
                icon="check_circle"
                label="Completion Rate"
                value={`${stats.completionRate}%`}
                color="bg-secondary-container text-on-secondary-container"
              />
              <SummaryCard
                icon="quiz"
                label="Total Questions"
                value={stats.questionStats.length.toString()}
                color="bg-tertiary-container text-on-tertiary-container"
              />
            </div>

            {/* Response Timeline */}
            <div className="rounded-3xl bg-surface-container-low border border-outline-variant p-4 md:p-8 mb-8">
              <h2 className="text-base font-semibold text-on-surface mb-6 flex items-center gap-2">
                <Icon name="trending_up" size={20} className="text-primary" />
                Responses Over Time
              </h2>
              <div className="flex items-end gap-2 md:gap-3 h-48 overflow-x-auto">
                {stats.responsesOverTime.length === 0 ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant">
                    <Icon name="show_chart" size={32} className="mb-2 opacity-50" />
                    <p className="text-sm">No responses yet</p>
                  </div>
                ) : (
                  (() => {
                    const maxCount = Math.max(...stats.responsesOverTime.map((p) => p.count));
                    const BAR_AREA_PX = 140; // usable pixel height for bars
                    return stats.responsesOverTime.map((point) => {
                      const barHeight = maxCount === 0 ? 4 : Math.max(4, (point.count / maxCount) * BAR_AREA_PX);
                      return (
                        <div key={point.date} className="flex-1 flex flex-col items-center justify-end gap-1.5">
                          <span className="text-xs text-on-surface-variant font-medium">{point.count}</span>
                          <div
                            className="w-full rounded-t-xl bg-primary/70 hover:bg-primary transition-all duration-300"
                            style={{ height: `${barHeight}px` }}
                          />
                          <span className="text-[10px] text-on-surface-variant">
                            {new Date(point.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      );
                    });
                  })()
                )}
              </div>
            </div>

            {/* Per-Question Breakdown */}
            {stats.questionStats.length > 0 && (
              <>
                <h2 className="text-base font-semibold text-on-surface mb-5">Question Breakdown</h2>
                <div className="space-y-5">
                  {stats.questionStats.map((qs) => (
                    <div
                      key={qs.questionId}
                      className="rounded-3xl bg-surface-container-low border border-outline-variant p-4 md:p-8"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="font-mono text-xs text-primary tracking-wider uppercase">
                            {qs.questionId.substring(0, 8)} / {qs.questionType.replace(/_/g, ' ').toUpperCase()}
                          </span>
                          <h3 className="text-base font-medium text-on-surface mt-1">
                            {qs.questionTitle}
                          </h3>
                        </div>
                        <span className="text-sm text-on-surface-variant shrink-0 ml-4">
                          {qs.totalAnswers} answers
                        </span>
                      </div>

                      {qs.distribution && Object.keys(qs.distribution).length > 0 && (
                        <div className="space-y-3 mt-4">
                          {Object.entries(qs.distribution).map(([label, count]) => {
                            const maxVal = Math.max(...Object.values(qs.distribution!));
                            const percent = qs.totalAnswers === 0 ? 0 : Math.round((count as number / qs.totalAnswers) * 100);
                            const barWidth = maxVal === 0 ? 0 : ((count as number) / maxVal) * 100;
                            return (
                              <div key={label}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-on-surface">{label}</span>
                                  <span className="text-xs text-on-surface-variant font-medium">
                                    {count as number} ({percent}%)
                                  </span>
                                </div>
                                <div className="h-3 rounded-full bg-surface-container-highest overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-primary transition-all duration-500"
                                    style={{ width: `${barWidth}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {qs.averageValue !== undefined && qs.averageValue !== null && !qs.distribution && (
                        <div className="mt-4 flex items-center gap-3">
                          <div className="text-3xl font-bold text-primary">{Number(qs.averageValue).toFixed(1)}</div>
                          <span className="text-sm text-on-surface-variant">average rating</span>
                        </div>
                      )}

                      {(qs.questionType === 'long_text' || qs.questionType === 'short_text') && (
                        <div className="mt-4 rounded-xl bg-surface-container p-4 text-sm text-on-surface-variant italic">
                          Text responses collected — {qs.totalAnswers} submissions total. View full export for raw text.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container border-t border-outline-variant flex items-center justify-around h-16 px-2">
        {RAIL_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              if (!item.active) {
                router.push(`/builder/${formId}`);
              }
            }}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-2xl transition-colors cursor-pointer ${
              item.active
                ? 'text-on-primary-container'
                : 'text-on-surface-variant'
            }`}
          >
            <div className={`px-4 py-1 rounded-full transition-colors ${item.active ? 'bg-primary-container' : ''}`}>
              <Icon name={item.icon} size={22} filled={item.active} />
            </div>
            <span className="text-[11px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-3xl bg-surface-container-low border border-outline-variant p-6 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
        <Icon name={icon} size={24} />
      </div>
      <div>
        <p className="text-sm text-on-surface-variant">{label}</p>
        <p className="text-2xl font-bold text-on-surface">{value}</p>
      </div>
    </div>
  );
}
