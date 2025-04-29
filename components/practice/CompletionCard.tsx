import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface CompletionCardProps {
	onReturnHome: () => void;
}

export function CompletionCard({ onReturnHome }: CompletionCardProps) {
	const { width, height } = useWindowSize();
	const [isConfettiActive, setIsConfettiActive] = useState(true);

	// Stop confetti after 5 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsConfettiActive(false);
		}, 5000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			{isConfettiActive && (
				<Confetti
					width={width}
					height={height}
					recycle={true}
					numberOfPieces={200}
					gravity={0.3}
				/>
			)}
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
