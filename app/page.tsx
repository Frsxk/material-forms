import Link from 'next/link';
import { LandingHeader } from '@/app/components/landing/LandingHeader';
import { Logo } from '@/app/components/ui/Logo';

const FEATURES = [
  {
    icon: 'edit_note',
    title: 'Intuitive Builder',
    description:
      'Drag, drop, and customize questions with a real-time visual editor. No code needed.',
  },
  {
    icon: 'bar_chart',
    title: 'Live Analytics',
    description:
      'Track responses in real-time with beautiful charts and detailed breakdowns.',
  },
  {
    icon: 'palette',
    title: 'Tonal Theming',
    description:
      'Material Design 3 color system with dynamic tonal palettes for every form.',
  },
  {
    icon: 'devices',
    title: 'Fully Responsive',
    description:
      'Forms look stunning on every device — desktop, tablet, and mobile.',
  },
  {
    icon: 'share',
    title: 'One-Click Share',
    description:
      'Publish and share your form with a single link. Embed anywhere.',
  },
  {
    icon: 'lock',
    title: 'Secure by Default',
    description:
      'End-to-end encryption and GDPR-compliant data handling built in.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <LandingHeader />

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden px-4 md:px-6 pt-28 md:pt-32 pb-16 md:pb-24">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary-container/30 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-tertiary-container/20 blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="gap-2 py-2 mb-8" />

          <h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface mb-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            Build forms that{' '}
            <span className="bg-linear-to-r from-primary to-tertiary bg-clip-text text-transparent">
              people love
            </span>{' '}
            to fill.
          </h1>

          <p
            className="mx-auto max-w-2xl text-lg md:text-xl text-on-surface-variant leading-relaxed mb-10 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Material Forms brings the elegance of Material Design 3 to form building.
            Create stunning surveys, quizzes, and feedback forms with a tonal, modern interface.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-on-primary font-medium shadow-(--m3-shadow-2) hover:shadow-(--m3-shadow-3) transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="material-symbols-rounded text-xl">rocket_launch</span>
              Get Started
            </Link>
            <Link
              href="/builder/demo"
              className="inline-flex items-center gap-2 rounded-full border border-outline px-8 py-3.5 text-primary font-medium hover:bg-primary/8 transition-all duration-300"
            >
              <span className="material-symbols-rounded text-xl">visibility</span>
              Try Demo
            </Link>
          </div>
        </div>

        {/* Builder Preview Card */}
        <div
          className="relative mx-auto mt-12 md:mt-20 max-w-4xl rounded-3xl border border-outline-variant bg-surface-container-low shadow-(--m3-shadow-4) overflow-hidden opacity-0 animate-fade-in-up hidden sm:block"
          style={{ animationDelay: '450ms', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-3 px-6 py-4 border-b border-outline-variant bg-surface-container">
            <Logo size={32} />
            <span className="text-sm font-medium text-on-surface">Quarterly Performance Review</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="rounded-full bg-surface-container-high px-3 py-1.5 text-xs text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-rounded text-sm">visibility</span>
                Preview
              </div>
              <div className="rounded-full bg-primary px-3 py-1.5 text-xs text-on-primary">Publish</div>
            </div>
          </div>
          <div className="p-8 space-y-4">
            {/* Mock question cards */}
            <div className="rounded-2xl bg-surface-container p-6 shadow-sm">
              <span className="font-mono text-xs text-primary tracking-wider uppercase">ID: Q-001 / MULTIPLE_CHOICE</span>
              <p className="mt-3 text-lg font-light text-on-surface">How would you rate your team&apos;s velocity this sprint?</p>
              <div className="mt-4 space-y-2">
                {['Exceptional — Above targets', 'Stable — Meeting all targets'].map((opt) => (
                  <div key={opt} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-(--overlay-1) cursor-pointer">
                    <div className="w-5 h-5 rounded-full border-2 border-outline-variant" />
                    <span className="text-sm text-on-surface">{opt}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-surface-container-low p-6">
              <span className="font-mono text-xs text-primary tracking-wider uppercase">ID: Q-002 / LONG_TEXT</span>
              <p className="mt-3 text-lg font-light text-on-surface">Describe the primary blockers encountered.</p>
              <div className="mt-4 h-16 rounded-xl border border-dashed border-outline-variant bg-(--overlay-1) hover:bg-(--overlay-2) cursor-text" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="px-4 md:px-6 py-16 md:py-24 bg-surface-container-low">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">
              Everything you need to build great forms
            </h2>
            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
              Powerful features wrapped in a beautiful Material Design 3 experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="group rounded-3xl bg-surface p-8 border border-outline-variant hover:border-primary/30 hover:shadow-(--m3-shadow-2) transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-rounded text-on-primary-container text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-on-surface mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-4 md:px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="rounded-3xl md:rounded-[32px] bg-primary-container p-8 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold text-on-primary-container mb-4">
              Ready to build something beautiful?
            </h2>
            <p className="text-on-primary-container/80 text-lg mb-8">
              Start creating forms in seconds. No credit card required.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-on-primary-container px-8 py-3.5 text-primary-container font-medium shadow-(--m3-shadow-2) hover:shadow-(--m3-shadow-3) transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="material-symbols-rounded text-xl">arrow_forward</span>
              Start Building Now
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="px-4 md:px-6 py-8 md:py-12 border-t border-outline-variant">
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <span className="font-semibold text-on-surface">Material Forms</span>
          </div>
          <p className="text-sm text-on-surface-variant">
            &copy; {new Date().getFullYear()} Material Forms. Inspired by Material Design 3.
          </p>
        </div>
      </footer>
    </div>
  );
}
