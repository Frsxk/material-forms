'use client';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      {label && <span className="text-sm text-on-surface">{label}</span>}
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-[52px] h-[32px] rounded-full transition-colors duration-(--m3-duration-medium) ease-(--m3-ease-standard) cursor-pointer ${
          checked ? 'bg-primary' : 'bg-surface-container-highest'
        } border-2 ${checked ? 'border-primary' : 'border-outline'}`}
      >
        <span
          className={`absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-(--m3-duration-medium) ease-(--m3-ease-spring) ${
            checked
              ? 'left-[22px] w-6 h-6 bg-on-primary'
              : 'left-[4px] w-4 h-4 bg-outline'
          }`}
        />
      </button>
    </label>
  );
}
