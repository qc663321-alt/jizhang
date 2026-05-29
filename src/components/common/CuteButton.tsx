import type { ReactNode } from 'react';

interface CuteButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export default function CuteButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}: CuteButtonProps) {
  const baseStyles = 'font-medium transition-all duration-300 transform rounded-cute-lg';
  
  const variants = {
    primary: 'bg-gradient-to-r from-cute-pink to-cute-orange text-white hover:shadow-cute-lg',
    secondary: 'bg-white text-gray-700 border-2 border-cute-pink hover:bg-cute-pink hover:text-white',
    ghost: 'bg-transparent text-cute-pink hover:bg-cute-pink/10',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
    >
      {children}
    </button>
  );
}
