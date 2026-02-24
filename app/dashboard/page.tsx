'use client';

import Link from 'next/link';
import { MOCK_FORMS } from '@/lib/mock-data';
import { Icon } from '@/app/components/ui/Icon';
import type { FormStatus } from '@/lib/types';

const STATUS_STYLES: Record<FormStatus, { bg: string; text: string; label: string }> = {
  draft: {
    bg: 'bg-surface-container-high',
    text: 'text-on-surface-variant',
    label: 'Draft',
  },
  published: {
    bg: 'bg-primary-container',
    text: 'text-on-primary-container',
    label: 'Published',
  },
  closed: {
    bg: 'bg-error-container',
    text: 'text-on-error-container',
    label: 'Closed',
  },
};

export default function DashboardPage() {
  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { icon: 'description', label: 'Total Forms', value: MOCK_FORMS.length.toString(), color: 'bg-primary-container text-on-primary-container' },
          { icon: 'visibility', label: 'Published', value: MOCK_FORMS.filter((f) => f.status === 'published').length.toString(), color: 'bg-secondary-container text-on-secondary-container' },
          { icon: 'group', label: 'Total Responses', value: MOCK_FORMS.reduce((a, f) => a + f.responseCount, 0).toString(), color: 'bg-tertiary-container text-on-tertiary-container' },
          { icon: 'trending_up', label: 'Completion Rate', value: '87%', color: 'bg-primary-container text-on-primary-container' },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-3xl bg-surface-container-low border border-outline-variant p-6 flex items-start gap-4"
          >
            <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center shrink-0`}>
              <Icon name={card.icon} size={24} />
            </div>
            <div>
              <p className="text-sm text-on-surface-variant">{card.label}</p>
              <p className="text-2xl font-bold text-on-surface">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Forms Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-on-surface">Your Forms</h2>
        <Link
          href="/builder/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary hover:shadow-(--m3-shadow-1) transition-all duration-200"
        >
          <Icon name="add" size={18} />
          New Form
        </Link>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_FORMS.map((form, i) => {
          const status = STATUS_STYLES[form.status];
          return (
            <Link
              key={form.id}
              href={`/builder/${form.id}`}
              className="group rounded-3xl bg-surface-container-low border border-outline-variant p-6 hover:border-primary/30 hover:shadow-(--m3-shadow-2) transition-all duration-300 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
            >
              {/* Color bar */}
              <div
                className="h-1.5 w-16 rounded-full mb-5"
                style={{ backgroundColor: form.themeColor }}
              />

              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-semibold text-on-surface group-hover:text-primary transition-colors">
                  {form.title}
                </h3>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
              </div>

              {form.description && (
                <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">
                  {form.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-on-surface-variant pt-3 border-t border-outline-variant">
                <span className="flex items-center gap-1">
                  <Icon name="quiz" size={14} />
                  {form.questions.length} questions
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="group" size={14} />
                  {form.responseCount} responses
                </span>
                <span className="ml-auto flex items-center gap-1">
                  <Icon name="schedule" size={14} />
                  {new Date(form.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          );
        })}

        {/* Create New Card */}
        <Link
          href="/builder/new"
          className="rounded-3xl border-2 border-dashed border-outline-variant p-6 flex flex-col items-center justify-center gap-3 text-on-surface-variant hover:border-primary hover:text-primary transition-all duration-300 min-h-[200px] group"
        >
          <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center group-hover:bg-primary-container group-hover:text-on-primary-container transition-all duration-300">
            <Icon name="add" size={28} />
          </div>
          <span className="text-sm font-medium">Create New Form</span>
        </Link>
      </div>
    </div>
  );
}
