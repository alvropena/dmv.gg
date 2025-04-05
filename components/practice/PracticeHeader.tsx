import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PracticeHeaderProps {
	onBackToHome: () => void;
}

export function PracticeHeader({ onBackToHome }: PracticeHeaderProps) {
	return (
		<div className="flex items-center gap-2 mb-6">
			<Button
				variant="outline"
				size="sm"
				onClick={onBackToHome}
				className="flex items-center gap-1"
			>
				<ArrowLeft className="h-4 w-4" /> Back to Home
			</Button>
		</div>
	);
}
