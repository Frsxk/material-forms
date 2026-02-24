'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField } from '@/app/components/ui/TextField';
import { Button } from '@/app/components/ui/Button';
import { Logo } from '@/app/components/ui/Logo';
import { useTheme } from '@/app/components/ThemeProvider';
import { Icon } from '@/app/components/ui/Icon';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const passwordsMatch = password === confirmPassword || confirmPassword === '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) return;
    // UI-only: simulate registration
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left: Decorative Panel */}
      <div className="hidden lg:flex flex-1 bg-tertiary-container items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-tertiary-container to-primary-container/50" />
        <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-tertiary/10 blur-[50px]" />
        <div className="absolute bottom-1/3 left-1/4 w-40 h-40 rounded-full bg-primary/10 blur-[30px]" />
        <div className="relative text-center px-12">
          <div className="w-20 h-20 rounded-3xl bg-on-tertiary-container/10 flex items-center justify-center mx-auto mb-8">
            <Icon name="person_add" size={40} className="text-on-tertiary-container" />
          </div>
          <h2 className="text-3xl font-bold text-on-tertiary-container mb-4">
            Join Material Forms
          </h2>
          <p className="text-on-tertiary-container/70 text-lg max-w-sm">
            Create an account and start building beautiful, responsive forms today.
          </p>
        </div>
      </div>

      {/* Right: Register Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-8 md:py-12 relative">
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <Link
            href="/"
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors"
            aria-label="Back to home"
          >
            <Icon name="arrow_back" size={20} />
          </Link>
        </div>
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} size={20} />
          </button>
        </div>

        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <Logo size={40} />
            <span className="text-xl font-semibold text-on-surface">Material Forms</span>
          </Link>

          <h1 className="text-2xl font-bold text-on-surface mb-4">Create account</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <TextField
              label="Full name"
              leadingIcon="person"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Email"
              type="email"
              leadingIcon="mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              leadingIcon="lock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              supportingText="At least 8 characters"
            />
            <TextField
              label="Confirm password"
              type="password"
              leadingIcon="lock"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={!passwordsMatch}
              errorText="Passwords do not match"
            />

            <Button variant="filled" className="w-full" type="submit">
              Create account
            </Button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="text-xs text-on-surface-variant uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          <Button variant="outlined" className="w-full" icon="public">
            Continue with Google
          </Button>

          <p className="text-center text-sm text-on-surface-variant mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
