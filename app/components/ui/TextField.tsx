'use client';

import { type InputHTMLAttributes, useState, useId } from 'react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  variant?: 'outlined' | 'filled';
  supportingText?: string;
  error?: boolean;
  errorText?: string;
  leadingIcon?: string;
}

export function TextField({
  label,
  variant = 'outlined',
  supportingText,
  error = false,
  errorText,
  leadingIcon,
  className = '',
  ...props
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const hasValue = Boolean(props.value || props.defaultValue);
  const isActive = focused || hasValue;

  const baseClasses =
    variant === 'outlined'
      ? `border ${error ? 'border-error' : focused ? 'border-primary border-2' : 'border-outline'} bg-transparent`
      : `border-b-2 ${error ? 'border-error' : focused ? 'border-primary' : 'border-on-surface-variant'} bg-surface-container-highest`;

  return (
    <div className={`relative ${className}`}>
      <div className={`relative rounded-t-(--m3-shape-xs) ${variant === 'outlined' ? 'rounded-b-(--m3-shape-xs)' : ''}`}>
        {leadingIcon && (
          <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            {leadingIcon}
          </span>
        )}
        <input
          id={id}
          className={`peer w-full px-4 pt-5 pb-2 text-base text-on-surface rounded-(--m3-shape-xs) outline-none transition-all duration-(--m3-duration-short) ${baseClasses} ${leadingIcon ? 'pl-12' : ''}`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=" "
          {...props}
        />
        <label
          htmlFor={id}
          className={`absolute transition-all duration-(--m3-duration-short) pointer-events-none ${leadingIcon ? 'left-12' : 'left-4'} ${
            isActive
              ? 'top-1 text-xs'
              : 'top-1/2 -translate-y-1/2 text-base'
          } ${error ? 'text-error' : focused ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          {label}
        </label>
      </div>
      {(supportingText || (error && errorText)) && (
        <p className={`mt-1 px-4 text-xs ${error ? 'text-error' : 'text-on-surface-variant'}`}>
          {error ? errorText : supportingText}
        </p>
      )}
    </div>
  );
}
