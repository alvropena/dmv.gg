import { Loader2 } from "lucide-react";

export function SubscriptionsCard({ count, isLoading, error }: { count: number; isLoading: boolean; error: string | null }) {
  return (
    <div className="rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <h3 className="text-xl font-bold">Subscriptions</h3>
      <div className="mt-2">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : (
          <span className="text-4xl font-bold">{count}</span>
        )}
      </div>
    </div>
  );
} 