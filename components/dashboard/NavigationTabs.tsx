import React from "react";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

interface NavigationTabsProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
}

export function NavigationTabs({
	activeTab,
	onTabChange,
}: NavigationTabsProps) {
	return (
		<div className="mb-6">
			<Menubar className="w-full justify-between border rounded-lg h-auto p-0 flex">
				<MenubarMenu>
					<MenubarTrigger
						className={`flex-1 w-full rounded-none text-center justify-center ${
							activeTab === "overview"
								? "bg-background text-foreground font-medium"
								: "hover:bg-accent hover:text-accent-foreground"
						}`}
						onClick={() => onTabChange("overview")}
					>
						Overview
					</MenubarTrigger>
				</MenubarMenu>
				<MenubarMenu>
					<MenubarTrigger
						className={`flex-1 w-full rounded-none text-center justify-center ${
							activeTab === "users"
								? "bg-background text-foreground font-medium"
								: "hover:bg-accent hover:text-accent-foreground"
						}`}
						onClick={() => onTabChange("users")}
					>
						Users
					</MenubarTrigger>
				</MenubarMenu>
				<MenubarMenu>
					<MenubarTrigger
						className={`flex-1 w-full rounded-none text-center justify-center ${
							activeTab === "content"
								? "bg-background text-foreground font-medium"
								: "hover:bg-accent hover:text-accent-foreground"
						}`}
						onClick={() => onTabChange("content")}
					>
						Content
					</MenubarTrigger>
				</MenubarMenu>
				<MenubarMenu>
					<MenubarTrigger
						className={`flex-1 w-full rounded-none text-center justify-center ${
							activeTab === "reports"
								? "bg-background text-foreground font-medium"
								: "hover:bg-accent hover:text-accent-foreground"
						}`}
						onClick={() => onTabChange("reports")}
					>
						Reports
					</MenubarTrigger>
				</MenubarMenu>
			</Menubar>
		</div>
	);
}
