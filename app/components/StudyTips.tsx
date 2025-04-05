import { GraduationCap, Clock } from "lucide-react";

export function StudyTips() {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Study Tips</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <GraduationCap className="text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h3 className="font-medium text-lg">
              Take practice tests regularly
            </h3>
            <p className="text-muted-foreground">
              Regular testing helps reinforce knowledge and identify weak
              areas.
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Clock className="text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h3 className="font-medium text-lg">
              Study in short sessions
            </h3>
            <p className="text-muted-foreground">
              Multiple 20-30 minute sessions are more effective than
              cramming.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 