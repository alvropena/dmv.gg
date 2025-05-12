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

const menuItems = [
	{
		label: "Dashboard",
		icon: <LayoutDashboard />,
		path: "",
		isActive: (pathname: string, isAdminSubdomain: boolean) =>
			pathname === (isAdminSubdomain ? "/" : "/admin"),
	},
	{
		label: "Marketing",
		icon: <Megaphone />,
		path: "marketing?tab=calendar",
		isActive: (pathname: string, isAdminSubdomain: boolean) =>
			pathname.startsWith(isAdminSubdomain ? "/marketing" : "/admin/marketing"),
	},
	{
		label: "Agents",
		icon: <Bot />,
		path: "agents",
		isActive: (pathname: string, isAdminSubdomain: boolean) =>
			pathname === (isAdminSubdomain ? "/agents" : "/admin/agents"),
	},
	{
		label: "Support",
		icon: <MessageSquare />,
		path: "support",
		isActive: (pathname: string, isAdminSubdomain: boolean) =>
			pathname === (isAdminSubdomain ? "/support" : "/admin/support"),
	},
];

export function AdminLeftSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	const isAdminSubdomain =
		typeof window !== "undefined" &&
		window.location.hostname.startsWith("admin.");

	const getHref = (path: string) =>
		isAdminSubdomain ? `/${path}` : `/admin${path ? `/${path}` : ""}`;

	return (
		<Sidebar collapsible="icon" {...props} side="left">
			<SidebarHeader>
				<div className="flex items-center justify-center px-2 py-2">
					<Link href={getHref("")}>
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
						{menuItems.map((item) => (
							<SidebarMenuItem key={item.label}>
								<Tooltip>
									<TooltipTrigger asChild>
										<SidebarMenuButton
											asChild
											isActive={item.isActive(pathname, isAdminSubdomain)}
											className="data-[active=true]:bg-gray-200 data-[active=true]:text-foreground"
										>
											<Link href={getHref(item.path)}>
												{item.icon}
												<span>{item.label}</span>
											</Link>
										</SidebarMenuButton>
									</TooltipTrigger>
									<TooltipContent side="right">{item.label}</TooltipContent>
								</Tooltip>
							</SidebarMenuItem>
						))}
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
