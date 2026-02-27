'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BuilderHeader } from '@/app/components/builder/BuilderHeader';
import { QuestionCard } from '@/app/components/builder/QuestionCard';
import { Inspector } from '@/app/components/builder/Inspector';
import type { InspectorPanel, ThemeSettings } from '@/app/components/builder/Inspector';
import { Icon } from '@/app/components/ui/Icon';
import { getForm, updateForm } from '@/lib/api';
import type { Form, Question, QuestionType, FormStatus } from '@/lib/types';
import { useAuth } from '@/app/components/AuthProvider';

interface RailItem {
  icon: string;
  label: string;
  panel?: InspectorPanel;
  href?: string;
}

const RAIL_ITEMS: RailItem[] = [
  { icon: 'edit_note', label: 'Properties', panel: 'properties' },
  { icon: 'palette', label: 'Theme', panel: 'theme' },
  { icon: 'bar_chart', label: 'Stats' },
];

function createNewQuestion(type: QuestionType = 'multiple_choice'): Question {
  const id = `q-${Date.now().toString(36)}`;
  const base: Question = { id, type, title: '', required: false };

  if (type === 'multiple_choice' || type === 'checkbox') {
    base.options = [
      { id: `o${Date.now()}a`, label: 'Option 1' },
      { id: `o${Date.now()}b`, label: 'Option 2' },
    ];
  }
  if (type === 'dropdown') {
    base.options = [
      { id: `d${Date.now()}a`, label: 'Option 1' },
      { id: `d${Date.now()}b`, label: 'Option 2' },
    ];
  }
  if (type === 'scale') {
    base.scaleMin = 1;
    base.scaleMax = 5;
    base.scaleMinLabel = 'Strongly disagree';
    base.scaleMaxLabel = 'Strongly agree';
  }
  if (type === 'rating') {
    base.ratingMax = 5;
  }

  return base;
}

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    themeColor: '#6750A4',
    fontFamily: 'Inter',
    questionFontSize: 20,
  });
  const [activePanel, setActivePanel] = useState<InspectorPanel>('properties');
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Use refs to track latest state for the debounced save
  const titleRef = useRef(title);
  const questionsRef = useRef(questions);
  const themeSettingsRef = useRef(themeSettings);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    titleRef.current = title;
    questionsRef.current = questions;
    themeSettingsRef.current = themeSettings;
  }, [title, questions, themeSettings]);

  // Fetch form data
  useEffect(() => {
    if (authLoading || !user) return;

    getForm(formId)
      .then((data) => {
        setForm(data);
        setTitle(data.title);
        setThemeSettings(prev => ({ ...prev, themeColor: data.themeColor || '#6750A4' }));
        
        const initialQuestions = Array.isArray(data.questions) && data.questions.length > 0
          ? (data.questions as Question[])
          : [createNewQuestion()];
          
        setQuestions(initialQuestions);
        setActiveQuestionId(initialQuestions[0]?.id || null);
        isInitialLoadRef.current = false;
      })
      .catch((err) => {
        setError(err.message || 'Failed to load form');
        setForm(null);
      })
      .finally(() => setLoading(false));
  }, [formId, user, authLoading]);

  // Auto-save logic
  const triggerSave = useCallback(() => {
    if (isInitialLoadRef.current) return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    setSaving(true);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await updateForm(formId, {
          title: titleRef.current,
          questions: questionsRef.current,
          themeColor: themeSettingsRef.current.themeColor,
        });
        setSaving(false);
      } catch (err) {
        console.error('Auto-save failed:', err);
        setSaving(false); // Still false so UI doesn't spin forever, but maybe show a toast in future
      }
    }, 1000); // 1s debounce
  }, [formId]);

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    triggerSave();
  }, [triggerSave]);

  const handleUpdateQuestion = useCallback((updated: Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    triggerSave();
  }, [triggerSave]);

  const handleDeleteQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (activeQuestionId === id) setActiveQuestionId(null);
    triggerSave();
  }, [activeQuestionId, triggerSave]);

  const handleDuplicateQuestion = useCallback((id: string) => {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.id === id);
      if (idx === -1) return prev;
      const original = prev[idx];
      const duplicate: Question = {
        ...original,
        id: `q-${Date.now().toString(36)}`,
        options: original.options?.map((o) => ({ ...o, id: `o${Date.now()}${Math.random().toString(36).slice(2, 5)}` })),
      };
      const newList = [...prev];
      newList.splice(idx + 1, 0, duplicate);
      return newList;
    });
    triggerSave();
  }, [triggerSave]);

  const handleAddQuestion = () => {
    const newQ = createNewQuestion();
    setQuestions((prev) => [...prev, newQ]);
    setActiveQuestionId(newQ.id);
    triggerSave();
  };

  const handleThemeChange = useCallback((updated: ThemeSettings) => {
    setThemeSettings(updated);
    triggerSave();
  }, [triggerSave]);

  const handleStatusChange = useCallback((status: FormStatus) => {
    setForm(prev => prev ? { ...prev, status } : null);
  }, []);

  if (loading || authLoading) {
    return (
      <div className="h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="h-screen bg-surface flex items-center justify-center">
        <div className="p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mx-auto mb-4">
            <Icon name="error" size={32} />
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2">Error Loading Form</h2>
          <p className="text-on-surface-variant mb-6">{error || 'Form not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-on-primary hover:shadow-md transition-all cursor-pointer"
          >
            <Icon name="arrow_back" size={18} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const activeQuestion = questions.find((q) => q.id === activeQuestionId) ?? null;

  return (
    <div className="h-screen flex flex-col bg-surface overflow-hidden">
      <BuilderHeader 
        title={title} 
        onTitleChange={handleTitleChange} 
        formId={formId}
        formStatus={form.status}
        onStatusChange={handleStatusChange}
      />

      {saving && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-surface border border-outline-variant rounded-full px-3 py-1 shadow-sm flex items-center gap-2 animate-fade-in-down pointer-events-none">
          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium text-on-surface-variant">Saving changes...</span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        {/* Navigation Rail (desktop) */}
        <aside className="hidden md:flex flex-col items-center w-16 py-6 gap-4 bg-surface border-r border-outline-variant shrink-0 relative z-10">
          {RAIL_ITEMS.map((item) => {
            const isActive = item.panel ? activePanel === item.panel : false;
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.panel) {
                    setActivePanel(item.panel);
                  } else if (item.label === 'Stats') {
                    router.push(`/builder/${formId}/stats`);
                  }
                }}
                className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
                title={item.label}
              >
                <Icon name={item.icon} size={22} filled={isActive} />
                <span className="text-[9px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Builder Canvas */}
        <main className="flex-1 overflow-y-auto px-4 md:px-10 py-6 scroll-smooth relative z-0 pb-24 md:pb-6">
          <div className="max-w-3xl mx-auto space-y-5 pb-32">
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                isActive={q.id === activeQuestionId}
                themeColor={themeSettings.themeColor}
                fontFamily={themeSettings.fontFamily}
                questionFontSize={themeSettings.questionFontSize}
                onClick={() => setActiveQuestionId(q.id)}
                onUpdate={handleUpdateQuestion}
                onDelete={() => handleDeleteQuestion(q.id)}
                onDuplicate={() => handleDuplicateQuestion(q.id)}
              />
            ))}
          </div>

          {/* FAB: add question (mobile: above bottom nav, desktop: offset from inspector) */}
          <div className="fixed bottom-20 right-4 md:bottom-8 md:right-[360px] z-20">
            <button
              onClick={handleAddQuestion}
              className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container shadow-(--m3-shadow-3) hover:shadow-(--m3-shadow-4) hover:scale-110 hover:rounded-3xl transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              <Icon name="add" size={28} />
            </button>
          </div>
        </main>

        {/* Inspector (desktop sidebar + mobile sheet) */}
        <Inspector
          activePanel={activePanel}
          question={activeQuestion}
          onUpdate={handleUpdateQuestion}
          theme={themeSettings}
          onThemeChange={handleThemeChange}
          mobileOpen={inspectorOpen}
          onMobileClose={() => setInspectorOpen(false)}
        />
      </div>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface-container border-t border-outline-variant flex items-center justify-around h-16 px-2">
        {RAIL_ITEMS.map((item) => {
          const isActive = item.panel ? activePanel === item.panel && inspectorOpen : false;
          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.panel) {
                  setActivePanel(item.panel);
                  setInspectorOpen(true);
                } else if (item.label === 'Stats') {
                  router.push(`/builder/${formId}/stats`);
                }
              }}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-2xl transition-colors cursor-pointer ${
                isActive
                  ? 'text-on-primary-container'
                  : 'text-on-surface-variant'
              }`}
            >
              <div className={`px-4 py-1 rounded-full transition-colors ${isActive ? 'bg-primary-container' : ''}`}>
                <Icon name={item.icon} size={22} filled={isActive} />
              </div>
              <span className="text-[11px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
