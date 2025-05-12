// app/admin/layout.tsx
import { SidebarProvider } from "@/components/ui/sidebar";
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
		<div className="flex h-screen bg-white">
			<SidebarProvider defaultOpen={false}>
				<AdminLeftSidebar />
			</SidebarProvider>
			<div className="flex flex-col h-screen min-h-0 w-full">
				<AdminHeader />
				<main className="flex-1 min-h-0 overflow-y-auto p-6">{children}</main>
			</div>
			<SidebarProvider defaultOpen={true}>
				<AdminRightSidebar view="chat" />
			</SidebarProvider>
		</div>
	);
}
