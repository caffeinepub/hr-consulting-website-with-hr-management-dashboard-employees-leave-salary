import React from 'react';

interface MobileMenuToggleIconProps {
  open: boolean;
}

export default function MobileMenuToggleIcon({ open }: MobileMenuToggleIconProps) {
  return (
    <div className="relative w-6 h-6 flex items-center justify-center" aria-hidden="true">
      <div className="absolute w-6 flex flex-col items-center justify-center gap-1.5">
        {/* Top line */}
        <span
          className={`block h-0.5 w-6 bg-current rounded-full motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out ${
            open ? 'motion-safe:rotate-45 motion-safe:translate-y-2' : ''
          } motion-reduce:${open ? 'hidden' : 'block'}`}
        />
        {/* Middle line */}
        <span
          className={`block h-0.5 w-6 bg-current rounded-full motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out ${
            open ? 'motion-safe:opacity-0 motion-safe:scale-0' : ''
          } motion-reduce:${open ? 'hidden' : 'block'}`}
        />
        {/* Bottom line */}
        <span
          className={`block h-0.5 w-6 bg-current rounded-full motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out ${
            open ? 'motion-safe:-rotate-45 motion-safe:-translate-y-2' : ''
          } motion-reduce:${open ? 'hidden' : 'block'}`}
        />
        {/* X lines for reduced motion */}
        {open && (
          <>
            <span className="hidden motion-reduce:block absolute h-0.5 w-6 bg-current rounded-full rotate-45" />
            <span className="hidden motion-reduce:block absolute h-0.5 w-6 bg-current rounded-full -rotate-45" />
          </>
        )}
      </div>
    </div>
  );
}
