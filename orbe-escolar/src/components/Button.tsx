import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function ActionButton({ 
  label, 
  onPress, 
  variant = 'primary', 
  disabled = false,
  className,
  style 
}: ButtonProps) {
  const baseStyles = 'w-full py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-150 active:scale-98';
  
  const variants = {
    primary: 'bg-[#0E7490] text-white hover:bg-[#0D5E77] disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-[#EEF3F7] text-[#0D5E77] hover:bg-[#E2F4F7] disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'bg-[#B03939] text-white hover:bg-[#983636] disabled:opacity-50 disabled:cursor-not-allowed',
  };

  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], className)}
      style={style}
    >
      {label}
    </button>
  );
}

interface CardButtonProps {
  icon: ReactNode;
  label: string;
  subtitle: string;
  to: string;
}

export function CardButton({ icon, label, subtitle, to }: CardButtonProps) {
  return (
    <Link
      to={to}
      className="min-h-[88px] p-[14px] rounded-2xl bg-white border border-[#D8E4ED] flex flex-row items-center gap-[13px] active:opacity-78 active:scale-99 transition-all"
    >
      <div className="h-12 w-12 rounded-xl bg-[#E2F4F7] flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <span className="text-[#173449] text-lg font-extrabold">{label}</span>
        <span className="text-[#617386] text-xs leading-relaxed">{subtitle}</span>
      </div>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6C8296" strokeWidth="2">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </Link>
  );
}
