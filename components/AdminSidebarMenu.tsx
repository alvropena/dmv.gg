"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	MessageSquare,
	Bot,
	Calendar,
	Settings,
	LogOut,
} from "lucide-react";
import {
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { AdminAvatar } from "@/components/AdminAvatar";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";

export function AdminSidebarMenu() {
	const pathname = usePathname();
	const { signOut } = useClerk();
	const [open, setOpen] = useState(false);

	return (
		<div className="flex flex-col h-full">
			<SidebarMenu className="px-2">
				<SidebarMenuItem>
					<SidebarMenuButton
						asChild
						isActive={pathname === "/admin"}
						className="data-[active=true]:bg-gray-200 data-[active=true]:text-foreground"
					>
						<Link href="/admin">
							<LayoutDashboard />
							<span>Dashboard</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem>
					<SidebarMenuButton
						asChild
						isActive={pathname === "/admin/calendar"}
						className="data-[active=true]:bg-gray-200 data-[active=true]:text-foreground"
					>
						<Link href="/admin/calendar">
							<Calendar />
							<span>Calendar</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem>
					<SidebarMenuButton
						asChild
						isActive={pathname === "/admin/agents"}
						className="data-[active=true]:bg-gray-200 data-[active=true]:text-foreground"
					>
						<Link href="/admin/agents">
							<Bot />
							<span>Agents</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem>
					<SidebarMenuButton
						asChild
						isActive={pathname === "/admin/support"}
						className="data-[active=true]:bg-gray-200 data-[active=true]:text-foreground"
					>
						<Link href="/admin/support">
							<MessageSquare />
							<span>Support</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
			<div className="mt-auto p-4 space-y-4">
				<AdminAvatar />
				<div className="space-y-2">
					<Button
						variant="ghost"
						className="w-full justify-start"
						onClick={() => setOpen(true)}
					>
						<Settings className="mr-2 h-4 w-4" />
						Settings
					</Button>
					<Button
						variant="ghost"
						className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
						onClick={() => signOut()}
					>
						<LogOut className="mr-2 h-4 w-4" />
						Logout
					</Button>
				</div>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Settings</DialogTitle>
							<DialogDescription>
								Update your admin settings below.
							</DialogDescription>
						</DialogHeader>
						{/* Settings options placeholder */}
						<div className="space-y-4 mt-4">
							<div className="text-sm text-muted-foreground">
								Settings options go here.
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
