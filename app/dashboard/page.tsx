'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/app/components/ui/Icon';
import { getForms, createForm } from '@/lib/api';
import type { Form, FormStatus } from '@/lib/types';
import { useAuth } from '@/app/components/AuthProvider';

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
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    getForms()
      .then(setForms)
      .catch((err) => setError(err.message || 'Failed to load forms'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleCreateNew = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (creating) return;
    
    setCreating(true);
    try {
      const newForm = await createForm({ title: 'Untitled Form' });
      router.push(`/builder/${newForm.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create form');
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalForms = forms.length;
  const publishedForms = forms.filter((f) => f.status === 'published').length;
  const totalResponses = forms.reduce((acc, f) => acc + (f.responseCount || 0), 0);
  const formsWithResponses = forms.filter((f) => f.status === 'published' && (f.responseCount || 0) > 0).length;
  const completionRate = publishedForms > 0
    ? `${Math.round((formsWithResponses / publishedForms) * 100)}%`
    : '—';

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-sm flex items-start gap-3">
          <Icon name="error" size={20} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div id="section-analytics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 scroll-mt-20">
        {[
          { icon: 'description', label: 'Total Forms', value: totalForms.toString(), color: 'bg-primary-container text-on-primary-container' },
          { icon: 'visibility', label: 'Published', value: publishedForms.toString(), color: 'bg-secondary-container text-on-secondary-container' },
          { icon: 'group', label: 'Total Responses', value: totalResponses.toString(), color: 'bg-tertiary-container text-on-tertiary-container' },
          { icon: 'trending_up', label: 'Response Rate', value: completionRate, color: 'bg-primary-container text-on-primary-container' },
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
      <div id="section-forms" className="flex items-center justify-between mb-6 scroll-mt-20">
        <h2 className="text-lg font-semibold text-on-surface">Your Forms</h2>
        <button
          onClick={handleCreateNew}
          disabled={creating}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary hover:shadow-(--m3-shadow-1) transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {creating ? (
            <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <Icon name="add" size={18} />
          )}
          New Form
        </button>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {forms.map((form, i) => {
          const status = STATUS_STYLES[form.status];
          return (
            <Link
              key={form.id}
              href={`/builder/${form.id}`}
              className="group rounded-3xl bg-surface-container-low border border-outline-variant p-6 hover:border-primary/30 hover:shadow-(--m3-shadow-2) transition-all duration-300 opacity-0 animate-fade-in-up flex flex-col"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
            >
              <div className="flex-1">
                {/* Color bar */}
                <div
                  className="h-1.5 w-16 rounded-full mb-5"
                  style={{ backgroundColor: form.themeColor }}
                />

                <div className="flex items-start justify-between mb-3 gap-3">
                  <h3 className="text-base font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
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
              </div>

              <div className="flex items-center gap-4 text-xs text-on-surface-variant pt-4 border-t border-outline-variant mt-2">
                <span className="flex items-center gap-1">
                  <Icon name="quiz" size={14} />
                  {Array.isArray(form.questions) ? form.questions.length : 0} questions
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="group" size={14} />
                  {form.responseCount || 0} responses
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
        <button
          onClick={handleCreateNew}
          disabled={creating}
          className="rounded-3xl border-2 border-dashed border-outline-variant p-6 flex flex-col items-center justify-center gap-3 text-on-surface-variant hover:border-primary hover:text-primary transition-all duration-300 min-h-[200px] group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center group-hover:bg-primary-container group-hover:text-on-primary-container transition-all duration-300">
            {creating ? (
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icon name="add" size={28} />
            )}
          </div>
          <span className="text-sm font-medium">Create New Form</span>
        </button>
      </div>
    </div>
  );
}
