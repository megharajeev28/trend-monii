import { AlertTriangle, RotateCcw } from "lucide-react";
import Button from "./Button.jsx";

export default function ErrorState({ message = "Something went wrong while loading this data.", onRetry }) {
  return (
    <div className="surface-card flex flex-col items-center justify-center text-center gap-3 py-16 px-6">
      <div className="h-12 w-12 rounded-full bg-rose-400/10 flex items-center justify-center text-rose-500">
        <AlertTriangle size={22} />
      </div>
      <div>
        <p className="font-medium text-ink-800">Couldn't load this data</p>
        <p className="text-sm text-ink-500 mt-1 max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" icon={RotateCcw} onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
