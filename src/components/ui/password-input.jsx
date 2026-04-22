import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const PasswordInput = ({
  label,
  error,
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className={cn(
            "flex h-11 w-full rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-all outline-none pr-12",
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
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {error && (
          <AlertCircle className="absolute right-12 top-1/2 -translate-y-1/2 text-destructive" size={18} />
        )}
      </div>
{error && (
          <p className="text-xs text-destructive font-medium">{error}</p>
        )}
    </div>
  );
};

export { PasswordInput };
