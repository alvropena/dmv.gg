import React from "react";

type UserAnalyticsProps = {
  className?: string;
};

export function UserAnalytics() {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Analytics</h2>
      </div>
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-6">
        <p className="text-muted-foreground">
          Your test performance analytics will appear here as you
          complete more tests.
        </p>
      </div>
    </div>
  );
}