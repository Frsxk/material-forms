'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { BuilderHeader } from '@/app/components/builder/BuilderHeader';
import { QuestionCard } from '@/app/components/builder/QuestionCard';
import { Inspector } from '@/app/components/builder/Inspector';
import { Icon } from '@/app/components/ui/Icon';
import { getFormById } from '@/lib/mock-data';
import type { Question, QuestionType } from '@/lib/types';

const RAIL_ITEMS: { icon: string; label: string; active?: boolean }[] = [
  { icon: 'edit_note', label: 'Editor', active: true },
  { icon: 'palette', label: 'Theme' },
  { icon: 'bar_chart', label: 'Stats' },
  { icon: 'settings', label: 'Settings' },
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
  const formId = params.id as string;
  const existingForm = getFormById(formId);

  const [title, setTitle] = useState(existingForm?.title ?? 'Untitled Form');
  const [questions, setQuestions] = useState<Question[]>(
    existingForm?.questions ?? [createNewQuestion()]
  );
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    questions[0]?.id ?? null
  );
  const [inspectorOpen, setInspectorOpen] = useState(false);

  const activeQuestion = questions.find((q) => q.id === activeQuestionId) ?? null;

  const handleUpdateQuestion = useCallback(
    (updated: Question) => {
      setQuestions((prev) =>
        prev.map((q) => (q.id === updated.id ? updated : q))
      );
    },
    []
  );

  const handleDeleteQuestion = useCallback(
    (id: string) => {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      if (activeQuestionId === id) setActiveQuestionId(null);
    },
    [activeQuestionId]
  );

  const handleDuplicateQuestion = useCallback(
    (id: string) => {
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
    },
    []
  );

  const handleAddQuestion = () => {
    const newQ = createNewQuestion();
    setQuestions((prev) => [...prev, newQ]);
    setActiveQuestionId(newQ.id);
  };

  return (
    <div className="h-screen flex flex-col bg-surface overflow-hidden">
      <BuilderHeader title={title} onTitleChange={setTitle} formId={formId} />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Rail (desktop) */}
        <aside className="hidden md:flex flex-col items-center w-16 py-6 gap-4 bg-surface border-r border-outline-variant shrink-0">
          {RAIL_ITEMS.map((item) => (
            <button
              key={item.label}
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

        {/* Builder Canvas */}
        <main className="flex-1 overflow-y-auto px-4 md:px-10 py-6 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-5">
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                isActive={q.id === activeQuestionId}
                onClick={() => setActiveQuestionId(q.id)}
                onUpdate={handleUpdateQuestion}
                onDelete={() => handleDeleteQuestion(q.id)}
                onDuplicate={() => handleDuplicateQuestion(q.id)}
              />
            ))}
          </div>

          {/* FAB row (mobile: bottom-right, desktop: offset from inspector) */}
          <div className="fixed bottom-6 right-4 md:bottom-8 md:right-[360px] z-20 flex flex-col gap-3">
            {/* Mobile-only: inspector toggle */}
            <button
              onClick={() => setInspectorOpen(true)}
              className="md:hidden w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container shadow-(--m3-shadow-3) hover:shadow-(--m3-shadow-4) hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              <Icon name="tune" size={24} />
            </button>
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
          question={activeQuestion}
          onUpdate={handleUpdateQuestion}
          mobileOpen={inspectorOpen}
          onMobileClose={() => setInspectorOpen(false)}
        />
      </div>
    </div>
  );
}
