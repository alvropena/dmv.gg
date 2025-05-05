import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, X, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const PLATFORM_OPTIONS = [
	"Instagram",
	"TikTok",
	"YouTube",
	"Twitter",
	"Facebook",
	"LinkedIn",
];

export default function AddNewCreatorDialog() {
	const [form, setForm] = useState({
		avatar: "",
		name: "",
		email: "",
		birthday: undefined as Date | undefined,
		category: "UGC",
		platforms: [] as string[],
		platformHandles: {} as Record<string, string[]>,
	});
	const [avatarPreview, setAvatarPreview] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);

	function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (ev) => {
				setAvatarPreview(ev.target?.result as string);
				setForm((prev) => ({ ...prev, avatar: ev.target?.result as string }));
			};
			reader.readAsDataURL(file);
		}
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	}

	function handleCategoryChange(value: string) {
		setForm((prev) => ({ ...prev, category: value }));
	}

	function handlePlatformToggle(platform: string) {
		setForm((prev) => {
			const newPlatforms = prev.platforms.includes(platform)
				? prev.platforms.filter((p) => p !== platform)
				: [...prev.platforms, platform];
			const newHandles = { ...prev.platformHandles };
			if (!newPlatforms.includes(platform)) {
				delete newHandles[platform];
			} else if (!newHandles[platform]) {
				newHandles[platform] = [""];
			}
			return { ...prev, platforms: newPlatforms, platformHandles: newHandles };
		});
	}

	function handlePlatformHandleChange(
		platform: string,
		idx: number,
		value: string,
	) {
		setForm((prev) => {
			const handles = prev.platformHandles[platform]
				? [...prev.platformHandles[platform]]
				: [""];
			handles[idx] = value;
			return {
				...prev,
				platformHandles: { ...prev.platformHandles, [platform]: handles },
			};
		});
	}

	function addPlatformHandle(platform: string) {
		setForm((prev) => ({
			...prev,
			platformHandles: {
				...prev.platformHandles,
				[platform]: [...(prev.platformHandles[platform] || []), ""],
			},
		}));
	}

	function removePlatformHandle(platform: string, idx: number) {
		setForm((prev) => {
			const handles = prev.platformHandles[platform]
				? [...prev.platformHandles[platform]]
				: [];
			handles.splice(idx, 1);
			return {
				...prev,
				platformHandles: { ...prev.platformHandles, [platform]: handles },
			};
		});
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log("Submitted Creator:", form);
		// TODO: send to API
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="sm" className="h-9">
					<Plus className="mr-1 h-3.5 w-3.5" />
					<span>Add New</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Creator</DialogTitle>
					<DialogDescription>
						Fill out the form below to add a new creator to your dashboard.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4 mt-4">
					<Label htmlFor="creator-avatar">Profile Picture</Label>
					<div className="flex items-center gap-4">
						<Avatar>
							<AvatarImage
								src={avatarPreview || undefined}
								alt={form.name || "Avatar"}
							/>
							<AvatarFallback>{form.name ? form.name[0] : "?"}</AvatarFallback>
						</Avatar>
						<Input
							id="creator-avatar"
							type="file"
							accept="image/*"
							onChange={handleAvatarChange}
							ref={fileInputRef}
						/>
					</div>
					<Label htmlFor="creator-name">Name</Label>
					<Input
						id="creator-name"
						name="name"
						value={form.name}
						onChange={handleChange}
						placeholder="Name"
						required
					/>
					<Label htmlFor="creator-email">Email</Label>
					<Input
						id="creator-email"
						name="email"
						value={form.email}
						onChange={handleChange}
						placeholder="Email"
						type="email"
						required
					/>
					<Label htmlFor="creator-category">Category</Label>
					<Select value={form.category} onValueChange={handleCategoryChange}>
						<SelectTrigger id="creator-category">
							<SelectValue placeholder="Select category" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="UGC">UGC</SelectItem>
							<SelectItem value="Influencer">Influencer</SelectItem>
						</SelectContent>
					</Select>
					<Label htmlFor="creator-platforms">Platforms</Label>
					<div className="relative">
						<Button
							type="button"
							variant="outline"
							className="w-full flex justify-between"
							onClick={() => setPlatformDropdownOpen((open) => !open)}
						>
							<span>
								{form.platforms.length > 0
									? form.platforms.join(", ")
									: "Select platforms"}
							</span>
							<ChevronDown className="h-4 w-4 opacity-50" />
						</Button>
						{platformDropdownOpen && (
							<div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md p-2">
								{PLATFORM_OPTIONS.map((platform) => (
									<label
										key={platform}
										className="flex items-center gap-2 cursor-pointer select-none py-1 px-2 rounded hover:bg-accent"
									>
										<input
											type="checkbox"
											checked={form.platforms.includes(platform)}
											onChange={() => handlePlatformToggle(platform)}
											className="accent-primary"
										/>
										<span>{platform}</span>
									</label>
								))}
							</div>
						)}
					</div>
					{form.platforms.map((platform) => (
						<div key={platform} className="mb-2">
							{(form.platformHandles[platform] || []).map((handle, idx) => {
								const inputId = `handle-${platform}-${idx}`;
								return (
									<div key={inputId} className="flex gap-2 mb-1">
										<Label
											htmlFor={inputId}
											className="text-sm font-medium mb-1"
										>
											{platform} Handle
											{form.platformHandles[platform].length > 1
												? ` #${idx + 1}`
												: ""}
										</Label>
										<Input
											id={inputId}
											placeholder={`@handle${form.platformHandles[platform].length > 1 ? ` #${idx + 1}` : ""}`}
											value={handle}
											onChange={(e) =>
												handlePlatformHandleChange(
													platform,
													idx,
													e.target.value,
												)
											}
											required
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => removePlatformHandle(platform, idx)}
											disabled={form.platformHandles[platform].length === 1}
										>
											<X className="w-4 h-4" />
										</Button>
									</div>
								);
							})}
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => addPlatformHandle(platform)}
							>
								<Plus className="w-4 h-4 mr-1" /> Add Handle
							</Button>
						</div>
					))}
					<div className="flex gap-2 mt-4">
						<Button type="submit" className="w-full">
							Submit
						</Button>
						<DialogClose asChild>
							<Button variant="outline" className="w-full">
								Cancel
							</Button>
						</DialogClose>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
