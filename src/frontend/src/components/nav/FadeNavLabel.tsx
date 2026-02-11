import { ReactNode } from 'react';

interface FadeNavLabelProps {
  children: ReactNode;
  className?: string;
}

export default function FadeNavLabel({ children, className = '' }: FadeNavLabelProps) {
  return (
    <span
      className={`
        inline-block
        motion-safe:animate-fade-in
        motion-safe:hover:opacity-80
        motion-safe:focus-visible:opacity-80
        motion-safe:transition-opacity
        motion-safe:duration-300
        motion-reduce:opacity-100
        ${className}
      `}
    >
      {children}
    </span>
  );
}
