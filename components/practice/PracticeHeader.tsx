import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PracticeHeaderProps {
	onBackToHome: () => void;
}

export function PracticeHeader({ onBackToHome }: PracticeHeaderProps) {
	return (
		<div className="flex items-center gap-2 mb-6 mx-3 sm:mx-0">
			<Link 
				href="/" 
				onClick={(e) => {
					e.preventDefault();
					onBackToHome();
				}}
				className="flex items-center gap-1 hover:underline"
			>
				<ArrowLeft className="h-4 w-4" /> Back to Home
			</Link>
		</div>
	);
}
