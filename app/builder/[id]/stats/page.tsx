'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getFormById, getStatsForForm, MOCK_STATS } from '@/lib/mock-data';
import { Icon } from '@/app/components/ui/Icon';
import { useTheme } from '@/app/components/ThemeProvider';

export default function StatsPage() {
  const params = useParams();
  const formId = params.id as string;
  const form = getFormById(formId);
  const stats = getStatsForForm(formId) ?? MOCK_STATS;
  const { theme, toggleTheme } = useTheme();

  const formTitle = form?.title ?? 'Form Statistics';

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between px-4 md:px-8 py-3 md:py-4 gap-3 border-b border-outline-variant bg-surface sticky top-0 z-10">
        <div className="flex items-center gap-3 md:gap-4">
          <Link
            href={`/builder/${formId}`}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors shrink-0"
          >
            <Icon name="arrow_back" size={20} />
          </Link>
          <div>
            <h1 className="text-base md:text-lg font-semibold text-on-surface">{formTitle}</h1>
            <p className="text-xs md:text-sm text-on-surface-variant">Response Analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 ml-auto sm:ml-0">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
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
            icon="timer"
            label="Avg. Completion Time"
            value={`${Math.floor(stats.averageTimeSeconds / 60)}m ${stats.averageTimeSeconds % 60}s`}
            color="bg-tertiary-container text-on-tertiary-container"
          />
        </div>

        {/* Response Timeline */}
        <div className="rounded-3xl bg-surface-container-low border border-outline-variant p-4 md:p-8 mb-8">
          <h2 className="text-base font-semibold text-on-surface mb-6 flex items-center gap-2">
            <Icon name="trending_up" size={20} className="text-primary" />
            Responses Over Time
          </h2>
          <div className="flex items-end gap-2 md:gap-3 h-40 overflow-x-auto">
            {stats.responsesOverTime.map((point) => {
              const maxCount = Math.max(...stats.responsesOverTime.map((p) => p.count));
              const height = (point.count / maxCount) * 100;
              return (
                <div key={point.date} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-on-surface-variant font-medium">{point.count}</span>
                  <div
                    className="w-full rounded-t-xl bg-primary/70 hover:bg-primary transition-all duration-200 min-h-[4px]"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-on-surface-variant">
                    {new Date(point.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Per-Question Breakdown */}
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
                    {qs.questionId} / {qs.questionType.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <h3 className="text-base font-medium text-on-surface mt-1">
                    {qs.questionTitle}
                  </h3>
                </div>
                <span className="text-sm text-on-surface-variant shrink-0 ml-4">
                  {qs.totalAnswers} answers
                </span>
              </div>

              {qs.distribution && (
                <div className="space-y-3 mt-4">
                  {Object.entries(qs.distribution).map(([label, count]) => {
                    const maxVal = Math.max(...Object.values(qs.distribution!));
                    const percent = Math.round((count / qs.totalAnswers) * 100);
                    const barWidth = (count / maxVal) * 100;
                    return (
                      <div key={label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-on-surface">{label}</span>
                          <span className="text-xs text-on-surface-variant font-medium">
                            {count} ({percent}%)
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

              {qs.averageValue !== undefined && !qs.distribution && (
                <div className="mt-4 flex items-center gap-3">
                  <div className="text-3xl font-bold text-primary">{qs.averageValue}</div>
                  <span className="text-sm text-on-surface-variant">average rating</span>
                </div>
              )}

              {qs.questionType === 'long_text' && (
                <div className="mt-4 rounded-xl bg-surface-container p-4 text-sm text-on-surface-variant italic">
                  Text responses collected — {qs.totalAnswers} submissions total.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
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
