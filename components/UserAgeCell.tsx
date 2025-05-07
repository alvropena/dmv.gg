import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserAgeCellProps {
  birthday?: string;
}

export function UserAgeCell({ birthday }: UserAgeCellProps) {
  return (
    <td className="px-4 py-3 text-center">
      {birthday ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                {Math.floor(
                  (new Date().getTime() - new Date(birthday).getTime()) /
                    (365.25 * 24 * 60 * 60 * 1000)
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {new Date(birthday).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        "-"
      )}
    </td>
  );
} 