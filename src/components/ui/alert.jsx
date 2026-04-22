import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

const Alert = ({ variant = 'info', children, className }) => {
  const variants = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-800 dark:text-emerald-300',
      icon: CheckCircle2,
    },
    error: {
      bg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800',
      text: 'text-rose-800 dark:text-rose-300',
      icon: XCircle,
    },
    info: {
      bg: 'bg-primary/10 dark:bg-primary/15 border-primary/30 dark:border-primary/30',
      text: 'text-primary dark:text-primary',
      icon: Info,
    },
    default: {
      bg: 'bg-muted border-border',
      text: 'text-foreground',
      icon: Info,
    },
  };

  const { bg, text, icon: Icon } = variants[variant] || variants.default;

  return (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-xl border",
      bg, text, className
    )}>
      <Icon size={20} className="shrink-0 mt-0.5" />
      <div className="text-sm font-medium">{children}</div>
    </div>
  );
};

export { Alert };
