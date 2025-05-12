import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { UserResource } from "@clerk/types";

interface AvatarDropdownProps {
	user: UserResource | null | undefined;
	onSettings: () => void;
	onNotifications: () => void;
	onLogout: () => void;
}

export default function AvatarDropdown({
	user,
	onSettings,
	onNotifications,
	onLogout,
}: AvatarDropdownProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex flex-row sm:flex-row items-center gap-4 cursor-pointer h-9 min-h-9 px-2 py-0">
					<div>
						<Avatar className="w-9 h-9">
							<AvatarImage src={user?.imageUrl} alt="User" />
							<AvatarFallback>U</AvatarFallback>
						</Avatar>
					</div>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuItem className="cursor-pointer" onClick={onSettings}>
					Settings
				</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer" onClick={onNotifications}>
					Notifications
				</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
