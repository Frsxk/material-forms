'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getPublicForm, submitForm } from '@/lib/api';
import { Icon } from '@/app/components/ui/Icon';
import { useTheme } from '@/app/components/ThemeProvider';
import type { PublicForm } from '@/lib/api';
import type { Question } from '@/lib/types';

export default function PublicFormPage() {
  const params = useParams();
  const formId = params.id as string;
  const { theme, toggleTheme } = useTheme();

  const [form, setForm] = useState<PublicForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getPublicForm(formId)
      .then(setForm)
      .catch((err) => setError(err.message || 'Failed to load form'))
      .finally(() => setLoading(false));
  }, [formId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 animate-scale-in">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4 md:px-6">
        <div className="text-center max-w-md animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mx-auto mb-4">
            <Icon name="error" size={32} />
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2">Form Error</h2>
          <p className="text-on-surface-variant">{error || 'Form not found or is closed.'}</p>
        </div>
      </div>
    );
  }

  const totalQuestions = form.questions.length;
  // Fallback to 1 question to prevent divide by zero if form has 0 questions
  const progress = totalQuestions > 0 ? ((currentStep + 1) / totalQuestions) * 100 : 100;

  const updateAnswer = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Clear validation error if user answers it
    if (validationErrors[questionId]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    form.questions.forEach((q) => {
      if (q.required) {
        const answer = answers[q.id];
        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
          errors[q.id] = 'This question requires an answer.';
        }
      }
    });
    setValidationErrors(errors);
    
    // Jump to the first question with an error
    const firstErrorId = Object.keys(errors)[0];
    if (firstErrorId) {
      const idx = form.questions.findIndex((q) => q.id === firstErrorId);
      if (idx !== -1) {
        setCurrentStep(idx);
      }
    }
    
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await submitForm(formId, answers);
      setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
      // In a real app we might show a toast here. Re-using validation error state for simplicity.
      setValidationErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4 md:px-6">
        <div className="text-center max-w-md animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center mx-auto mb-6">
            <Icon name="check" size={40} className="text-on-primary-container" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-3">Thank you!</h1>
          <p className="text-on-surface-variant mb-8">
            Your response to &ldquo;{form.title}&rdquo; has been recorded successfully.
          </p>
          <button
            onClick={() => { setSubmitted(false); setAnswers({}); setCurrentStep(0); setValidationErrors({}); }}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-on-primary cursor-pointer hover:shadow-(--m3-shadow-1) transition-all"
          >
            <Icon name="refresh" size={18} />
            Submit another response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Theme toggle */}
      <div className="fixed bottom-4 left-4 z-20">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer shadow-(--m3-shadow-1)"
        >
          <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} size={20} />
        </button>
      </div>

      {/* Header */}
      <div className="px-4 md:px-6 pt-10 md:pt-12 pb-6 md:pb-8 max-w-2xl mx-auto">
        <div
          className="h-2 rounded-full mb-8"
          style={{ backgroundColor: form.themeColor || '#6750A4' }}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">{form.title}</h1>
        {form.description && (
          <p className="text-on-surface-variant text-base">{form.description}</p>
        )}
        <p className="text-sm text-error mt-3 flex items-center gap-1">
          <Icon name="emergency" size={14} />
          * Indicates required question
        </p>
      </div>

      {/* Progress */}
      {totalQuestions > 0 && (
        <div className="px-4 md:px-6 max-w-2xl mx-auto mb-6">
          <div className="h-1 rounded-full bg-surface-container-highest overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-on-surface-variant mt-2 text-right">
            {currentStep + 1} of {totalQuestions}
          </p>
        </div>
      )}

      {/* Questions */}
      <div className="px-4 md:px-6 pb-16 max-w-2xl mx-auto space-y-5 md:space-y-6">
        {form.questions.map((question, i) => (
          <div
            key={question.id}
            className={`rounded-3xl bg-surface-container-low border border-outline-variant p-5 md:p-8 transition-all duration-300 ${
              currentStep === i ? 'border-primary shadow-(--m3-shadow-1)' : ''
            } ${validationErrors[question.id] ? 'border-error' : ''}`}
            onClick={() => setCurrentStep(i)}
          >
            <h2 className="text-lg font-medium text-on-surface mb-1">
              {question.title}
              {question.required && <span className="text-error ml-1">*</span>}
            </h2>
            <div className="mt-5">
              <QuestionInput
                question={question}
                value={answers[question.id]}
                onChange={(val) => updateAnswer(question.id, val)}
              />
            </div>
            {validationErrors[question.id] && (
              <div className="mt-3 text-sm text-error flex items-center gap-1">
                <Icon name="error" size={16} />
                {validationErrors[question.id]}
              </div>
            )}
          </div>
        ))}

        {validationErrors.submit && (
          <div className="p-4 rounded-xl bg-error-container text-on-error-container flex items-center gap-2">
            <Icon name="error" size={20} />
            <p className="text-sm font-medium">{validationErrors.submit}</p>
          </div>
        )}

        {/* Submit */}
        {totalQuestions > 0 && (
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-on-primary font-medium cursor-pointer hover:shadow-(--m3-shadow-2) transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Submitting
                </>
              ) : (
                'Submit'
              )}
            </button>
            <button
              onClick={() => { setAnswers({}); setCurrentStep(0); setValidationErrors({}); }}
              disabled={submitting}
              className="text-sm text-primary font-medium hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear form
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string | string[] | undefined;
  onChange: (val: string | string[]) => void;
}) {
  switch (question.type) {
    case 'multiple_choice':
      return (
        <div className="space-y-2">
          {question.options?.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                value === opt.id
                  ? 'bg-primary-container'
                  : 'hover:bg-(--overlay-1)'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  value === opt.id ? 'border-primary' : 'border-outline-variant'
                }`}
              >
                {value === opt.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </div>
              <span className={`text-sm ${value === opt.id ? 'text-on-primary-container font-medium' : 'text-on-surface'}`}>
                {opt.label}
              </span>
              <input
                type="radio"
                name={question.id}
                value={opt.id}
                checked={value === opt.id}
                onChange={() => onChange(opt.id)}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      );

    case 'checkbox': {
      const selected = (Array.isArray(value) ? value : []) as string[];
      return (
        <div className="space-y-2">
          {question.options?.map((opt) => {
            const isChecked = selected.includes(opt.id);
            return (
              <label
                key={opt.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                  isChecked ? 'bg-primary-container' : 'hover:bg-(--overlay-1)'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-[4px] border-2 flex items-center justify-center transition-colors ${
                    isChecked ? 'bg-primary border-primary' : 'border-outline-variant'
                  }`}
                >
                  {isChecked && <Icon name="check" size={14} className="text-on-primary" />}
                </div>
                <span className={`text-sm ${isChecked ? 'text-on-primary-container font-medium' : 'text-on-surface'}`}>
                  {opt.label}
                </span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    const newVal = isChecked
                      ? selected.filter((s) => s !== opt.id)
                      : [...selected, opt.id];
                    onChange(newVal);
                  }}
                  className="sr-only"
                />
              </label>
            );
          })}
        </div>
      );
    }

    case 'short_text':
      return (
        <input
          type="text"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || 'Your answer'}
          className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary outline-none py-2 text-on-surface text-base transition-colors placeholder:text-on-surface-variant/50"
        />
      );

    case 'long_text':
      return (
        <textarea
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || 'Your answer'}
          rows={4}
          className="w-full bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none p-4 text-on-surface text-base transition-colors placeholder:text-on-surface-variant/50 resize-none"
        />
      );

    case 'scale': {
      const min = question.scaleMin ?? 1;
      const max = question.scaleMax ?? 5;
      const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      const selected = value ? parseInt(value as string) : null;
      return (
        <div>
          <div className="flex items-center justify-between gap-2 py-4">
            {steps.map((step) => (
              <button
                key={step}
                onClick={() => onChange(step.toString())}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all cursor-pointer ${
                  selected === step
                    ? 'bg-primary text-on-primary shadow-(--m3-shadow-1)'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                }`}
              >
                {step}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant mt-1">
            <span>{question.scaleMinLabel}</span>
            <span>{question.scaleMaxLabel}</span>
          </div>
        </div>
      );
    }

    case 'dropdown':
      return (
        <select
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none px-4 py-3 text-on-surface text-base appearance-none cursor-pointer"
        >
          <option value="">Select an option</option>
          {question.options?.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case 'date':
      return (
        <input
          type="date"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-surface-container rounded-xl border border-outline-variant focus:border-primary outline-none px-4 py-3 text-on-surface text-base cursor-pointer"
        />
      );

    case 'rating': {
      const ratingMax = question.ratingMax ?? 5;
      const selected = value ? parseInt(value as string) : 0;
      return (
        <div className="flex gap-1 py-2">
          {Array.from({ length: ratingMax }, (_, i) => (
            <button
              key={i}
              onClick={() => onChange((i + 1).toString())}
              className="cursor-pointer transition-transform hover:scale-125"
            >
              <Icon
                name="star"
                size={36}
                filled={i < selected}
                className={i < selected ? 'text-primary' : 'text-outline-variant'}
              />
            </button>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}
