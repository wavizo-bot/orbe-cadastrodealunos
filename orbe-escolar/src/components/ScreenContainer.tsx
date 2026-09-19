import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface ScreenContainerProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  title?: string;
  showBack?: boolean;
}

export function ScreenContainer({
  children,
  className,
  containerClassName,
  title,
  showBack
}: ScreenContainerProps) {
  return (
    <div className={cn('min-h-screen bg-[#F5F7FA]', containerClassName)}>
      <div className={cn('max-w-md mx-auto px-5 py-4 flex flex-col min-h-screen', className)}>
        {title && (
          <div className="flex items-center gap-3 mb-4">
            {showBack && (
              <button 
                onClick={() => window.history.back()}
                className="h-10 w-10 rounded-full bg-[#E5EEF6] flex items-center justify-center"
              >
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#12365A" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h1 className="text-[#173449] text-lg font-black flex-1 text-center">{title}</h1>
            {showBack && <div className="w-10" />}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default ScreenContainer;
