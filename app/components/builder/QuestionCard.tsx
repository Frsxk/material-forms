'use client';

import { Icon } from '@/app/components/ui/Icon';
import type { Question } from '@/lib/types';

interface QuestionCardProps {
  question: Question;
  index: number;
  isActive: boolean;
  themeColor: string;
  fontFamily: string;
  questionFontSize: number;
  onClick: () => void;
  onUpdate: (updated: Question) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  isDragOver?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export function QuestionCard({
  question,
  index,
  isActive,
  themeColor,
  fontFamily,
  questionFontSize,
  onClick,
  onUpdate,
  onDelete,
  onDuplicate,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: QuestionCardProps) {
  const typeLabel = question.type.replace(/_/g, ' ').toUpperCase();

  return (
    <div
      onClick={onClick}
      draggable={isActive}
      onDragStart={isActive ? onDragStart : undefined}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`rounded-(--m3-shape-xl) p-8 ${isActive ? 'pt-0' : ''} transition-all duration-300 cursor-pointer border-l-4 border ${
        isActive
          ? 'bg-surface-container shadow-(--m3-shadow-2)'
          : 'bg-surface-container-low border-transparent hover:bg-surface-container hover:border-outline-variant'
      } ${isDragOver ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : ''}`}
      style={{
        animationDelay: `${index * 80}ms`,
        borderLeftColor: isActive ? themeColor : 'transparent',
        borderTopColor: isActive ? themeColor + '40' : undefined,
        borderRightColor: isActive ? themeColor + '40' : undefined,
        borderBottomColor: isActive ? themeColor + '40' : undefined,
      }}
    >
      {/* Drag handle */}
      {isActive && (
        <div
          className="flex justify-center py-1.5 cursor-grab active:cursor-grabbing text-on-surface-variant/40 hover:text-on-surface-variant transition-colors"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Icon name="reorder" size={20} />
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs tracking-wider uppercase" style={{ color: themeColor }}>
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
        className="w-full font-light text-on-surface bg-transparent border-none outline-none pb-2 border-b border-outline-variant focus:border-primary placeholder:text-on-surface-variant/50"
        style={{
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          fontFamily: `'${fontFamily}', sans-serif`,
          fontSize: `${questionFontSize}px`,
        }}
        placeholder="Type your question here..."
      />

      {/* Type-specific preview */}
      <div className="mt-5">
        <QuestionPreview question={question} onUpdate={onUpdate} themeColor={themeColor} />
      </div>

      {/* Required badge */}
      {question.required && (
        <div className="mt-4 flex items-center gap-1.5 text-xs font-medium" style={{ color: themeColor }}>
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
  themeColor,
}: {
  question: Question;
  onUpdate: (q: Question) => void;
  themeColor: string;
}) {
  const handleOptionLabelChange = (optId: string, value: string) => {
    const newOpts = (question.options ?? []).map((o) =>
      o.id === optId ? { ...o, label: value } : o
    );
    onUpdate({ ...question, options: newOpts });
  };

  const handleDeleteOption = (optId: string) => {
    if ((question.options ?? []).length <= 1) return;
    onUpdate({ ...question, options: (question.options ?? []).filter((o) => o.id !== optId) });
  };

  const handleAddOption = (prefix: string) => {
    const count = (question.options ?? []).length + 1;
    const newOpt = { id: `${prefix}${Date.now()}`, label: `Option ${count}` };
    onUpdate({ ...question, options: [...(question.options ?? []), newOpt] });
  };

  switch (question.type) {
    case 'multiple_choice':
      return (
        <div className="space-y-2">
          {(question.options ?? []).map((opt) => (
            <div key={opt.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-(--overlay-1) group">
              <div className="w-5 h-5 rounded-full border-2 border-outline-variant shrink-0" />
              <input
                type="text"
                value={opt.label}
                onChange={(e) => handleOptionLabelChange(opt.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-transparent border-none outline-none text-sm text-on-surface"
                placeholder="Option label"
              />
              {(question.options ?? []).length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteOption(opt.id); }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-error-container transition-all cursor-pointer shrink-0"
                  title="Remove option"
                >
                  <Icon name="close" size={14} className="text-error" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={(e) => { e.stopPropagation(); handleAddOption('o'); }}
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
            <div key={opt.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-(--overlay-1) group">
              <div className="w-5 h-5 rounded-(--m3-shape-xs) border-2 border-outline-variant shrink-0" />
              <input
                type="text"
                value={opt.label}
                onChange={(e) => handleOptionLabelChange(opt.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-transparent border-none outline-none text-sm text-on-surface"
                placeholder="Option label"
              />
              {(question.options ?? []).length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteOption(opt.id); }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-error-container transition-all cursor-pointer shrink-0"
                  title="Remove option"
                >
                  <Icon name="close" size={14} className="text-error" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={(e) => { e.stopPropagation(); handleAddOption('c'); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-(--overlay-1) text-outline-variant cursor-pointer"
          >
            <div className="w-5 h-5 rounded-(--m3-shape-xs) border-2 border-dashed border-outline-variant shrink-0" />
            <span className="text-sm">Add option...</span>
          </button>
        </div>
      );

    case 'dropdown':
      return (
        <div className="space-y-2">
          {(question.options ?? []).map((opt, i) => (
            <div key={opt.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-(--overlay-1) group">
              <span className="w-5 text-xs font-bold text-on-surface-variant text-center shrink-0">{i + 1}.</span>
              <input
                type="text"
                value={opt.label}
                onChange={(e) => handleOptionLabelChange(opt.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-transparent border-none outline-none text-sm text-on-surface"
                placeholder="Option label"
              />
              {(question.options ?? []).length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteOption(opt.id); }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-error-container transition-all cursor-pointer shrink-0"
                  title="Remove option"
                >
                  <Icon name="close" size={14} className="text-error" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={(e) => { e.stopPropagation(); handleAddOption('d'); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-(--overlay-1) text-outline-variant cursor-pointer"
          >
            <span className="w-5 text-xs font-bold text-center shrink-0">+</span>
            <span className="text-sm">Add option...</span>
          </button>
          {/* Visual dropdown preview */}
          <div className="border border-outline-variant rounded-xl px-4 py-2.5 mt-2 flex items-center justify-between">
            <span className="text-sm text-on-surface-variant/50">
              {(question.options ?? []).length > 0 ? (question.options![0].label || 'Select an option') : 'Select an option'}
            </span>
            <Icon name="arrow_drop_down" size={20} className="text-on-surface-variant" />
          </div>
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
          {/* Editable min/max controls */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant font-medium">Min</span>
              <input
                type="number"
                value={min}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v < max) onUpdate({ ...question, scaleMin: v });
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-14 px-2 py-1 rounded-lg bg-surface-container border border-outline-variant text-sm text-on-surface text-center outline-none focus:border-primary"
              />
            </div>
            <span className="text-on-surface-variant">—</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant font-medium">Max</span>
              <input
                type="number"
                value={max}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v > min && v <= 10) onUpdate({ ...question, scaleMax: v });
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-14 px-2 py-1 rounded-lg bg-surface-container border border-outline-variant text-sm text-on-surface text-center outline-none focus:border-primary"
              />
            </div>
          </div>
          {/* Scale dots */}
          <div className="flex items-center justify-between py-3 px-2">
            {steps.map((step) => (
              <div key={step} className="flex flex-col items-center gap-2">
                <div className="w-3 h-3 rounded-full opacity-40" style={{ backgroundColor: themeColor }} />
                <span className="text-xs text-on-surface-variant">{step}</span>
              </div>
            ))}
          </div>
          {/* Editable labels */}
          <div className="flex justify-between gap-4">
            <input
              type="text"
              value={question.scaleMinLabel || ''}
              onChange={(e) => onUpdate({ ...question, scaleMinLabel: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              placeholder="Low"
              className="w-32 text-xs text-on-surface-variant bg-transparent border-b border-dashed border-outline-variant outline-none pb-1 focus:border-primary"
            />
            <input
              type="text"
              value={question.scaleMaxLabel || ''}
              onChange={(e) => onUpdate({ ...question, scaleMaxLabel: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              placeholder="High"
              className="w-32 text-xs text-on-surface-variant bg-transparent border-b border-dashed border-outline-variant outline-none pb-1 text-right focus:border-primary"
            />
          </div>
        </div>
      );
    }

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
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-on-surface-variant font-medium">Stars</span>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (ratingMax > 3) onUpdate({ ...question, ratingMax: ratingMax - 1 });
                }}
                className="w-7 h-7 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <Icon name="remove" size={14} />
              </button>
              <span className="w-6 text-center text-sm font-medium text-on-surface">{ratingMax}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (ratingMax < 10) onUpdate({ ...question, ratingMax: ratingMax + 1 });
                }}
                className="w-7 h-7 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <Icon name="add" size={14} />
              </button>
            </div>
          </div>
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
        </div>
      );
    }

    default:
      return null;
  }
}
