// app/admin/layout.tsx
import {
	Sidebar,
	SidebarContent,
	SidebarProvider,
	SidebarInset,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminSidebarMenu } from "@/components/admin/AdminSidebarMenu";
import { AdminHeader } from "@/components/admin/AdminHeader";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard | DMV.gg - Ace your DMV Knowledge Test ",
	description: "Admin dashboard for DMV.gg.",
};

export default function AdminLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<SidebarProvider defaultOpen={false}>
			<Sidebar collapsible="icon">
				<SidebarContent>
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
					<AdminSidebarMenu />
				</SidebarContent>
			</Sidebar>
			<SidebarInset>
				<div className="flex flex-col h-screen min-h-0">
					<header className="sticky top-0 z-10 border-b bg-white dark:bg-gray-950 dark:border-gray-800 flex h-16 items-center px-6 shrink-0">
						<SidebarTrigger className="mr-4" />
						<div className="flex-1">
							<AdminHeader />
						</div>
					</header>
					<main className="flex-1 min-h-0 overflow-y-auto p-6">{children}</main>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
