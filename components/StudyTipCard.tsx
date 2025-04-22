import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StudyTipCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function StudyTipCard({ icon: Icon, title, description }: StudyTipCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-3">
          <div className="w-12 h-12 mb-2 sm:mb-0 sm:w-10 sm:h-10 sm:min-w-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <Icon className="h-6 w-6 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-medium text-base">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 