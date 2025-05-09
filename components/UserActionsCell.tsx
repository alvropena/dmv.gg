import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/types";

interface UserActionsCellProps {
	user: User;
	onEdit: (user: User) => void;
	onViewInteractions: (user: User) => void;
}

export function UserActionsCell({
	user,
	onEdit,
	onViewInteractions,
}: UserActionsCellProps) {
	return (
		<td className="px-4 py-3 text-center">
			<div className="flex justify-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<MoreHorizontal className="h-4 w-4" />
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							className="cursor-pointer"
							onClick={() => onEdit(user)}
						>
							Edit User
						</DropdownMenuItem>
						<DropdownMenuItem
							className="cursor-pointer"
							onClick={() => onViewInteractions(user)}
						>
							View Interactions
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</td>
	);
}
