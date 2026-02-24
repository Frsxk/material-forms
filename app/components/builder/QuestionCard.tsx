'use client';

import { Icon } from '@/app/components/ui/Icon';
import type { Question } from '@/lib/types';

interface QuestionCardProps {
  question: Question;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onUpdate: (updated: Question) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function QuestionCard({
  question,
  index,
  isActive,
  onClick,
  onUpdate,
  onDelete,
  onDuplicate,
}: QuestionCardProps) {
  const typeLabel = question.type.replace(/_/g, ' ').toUpperCase();

  return (
    <div
      onClick={onClick}
      className={`rounded-(--m3-shape-xl) p-8 transition-all duration-300 cursor-pointer border ${
        isActive
          ? 'bg-surface-container border-primary shadow-(--m3-shadow-2)'
          : 'bg-surface-container-low border-transparent hover:bg-surface-container hover:border-outline-variant'
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Meta */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs text-primary tracking-wider uppercase">
          ID: {question.id} / {typeLabel}
        </span>
        {isActive && (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
              title="Duplicate"
            >
              <Icon name="content_copy" size={16} className="text-on-surface-variant" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-error-container transition-colors cursor-pointer"
              title="Delete"
            >
              <Icon name="delete" size={16} className="text-error" />
            </button>
          </div>
        )}
      </div>

      {/* Title Input */}
      <input
        type="text"
        value={question.title}
        onChange={(e) => onUpdate({ ...question, title: e.target.value })}
        onClick={(e) => e.stopPropagation()}
        className="w-full text-xl font-light text-on-surface bg-transparent border-none outline-none pb-2 border-b border-outline-variant focus:border-primary placeholder:text-on-surface-variant/50"
        style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid' }}
        placeholder="Type your question here..."
      />

      {/* Type-specific preview */}
      <div className="mt-5">
        <QuestionPreview question={question} onUpdate={onUpdate} />
      </div>

      {/* Required badge */}
      {question.required && (
        <div className="mt-4 flex items-center gap-1.5 text-xs text-primary font-medium">
          <Icon name="emergency" size={14} />
          Required
        </div>
      )}
    </div>
  );
}

function QuestionPreview({
  question,
  onUpdate,
}: {
  question: Question;
  onUpdate: (q: Question) => void;
}) {
  switch (question.type) {
    case 'multiple_choice':
      return (
        <div className="space-y-2">
          {(question.options ?? []).map((opt) => (
            <div key={opt.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-(--overlay-1)">
              <div className="w-5 h-5 rounded-full border-2 border-outline-variant shrink-0" />
              <input
                type="text"
                value={opt.label}
                onChange={(e) => {
                  const newOpts = (question.options ?? []).map((o) =>
                    o.id === opt.id ? { ...o, label: e.target.value } : o
                  );
                  onUpdate({ ...question, options: newOpts });
                }}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-transparent border-none outline-none text-sm text-on-surface"
              />
            </div>
          ))}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const newOpt = { id: `o${Date.now()}`, label: '' };
              onUpdate({ ...question, options: [...(question.options ?? []), newOpt] });
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-(--overlay-1) text-outline-variant cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full border-2 border-dashed border-outline-variant shrink-0" />
            <span className="text-sm">Add option...</span>
          </button>
        </div>
      );

    case 'checkbox':
      return (
        <div className="space-y-2">
          {(question.options ?? []).map((opt) => (
            <div key={opt.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-(--overlay-1)">
              <div className="w-5 h-5 rounded-(--m3-shape-xs) border-2 border-outline-variant shrink-0" />
              <input
                type="text"
                value={opt.label}
                onChange={(e) => {
                  const newOpts = (question.options ?? []).map((o) =>
                    o.id === opt.id ? { ...o, label: e.target.value } : o
                  );
                  onUpdate({ ...question, options: newOpts });
                }}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-transparent border-none outline-none text-sm text-on-surface"
              />
            </div>
          ))}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const newOpt = { id: `c${Date.now()}`, label: '' };
              onUpdate({ ...question, options: [...(question.options ?? []), newOpt] });
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-(--overlay-1) text-outline-variant cursor-pointer"
          >
            <div className="w-5 h-5 rounded-(--m3-shape-xs) border-2 border-dashed border-outline-variant shrink-0" />
            <span className="text-sm">Add option...</span>
          </button>
        </div>
      );

    case 'short_text':
      return (
        <div className="border-b border-dashed border-outline-variant pb-2">
          <span className="text-sm text-on-surface-variant/50">
            {question.placeholder || 'Short answer text'}
          </span>
        </div>
      );

    case 'long_text':
      return (
        <div className="h-24 border border-dashed border-outline-variant rounded-xl bg-(--overlay-1) flex items-center justify-center">
          <span className="text-sm text-on-surface-variant/50">
            {question.placeholder || 'Long answer text area'}
          </span>
        </div>
      );

    case 'scale': {
      const min = question.scaleMin ?? 1;
      const max = question.scaleMax ?? 5;
      const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      return (
        <div>
          <div className="flex items-center justify-between py-4 px-2">
            {steps.map((step) => (
              <div
                key={step}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-3 h-3 rounded-full bg-primary opacity-30" />
                <span className="text-xs text-on-surface-variant">{step}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>{question.scaleMinLabel || 'Low'}</span>
            <span>{question.scaleMaxLabel || 'High'}</span>
          </div>
        </div>
      );
    }

    case 'dropdown':
      return (
        <div className="border border-outline-variant rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-on-surface-variant/50">Select an option</span>
          <Icon name="arrow_drop_down" size={20} className="text-on-surface-variant" />
        </div>
      );

    case 'date':
      return (
        <div className="border border-outline-variant rounded-xl px-4 py-3 flex items-center gap-3">
          <Icon name="calendar_today" size={20} className="text-on-surface-variant" />
          <span className="text-sm text-on-surface-variant/50">mm/dd/yyyy</span>
        </div>
      );

    case 'rating': {
      const ratingMax = question.ratingMax ?? 5;
      return (
        <div className="flex gap-2 py-2">
          {Array.from({ length: ratingMax }, (_, i) => (
            <Icon
              key={i}
              name="star"
              size={28}
              className={i === 0 ? 'text-primary' : 'text-outline-variant'}
            />
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}
