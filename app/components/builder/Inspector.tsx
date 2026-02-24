'use client';

import { Icon } from '@/app/components/ui/Icon';
import { Switch } from '@/app/components/ui/Switch';
import type { Question, QuestionType } from '@/lib/types';

interface InspectorProps {
  question: Question | null;
  onUpdate: (updated: Question) => void;
  /** Mobile sheet mode */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const QUESTION_TYPES: { type: QuestionType; icon: string; label: string }[] = [
  { type: 'multiple_choice', icon: 'radio_button_checked', label: 'Multiple Choice' },
  { type: 'checkbox', icon: 'check_box', label: 'Checkboxes' },
  { type: 'short_text', icon: 'short_text', label: 'Short Text' },
  { type: 'long_text', icon: 'notes', label: 'Long Text' },
  { type: 'scale', icon: 'linear_scale', label: 'Linear Scale' },
  { type: 'dropdown', icon: 'arrow_drop_down_circle', label: 'Dropdown' },
  { type: 'date', icon: 'calendar_today', label: 'Date' },
  { type: 'rating', icon: 'star', label: 'Rating' },
];

const THEME_COLORS = ['#6750A4', '#006A6A', '#984061', '#0061A4', '#7D5700'];

function InspectorContent({ question, onUpdate }: { question: Question | null; onUpdate: (updated: Question) => void }) {
  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="w-16 h-16 rounded-3xl bg-surface-container-high flex items-center justify-center mb-4">
          <Icon name="touch_app" size={32} className="text-on-surface-variant" />
        </div>
        <p className="text-sm text-on-surface-variant">
          Select a question to edit its properties.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Section: Properties */}
      <div>
        <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-secondary mb-5">
          Properties
        </h2>
        <div className="space-y-4">
          <Switch
            label="Required"
            checked={question.required}
            onChange={(checked) => onUpdate({ ...question, required: checked })}
          />
        </div>
      </div>

      {/* Section: Question Type */}
      <div className="border-t border-outline-variant pt-6">
        <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-secondary mb-4">
          Question Type
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {QUESTION_TYPES.map((qt) => (
            <button
              key={qt.type}
              onClick={() => onUpdate({ ...question, type: qt.type })}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                question.type === qt.type
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <Icon name={qt.icon} size={16} />
              {qt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section: Appearance */}
      <div className="border-t border-outline-variant pt-6">
        <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-secondary mb-4">
          Appearance
        </h2>
        <div className="flex gap-2">
          {THEME_COLORS.map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded-lg border-2 border-transparent hover:scale-110 transition-transform cursor-pointer"
              style={{ backgroundColor: color }}
              aria-label={`Theme color ${color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Inspector({ question, onUpdate, mobileOpen, onMobileClose }: InspectorProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-80 shrink-0 bg-surface-container-low rounded-(--m3-shape-xl) m-4 ml-2 p-6 flex-col overflow-y-auto border border-outline-variant">
        <InspectorContent question={question} onUpdate={onUpdate} />
      </aside>

      {/* Mobile overlay sheet */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Scrim */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onMobileClose}
        />
        {/* Sheet */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-surface-container-low rounded-t-3xl border-t border-outline-variant p-6 max-h-[70vh] overflow-y-auto transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="w-10 h-1 rounded-full bg-outline-variant mx-auto mb-4" />
          <InspectorContent question={question} onUpdate={onUpdate} />
        </div>
      </div>
    </>
  );
}
