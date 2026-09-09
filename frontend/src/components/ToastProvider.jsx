import { createContext, useCallback, useState } from "react";
import { CheckCircle2, X, XCircle, Info } from "lucide-react";

export const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, variant = "info") => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  const api = {
    success: (msg) => push(msg, "success"),
    error: (msg) => push(msg, "error"),
    info: (msg) => push(msg, "info"),
  };

  const icons = { success: CheckCircle2, error: XCircle, info: Info };
  const styles = {
    success: "border-signal2-500/30 text-signal2-600",
    error: "border-rose-500/30 text-rose-500",
    info: "border-signal-500/30 text-signal-600",
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2.5rem)]" role="status" aria-live="polite">
        {toasts.map((t) => {
          const Icon = icons[t.variant];
          return (
            <div
              key={t.id}
              className={`surface-card flex items-start gap-3 p-3.5 border-l-[3px] animate-fade-in ${styles[t.variant]}`}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <p className="text-sm text-ink-800 flex-1">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="text-ink-300 hover:text-ink-600"
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
