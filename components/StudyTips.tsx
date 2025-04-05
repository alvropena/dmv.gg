import { GraduationCap, Clock, BookOpen, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StudyTips() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Study Tips</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-3">
              <div className="w-12 h-12 mb-2 sm:mb-0 sm:w-10 sm:h-10 sm:min-w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <GraduationCap className="h-6 w-6 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-medium text-base">
                  Take practice tests regularly
                </h3>
                <p className="text-sm text-muted-foreground">
                  Reinforces knowledge and identifies weak areas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-3">
              <div className="w-12 h-12 mb-2 sm:mb-0 sm:w-10 sm:h-10 sm:min-w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-medium text-base">
                  Study in short sessions
                </h3>
                <p className="text-sm text-muted-foreground">
                  Short sessions are more effective than cramming.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-3">
              <div className="w-12 h-12 mb-2 sm:mb-0 sm:w-10 sm:h-10 sm:min-w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-medium text-base">
                  Review the handbook
                </h3>
                <p className="text-sm text-muted-foreground">
                  Focus on sections where you make mistakes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-3">
              <div className="w-12 h-12 mb-2 sm:mb-0 sm:w-10 sm:h-10 sm:min-w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-medium text-base">
                  Use memory techniques
                </h3>
                <p className="text-sm text-muted-foreground">
                  Mnemonics help remember signs and rules.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 