import { Badge } from "@/components/ui/badge";
import { Shield, Glasses } from "lucide-react";

export function RoleBadge({ role }: { role: string }) {
	switch (role?.toUpperCase()) {
		case "ADMIN":
			return (
				<Badge
					variant="outline"
					className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30 w-20"
				>
					<Shield className="mr-1 h-3 w-3" />
					Admin
				</Badge>
			);
		case "STUDENT":
			return (
				<Badge
					variant="outline"
					className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-950/20 dark:text-gray-400 dark:border-gray-900/30 w-20"
				>
					<Glasses className="mr-1 h-3 w-3" />
					Student
				</Badge>
			);
		default:
			return (
				<Badge
					variant="outline"
					className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-950/20 dark:text-gray-400 dark:border-gray-900/30 w-20"
				>
					<Glasses className="mr-1 h-3 w-3" />
					{role || "Student"}
				</Badge>
			);
	}
}
