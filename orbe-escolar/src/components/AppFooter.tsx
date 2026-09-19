import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface AppFooterProps {
  className?: string;
}

export function AppFooter({ className }: AppFooterProps = {}) {
  return (
    <footer className={cn('py-4 text-center', className)}>
      <div className="text-[#71869A] text-xs font-medium tracking-wide">
        Gerencial Escolar
      </div>
    </footer>
  );
}
