"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { AdminNotificationsButton } from "@/components/AdminNotificationsButton";
import { AdminAvatar } from "@/components/AdminAvatar";
import { Input } from "@/components/ui/input";
import { TimeHorizonDropdown } from "@/components/TimeHorizonDropdown";

export function AdminHeader() {
	return (
		<header className="sticky top-0 z-10 border-b bg-white dark:bg-gray-950 dark:border-gray-800">
			<div className="flex h-16 items-center justify-between px-6">
				<div className="flex items-center gap-2">
					<Link href="/admin" className="flex items-center">
						<Image
							src="/logo.png"
							alt="DMV Logo"
							width={60}
							height={20}
							className="h-auto w-auto rounded-full"
							priority
						/>
					</Link>
				</div>
				<div className="flex items-center gap-4">
					<TimeHorizonDropdown />
					<div className="relative hidden md:block">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search..."
							className="w-64 pl-8"
						/>
					</div>

					<AdminNotificationsButton />
					<AdminAvatar />
				</div>
			</div>
		</header>
	);
}
