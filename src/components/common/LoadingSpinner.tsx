interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-4 border-cute-pink/30"></div>
        <div className={`${sizes[size]} rounded-full border-4 border-transparent border-t-cute-pink animate-spin`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">💫</span>
        </div>
      </div>
      {text && (
        <span className="text-gray-600 text-sm">{text}</span>
      )}
    </div>
  );
}
