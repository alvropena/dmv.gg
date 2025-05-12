// app/admin/layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminLeftSidebar } from "@/components/admin/AdminLeftSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminRightSidebar } from "@/components/admin/AdminRightSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard | DMV.gg - Ace your DMV Knowledge Test ",
	description: "Admin dashboard for DMV.gg.",
};

export default function AdminLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen">
			<SidebarProvider defaultOpen={false}>
				<AdminLeftSidebar />
			</SidebarProvider>
			<div className="flex flex-col h-screen min-h-0">
				<header className="sticky top-0 z-10 border-b bg-white dark:bg-gray-950 dark:border-gray-800 flex h-16 items-center px-6 shrink-0">
					<SidebarTrigger className="mr-4" />
					<div className="flex-1">
						<AdminHeader />
					</div>
				</header>
				<main className="flex-1 min-h-0 overflow-y-auto p-6">{children}</main>
			</div>

			<SidebarProvider defaultOpen={false}>
				<AdminRightSidebar />
			</SidebarProvider>
		</div>
	);
}
