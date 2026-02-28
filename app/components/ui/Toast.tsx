'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from './Icon';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
  duration?: number;
  icon?: string;
}

export function Toast({ message, onDismiss, duration = 5000, icon = 'cloud_off' }: ToastProps) {
  const [visible, setVisible] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevMessageRef = useRef<string | null>(null);

  const dismiss = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    setDismissing(true);
    setTimeout(() => {
      setVisible(false);
      setDismissing(false);
      onDismiss();
    }, 250);
  }, [onDismiss]);

  useEffect(() => {
    if (message && message !== prevMessageRef.current) {
      // Show toast
      if (timerRef.current) clearTimeout(timerRef.current);
      setDismissing(false);
      setVisible(true);

      if (duration > 0) {
        timerRef.current = setTimeout(dismiss, duration);
      }
    } else if (!message && visible) {
      dismiss();
    }
    prevMessageRef.current = message;
  }, [message, duration, dismiss, visible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  if (!visible || !message) return null;

  return (
    <div
      className={`fixed bottom-20 md:bottom-6 left-1/2 z-50 bg-error-container text-on-error-container rounded-xl px-5 py-3 shadow-(--m3-shadow-3) flex items-center gap-3 max-w-sm ${
        dismissing ? 'animate-toast-out' : 'animate-toast-in'
      }`}
    >
      <Icon name={icon} size={20} />
      <span className="text-sm font-medium flex-1">{message}</span>
    <button
      onClick={dismiss}
      className="p-1 rounded-full hover:bg-error/20 transition-colors cursor-pointer self-center"
    >
      <Icon name="close" size={18} />
    </button>
    </div>
  );
}
