export default function SentimentCard({ topic, positive, neutral, negative }) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-sm font-medium text-ink-900">{topic}</p>
        <span
          className={`text-xs font-semibold ${
            positive >= 60 ? "text-signal2-600" : negative >= 40 ? "text-rose-500" : "text-amber-500"
          }`}
        >
          {positive >= 60 ? "Positive" : negative >= 40 ? "Negative" : "Neutral"} {Math.max(positive, neutral, negative)}%
        </span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-ink-100">
        <div className="bg-signal2-500" style={{ width: `${positive}%` }} title={`Positive ${positive}%`} />
        <div className="bg-ink-300" style={{ width: `${neutral}%` }} title={`Neutral ${neutral}%`} />
        <div className="bg-rose-500" style={{ width: `${negative}%` }} title={`Negative ${negative}%`} />
      </div>
      <div className="flex items-center gap-3 mt-2 text-[11px] text-ink-400">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-signal2-500" />Positive {positive}%</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-ink-300" />Neutral {neutral}%</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" />Negative {negative}%</span>
      </div>
    </div>
  );
}
