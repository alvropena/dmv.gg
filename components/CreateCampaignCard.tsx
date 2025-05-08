import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateCampaignCard() {
	const router = useRouter();
	return (
		<Card className="border-dashed flex flex-col items-center justify-center p-6 h-full">
			<div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
				<PlusCircle className="h-6 w-6 text-muted-foreground" />
			</div>
			<h3 className="text-lg font-medium">Create New Campaign</h3>
			<p className="text-sm text-muted-foreground text-center mt-2">
				Set up a new email campaign to engage with your users
			</p>
			<Button
				variant="outline"
				className="mt-4"
				onClick={() => router.push("/email")}
			>
				Get Started
			</Button>
		</Card>
	);
}
