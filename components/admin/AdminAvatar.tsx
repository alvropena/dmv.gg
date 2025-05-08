"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function AdminAvatar() {
	const { user } = useUser();

	return (
		<div className="flex items-center gap-2 px-2 ">
			<Avatar className="h-8 w-8">
				<AvatarImage src={user?.imageUrl} alt={user?.fullName || "Admin"} />
				<AvatarFallback>
					{user?.fullName?.[0]?.toUpperCase() || "A"}
				</AvatarFallback>
			</Avatar>
			<div className="flex flex-col">
				<span className="text-sm font-medium">{user?.fullName || "Admin"}</span>
				<span className="text-xs text-muted-foreground">
					{user?.primaryEmailAddress?.emailAddress}
				</span>
			</div>
		</div>
	);
}
