/* eslint-disable linebreak-style */
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

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
      <div className="fixed z-50 bottom-4 right-4 flex flex-col gap-2">
        {items.map((item) => (
          <ToastCard key={item.id} item={item} onClose={() => remove(item.id)} />
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
  default: "border-border/50 bg-card",
  success: "border-green-500/40 bg-green-500/10",
  warning: "border-yellow-500/40 bg-yellow-500/10",
  destructive: "border-red-500/40 bg-red-500/10",
};

const ToastCard = ({ item, onClose }: { item: ToastItem; onClose: () => void }) => {
  const { title, description, variant = "default" } = item;
  return (
    <Card className={`border-2 shadow-lg animate-in fade-in-0 zoom-in-95 ${variantClasses[variant]} `}>
      <div className="px-4 py-3 min-w-[260px] max-w-[360px]">
        {title && <div className="font-semibold mb-0.5">{title}</div>}
        {description && (
          <div className="text-sm text-muted-foreground">{description}</div>
        )}
        <button
          aria-label="Close toast"
          className="absolute top-1.5 right-2 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </Card>
  );
};
