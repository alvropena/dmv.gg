import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CompletionCardProps {
	onReturnHome: () => void;
}

export function CompletionCard({ onReturnHome }: CompletionCardProps) {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<Card className="max-w-lg w-full text-center p-8">
				<CardHeader>
					<CardTitle className="text-2xl">Congratulations! 🎉</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="mb-6">You&apos;ve completed all available questions!</p>
					<Button onClick={onReturnHome} className="w-full">
						Return to Home
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
