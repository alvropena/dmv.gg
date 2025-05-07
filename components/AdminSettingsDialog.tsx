"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import React from "react";

interface AdminSettingsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AdminSettingsDialog({ open, onOpenChange }: AdminSettingsDialogProps) {
	const { theme, setTheme } = useTheme();
	const [language, setLanguage] = React.useState("en");

	const handleSave = () => {
		// TODO: Implement save functionality
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>
						Update your admin settings below.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-6 mt-4">
					<div className="flex flex-col gap-2">
						<Label>Theme</Label>
						<div className="flex gap-2">
							<Button
								variant={theme === "light" ? "default" : "outline"}
								size="sm"
								onClick={() => setTheme("light")}
								className="flex-1"
							>
								<Sun className="mr-2 h-4 w-4" />
								Light
							</Button>
							<Button
								variant={theme === "dark" ? "default" : "outline"}
								size="sm"
								onClick={() => setTheme("dark")}
								className="flex-1"
							>
								<Moon className="mr-2 h-4 w-4" />
								Dark
							</Button>
							<Button
								variant={theme === "system" ? "default" : "outline"}
								size="sm"
								onClick={() => setTheme("system")}
								className="flex-1"
							>
								<Monitor className="mr-2 h-4 w-4" />
								System
							</Button>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Language</Label>
						<Select value={language} onValueChange={setLanguage}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select a language" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="en">English</SelectItem>
								<SelectItem value="es">Español</SelectItem>
								<SelectItem value="fr">Français</SelectItem>
								<SelectItem value="de">Deutsch</SelectItem>
								<SelectItem value="zh">中文</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={handleSave}>Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
} 