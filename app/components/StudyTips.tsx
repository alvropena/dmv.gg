import { GraduationCap, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StudyTips() {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Study Tips</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 min-w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-md sm:text-lg">
                  Take practice tests regularly
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Regular testing helps reinforce knowledge and identify weak
                  areas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 min-w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-md sm:text-lg">
                  Study in short sessions
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Multiple 20-30 minute sessions are more effective than
                  cramming.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 