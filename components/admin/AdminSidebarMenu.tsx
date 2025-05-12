"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Bot, Megaphone } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { AdminAvatar } from "@/components/admin/AdminAvatar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

export function AdminSidebarMenu({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<div className="flex items-center justify-center px-2 py-2">
					<Link href="/admin">
						<Image
							src="/logo1024.png"
							alt="DMV Logo"
							width={40}
							height={40}
							className="h-auto w-auto rounded-md"
							priority
						/>
					</Link>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<TooltipProvider>
					<SidebarMenu className="px-2">
						<SidebarMenuItem>
							<Tooltip>
								<TooltipTrigger asChild>
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
								</TooltipTrigger>
								<TooltipContent side="right">Dashboard</TooltipContent>
							</Tooltip>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<Tooltip>
								<TooltipTrigger asChild>
									<SidebarMenuButton
										asChild
										isActive={pathname.startsWith("/admin/marketing")}
										className="data-[active=true]:bg-gray-200 data-[active=true]:text-foreground"
									>
										<Link href="/admin/marketing?tab=calendar">
											<Megaphone />
											<span>Marketing</span>
										</Link>
									</SidebarMenuButton>
								</TooltipTrigger>
								<TooltipContent side="right">Marketing</TooltipContent>
							</Tooltip>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<Tooltip>
								<TooltipTrigger asChild>
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
								</TooltipTrigger>
								<TooltipContent side="right">Agents</TooltipContent>
							</Tooltip>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<Tooltip>
								<TooltipTrigger asChild>
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
								</TooltipTrigger>
								<TooltipContent side="right">Support</TooltipContent>
							</Tooltip>
						</SidebarMenuItem>
					</SidebarMenu>
				</TooltipProvider>
			</SidebarContent>
			<SidebarFooter>
				<AdminAvatar />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
