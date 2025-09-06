"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle, AlertTriangle, X } from "lucide-react";

type ToastVariant = "default" | "success" | "warning" | "destructive";

type ToastItem = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

type ToastContextValue = {
  toast: (item: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timersRef = useRef<Record<string, number>>({});

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    const t = timersRef.current[id];
    if (t) {
      window.clearTimeout(t);
      delete timersRef.current[id];
    }
  }, []);

  const toast = useCallback(
    (item: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).slice(2);
      const durationMs = item.durationMs ?? 2800;
      const next: ToastItem = { ...item, id, durationMs };
      setItems((prev) => [...prev, next]);
      timersRef.current[id] = window.setTimeout(() => remove(id), durationMs);
    },
    [remove]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  useEffect(() => {
    const timersAtMount = timersRef.current;
    return () => {
      Object.values(timersAtMount).forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed z-50 top-4 right-4 left-4 sm:left-auto sm:top-4 sm:bottom-auto flex flex-col gap-3 pointer-events-none max-w-sm sm:max-w-md mx-auto sm:mx-0">
        {items.map((item) => (
          <div key={item.id} className="pointer-events-auto">
            <ToastCard item={item} onClose={() => remove(item.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

const variantClasses: Record<ToastVariant, string> = {
  default: "border-blue-400/30 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-950/40 dark:to-indigo-950/40 shadow-blue-500/10",
  success: "border-green-400/50 bg-gradient-to-r from-emerald-50/95 to-green-50/95 dark:from-emerald-950/50 dark:to-green-950/50 shadow-green-500/20",
  warning: "border-amber-400/50 bg-gradient-to-r from-amber-50/95 to-yellow-50/95 dark:from-amber-950/50 dark:to-yellow-950/50 shadow-amber-500/20",
  destructive: "border-red-400/50 bg-gradient-to-r from-red-50/95 to-rose-50/95 dark:from-red-950/50 dark:to-rose-950/50 shadow-red-500/20",
};

const variantIcons: Record<ToastVariant, React.ComponentType<{ className?: string }>> = {
  default: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  destructive: AlertCircle,
};

const variantIconColors: Record<ToastVariant, string> = {
  default: "text-blue-500 dark:text-blue-400",
  success: "text-green-500 dark:text-green-400",
  warning: "text-amber-500 dark:text-amber-400",
  destructive: "text-red-500 dark:text-red-400",
};

const ToastCard = ({ item, onClose }: { item: ToastItem; onClose: () => void }) => {
  const { title, description, variant = "default" } = item;
  const IconComponent = variantIcons[variant];
  const iconColor = variantIconColors[variant];

  return (
    <Card className={`
      relative overflow-hidden border-2 backdrop-blur-sm
      shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-5
      duration-300 ease-out hover:scale-[1.02] transition-all
      ${variantClasses[variant]}
    `}>
      {/* Animated gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />

      <div className="relative px-3 py-3 sm:px-4 sm:py-4 w-full">
        <div className="flex items-start gap-2 sm:gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 mt-0.5 ${iconColor}`}>
            <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <div className="font-semibold text-foreground mb-1 leading-tight text-sm sm:text-base">
                {title}
              </div>
            )}
            {description && (
              <div className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed">
                {description}
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            aria-label="Close notification"
            className={`
              flex-shrink-0 ml-1 sm:ml-2 p-1.5 sm:p-1 rounded-full transition-all duration-200
              hover:bg-black/10 dark:hover:bg-white/10 active:bg-black/20 dark:active:bg-white/20
              text-muted-foreground hover:text-foreground
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              touch-manipulation min-h-[32px] min-w-[32px] sm:min-h-auto sm:min-w-auto
              flex items-center justify-center
            `}
            onClick={onClose}
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/5">
        <div
          className={`h-full bg-gradient-to-r animate-progress-shrink ${variant === 'success' ? 'from-green-400 to-emerald-500' :
            variant === 'warning' ? 'from-amber-400 to-yellow-500' :
              variant === 'destructive' ? 'from-red-400 to-rose-500' :
                'from-blue-400 to-indigo-500'
          }`}
        />
      </div>
    </Card>
  );
};
