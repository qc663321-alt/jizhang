import type { ReactNode } from 'react';

interface CuteCardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
}

export default function CuteCard({ children, className = '', gradient = false }: CuteCardProps) {
  const baseStyles = 'rounded-cute-xl shadow-cute p-4 transition-all duration-300';
  
  const gradientStyles = gradient 
    ? 'bg-gradient-to-br from-white to-cute-cream' 
    : 'bg-white';

  return (
    <div className={`${baseStyles} ${gradientStyles} ${className}`}>
      {children}
    </div>
  );
}
