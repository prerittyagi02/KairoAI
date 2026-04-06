export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">History</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Your past uploads and AI conversations will appear here once you start using the assistant.
      </p>
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
        No history yet. Upload a report or start a chat to generate records.
      </div>
    </div>
  );
}
