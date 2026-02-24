import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 36, className = '' }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Material Forms"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      priority
    />
  );
}
