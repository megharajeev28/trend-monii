import { Inbox } from "lucide-react";

export default function EmptyState({ icon: Icon = Inbox, title = "Nothing here yet", description, action }) {
  return (
    <div className="surface-card flex flex-col items-center justify-center text-center gap-3 py-16 px-6">
      <div className="h-12 w-12 rounded-full bg-ink-50 flex items-center justify-center text-ink-400">
        <Icon size={22} />
      </div>
      <div>
        <p className="font-medium text-ink-800">{title}</p>
        {description && <p className="text-sm text-ink-500 mt-1 max-w-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}
