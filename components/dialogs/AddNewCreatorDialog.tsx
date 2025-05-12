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
import { Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddNewCreatorDialog() {
	const [form, setForm] = useState({
		name: "",
		email: "",
	});

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
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
					<Plus className="h-3.5 w-3.5" />
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
				<form onSubmit={handleSubmit} className="mt-4">
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
