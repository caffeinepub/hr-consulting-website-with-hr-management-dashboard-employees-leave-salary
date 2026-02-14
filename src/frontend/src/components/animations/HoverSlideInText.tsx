interface HoverSlideInTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function HoverSlideInText({ 
  children, 
  className = '',
  delay = 0 
}: HoverSlideInTextProps) {
  return (
    <span
      className={`inline-block hover-slide-trigger ${className}`}
      style={{
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </span>
  );
}
