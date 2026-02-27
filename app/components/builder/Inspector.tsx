'use client';

import { useState } from 'react';
import { Icon } from '@/app/components/ui/Icon';
import { Switch } from '@/app/components/ui/Switch';
import type { Question, QuestionType } from '@/lib/types';

export type InspectorPanel = 'properties' | 'theme';

export interface ThemeSettings {
  themeColor: string;
  fontFamily: string;
  questionFontSize: number;
}

interface InspectorProps {
  activePanel: InspectorPanel;
  question: Question | null;
  onUpdate: (updated: Question) => void;
  theme: ThemeSettings;
  onThemeChange: (updated: ThemeSettings) => void;
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

const THEME_COLORS: { hex: string; name: string }[] = [
  { hex: '#6750A4', name: 'Deep Purple' },
  { hex: '#006A6A', name: 'Teal' },
  { hex: '#984061', name: 'Rose' },
  { hex: '#0061A4', name: 'Blue' },
  { hex: '#7D5700', name: 'Amber' },
];

const FONT_FAMILIES: { value: string; label: string }[] = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
];

const FONT_SIZES = [14, 16, 18, 20, 22, 24];

// ─── Color Button with tooltip ───

function ColorButton({ color, isActive, onSelect }: { color: { hex: string; name: string }; isActive: boolean; onSelect: () => void }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={onSelect}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`w-8 h-8 rounded-lg hover:scale-110 transition-all cursor-pointer ${
          isActive ? 'ring-2 ring-offset-2 ring-on-surface ring-offset-surface-container-low scale-110' : 'border-2 border-transparent'
        }`}
        style={{ backgroundColor: color.hex }}
        aria-label={color.name}
      />
      {showTooltip && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-inverse-surface text-inverse-on-surface text-xs font-medium whitespace-nowrap pointer-events-none animate-fade-in z-10">
          {color.name}
          {isActive && ' ✓'}
        </div>
      )}
    </div>
  );
}

// ─── Properties Panel ───

function PropertiesPanel({
  question,
  onUpdate,
}: {
  question: Question | null;
  onUpdate: (updated: Question) => void;
}) {
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
    </div>
  );
}

// ─── Theme Panel ───

function ThemePanel({
  theme,
  onThemeChange,
}: {
  theme: ThemeSettings;
  onThemeChange: (updated: ThemeSettings) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Section: Accent Color */}
      <div>
        <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-secondary mb-5">
          Accent Color
        </h2>
        <div className="flex gap-3">
          {THEME_COLORS.map((color) => (
            <ColorButton
              key={color.hex}
              color={color}
              isActive={theme.themeColor === color.hex}
              onSelect={() => onThemeChange({ ...theme, themeColor: color.hex })}
            />
          ))}
        </div>
      </div>

      {/* Section: Font Family */}
      <div className="border-t border-outline-variant pt-6">
        <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-secondary mb-4">
          Font Family
        </h2>
        <div className="space-y-2">
          {FONT_FAMILIES.map((font) => (
            <button
              key={font.value}
              onClick={() => onThemeChange({ ...theme, fontFamily: font.value })}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all cursor-pointer ${
                theme.fontFamily === font.value
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span style={{ fontFamily: `'${font.value}', sans-serif` }}>{font.label}</span>
              {theme.fontFamily === font.value && (
                <Icon name="check" size={18} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Section: Question Font Size */}
      <div className="border-t border-outline-variant pt-6">
        <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-secondary mb-4">
          Question Font Size
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {FONT_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onThemeChange({ ...theme, questionFontSize: size })}
              className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-center ${
                theme.questionFontSize === size
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {size}px
            </button>
          ))}
        </div>
        {/* Preview */}
        <div className="mt-4 p-4 rounded-xl bg-surface-container border border-outline-variant">
          <p className="text-on-surface-variant text-xs mb-2 uppercase tracking-widest font-bold">Preview</p>
          <p
            className="text-on-surface"
            style={{
              fontFamily: `'${theme.fontFamily}', sans-serif`,
              fontSize: `${theme.questionFontSize}px`,
            }}
          >
            Sample question text
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Inspector ───

function ActiveContent({ activePanel, question, onUpdate, theme, onThemeChange }: {
  activePanel: InspectorPanel;
  question: Question | null;
  onUpdate: (updated: Question) => void;
  theme: ThemeSettings;
  onThemeChange: (updated: ThemeSettings) => void;
}) {
  if (activePanel === 'theme') {
    return <ThemePanel theme={theme} onThemeChange={onThemeChange} />;
  }
  return <PropertiesPanel question={question} onUpdate={onUpdate} />;
}

export function Inspector({ activePanel, question, onUpdate, theme, onThemeChange, mobileOpen, onMobileClose }: InspectorProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-80 shrink-0 bg-surface-container-low rounded-(--m3-shape-xl) m-4 ml-2 p-6 flex-col overflow-y-auto border border-outline-variant">
        <ActiveContent activePanel={activePanel} question={question} onUpdate={onUpdate} theme={theme} onThemeChange={onThemeChange} />
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
          <ActiveContent activePanel={activePanel} question={question} onUpdate={onUpdate} theme={theme} onThemeChange={onThemeChange} />
        </div>
      </div>
    </>
  );
}
