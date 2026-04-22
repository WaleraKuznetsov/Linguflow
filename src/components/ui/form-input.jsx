import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

const FormInput = ({
  label,
  icon: Icon,
  error,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          {Icon && <Icon size={16} />}
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={cn(
            "flex h-11 w-full rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-all outline-none",
            "placeholder:text-muted-foreground",
            "focus:ring-1 focus:ring-primary/50 focus:border-primary",
            "hover:border-primary/70",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-destructive focus:ring-destructive/50"
              : "border-border",
            className
          )}
          {...props}
        />
        {error && (
          <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-destructive" size={18} />
        )}
      </div>
{error && (
          <p className="text-xs text-destructive font-medium">{error}</p>
        )}
    </div>
  );
};

export { FormInput };
