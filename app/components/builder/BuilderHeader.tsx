'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/app/components/ui/Icon';
import { Logo } from '@/app/components/ui/Logo';
import { useTheme } from '@/app/components/ThemeProvider';
import { publishForm, closeForm } from '@/lib/api';
import type { FormStatus } from '@/lib/types';

interface BuilderHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  formId: string;
  formStatus: FormStatus;
  onStatusChange: (status: FormStatus) => void;
}

const VISIBILITY_OPTIONS: { status: FormStatus; icon: string; label: string; description: string }[] = [
  { status: 'draft', icon: 'edit_note', label: 'Draft', description: 'Only you can see this form. Not accepting responses.' },
  { status: 'published', icon: 'public', label: 'Published', description: 'Anyone with the link can submit responses.' },
  { status: 'closed', icon: 'lock', label: 'Closed', description: 'Form is visible but no longer accepting responses.' },
];

export function BuilderHeader({ title, onTitleChange, formId, formStatus, onStatusChange }: BuilderHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/f/${formId}`;

  const handleStatusChange = async (newStatus: FormStatus) => {
    if (newStatus === formStatus || updating) return;
    setUpdating(true);
    try {
      if (newStatus === 'published') {
        await publishForm(formId);
      } else if (newStatus === 'closed') {
        await closeForm(formId);
      }
      // "draft" status re-set is not supported by the API — only publish and close are available
      onStatusChange(newStatus);
    } catch (err) {
      console.error('Failed to update form status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for insecure contexts
      const input = document.createElement('input');
      input.value = publicUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusColor = formStatus === 'published'
    ? 'text-green-600 dark:text-green-400'
    : formStatus === 'closed'
      ? 'text-red-500'
      : 'text-on-surface-variant';

  const statusLabel = formStatus.charAt(0).toUpperCase() + formStatus.slice(1);

  return (
    <>
      <header className="flex items-center justify-between px-3 md:px-6 h-14 md:h-16 border-b border-outline-variant bg-surface z-10">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <Link href="/dashboard" className="hover:scale-105 transition-transform shrink-0">
            <Logo size={32} className="md:w-9 md:h-9" />
          </Link>
          <div className="flex flex-col">
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="text-sm md:text-base font-medium text-on-surface bg-transparent border-none outline-none px-2 md:px-3 py-1 rounded-lg hover:bg-surface-container-high focus:bg-surface-container-high transition-colors w-full max-w-[200px] md:max-w-[300px] truncate"
              placeholder="Untitled Form"
            />
            <span className={`text-[10px] md:text-xs px-2 md:px-3 font-medium ${statusColor}`}>
              {statusLabel}
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
            href={`/f/${formId}`}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-surface-container-high px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest transition-colors"
            target="_blank"
          >
            <Icon name="visibility" size={18} />
            Preview
          </Link>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 md:px-5 py-2 text-sm font-medium text-on-primary hover:shadow-(--m3-shadow-1) transition-all cursor-pointer"
          >
            <Icon name="share" size={18} className="sm:hidden" />
            <span className="hidden sm:inline">Publish</span>
          </button>
        </div>
      </header>

      {/* Publish / Visibility Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Scrim */}
          <div
            className="absolute inset-0 bg-black/50 animate-fade-in"
            onClick={() => setModalOpen(false)}
          />
          {/* Dialog */}
          <div className="relative bg-surface-container-low rounded-3xl border border-outline-variant shadow-(--m3-shadow-3) w-full max-w-md animate-scale-in overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <h2 className="text-lg font-semibold text-on-surface">Manage Form</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            {/* Visibility Options */}
            <div className="px-6 py-4 space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-secondary mb-3">
                Visibility
              </p>
              {VISIBILITY_OPTIONS.map((opt) => {
                const isActive = formStatus === opt.status;
                // Draft can't be set back via API, so disable it if we've moved past it
                const isDisabled = opt.status === 'draft' && formStatus !== 'draft';
                return (
                  <button
                    key={opt.status}
                    onClick={() => handleStatusChange(opt.status)}
                    disabled={isActive || updating || isDisabled}
                    className={`w-full flex items-start gap-4 px-4 py-3.5 rounded-2xl text-left transition-all cursor-pointer disabled:cursor-not-allowed ${
                      isActive
                        ? 'bg-primary-container'
                        : isDisabled
                          ? 'opacity-40'
                          : 'hover:bg-surface-container-high'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'
                    }`}>
                      <Icon name={opt.icon} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isActive ? 'text-on-primary-container' : 'text-on-surface'}`}>
                          {opt.label}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-on-primary px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${isActive ? 'text-on-primary-container/70' : 'text-on-surface-variant'}`}>
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Copy Link Section */}
            <div className="px-6 pb-6 pt-2">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-secondary mb-3">
                Share Link
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-surface-container rounded-xl border border-outline-variant px-4 py-2.5 text-sm text-on-surface-variant truncate font-mono">
                  {publicUrl}
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`shrink-0 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                    copied
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-primary text-on-primary hover:shadow-(--m3-shadow-1)'
                  }`}
                >
                  <Icon name={copied ? 'check' : 'content_copy'} size={18} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              {formStatus === 'draft' && (
                <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
                  <Icon name="info" size={14} />
                  Publish the form first to allow responses.
                </p>
              )}
            </div>

            {/* Status indicator while updating */}
            {updating && (
              <div className="absolute inset-0 bg-surface/60 flex items-center justify-center rounded-3xl">
                <div className="flex items-center gap-3 bg-surface-container rounded-full px-5 py-2.5 shadow-(--m3-shadow-2)">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium text-on-surface">Updating...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
