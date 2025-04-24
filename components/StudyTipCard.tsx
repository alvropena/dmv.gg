import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StudyTipCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function StudyTipCard({ icon: Icon, title, description }: StudyTipCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full">
        <div className="flex flex-col items-center sm:flex-row sm:gap-3 h-full">
          <div className="w-14 h-14 mb-2 sm:mb-0 sm:w-12 sm:h-12 sm:min-w-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex shrink-0 items-center justify-center">
            <Icon className="h-7 w-7 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-center sm:text-left flex flex-col justify-center">
            <h3 className="font-medium text-base leading-tight">{title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 