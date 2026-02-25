import { useInView } from '@/hooks/useInView';

interface SlideInOnViewTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function SlideInOnViewText({ 
  children, 
  className = '',
  delay = 0 
}: SlideInOnViewTextProps) {
  const { ref, isInView } = useInView({ 
    threshold: 0.3, 
    triggerOnce: true 
  });

  return (
    <span
      ref={ref}
      className={`inline-block ${
        isInView ? 'motion-safe:animate-slide-in-right' : 'opacity-0'
      } ${className}`}
      style={{
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </span>
  );
}
