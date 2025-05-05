"use client";

import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	Megaphone,
	MessageSquare,
	CreditCard,
} from "lucide-react";
import {
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function AdminSidebarMenu() {
	const pathname = usePathname();

	return (
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
					isActive={pathname === "/admin/marketing"}
					className="data-[active=true]:bg-gray-200 data-[active=true]:text-foreground"
				>
					<Link href="/admin/marketing">
						<Megaphone />
						<span>Marketing</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
			<SidebarMenuItem>
				<SidebarMenuButton
					asChild
					isActive={pathname === "/admin/subscriptions"}
					className="data-[active=true]:bg-gray-200 data-[active=true]:text-foreground"
				>
					<Link href="/admin/subscriptions">
						<CreditCard />
						<span>Subscriptions</span>
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
	);
}
