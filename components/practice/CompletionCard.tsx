import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface CompletionCardProps {
	onReturnHome: () => void;
	score: number;
	totalQuestions: number;
	isPass: boolean;
	onUnlockAllTests?: () => void;
}

export function CompletionCard({ onReturnHome, score, totalQuestions, isPass, onUnlockAllTests }: CompletionCardProps) {
	const { width, height } = useWindowSize();
	const [isConfettiActive, setIsConfettiActive] = useState(true);
	const [countdown, setCountdown] = useState(600); // 10 minutes in seconds

	// Stop confetti after 5 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsConfettiActive(false);
		}, 5000);
		return () => clearTimeout(timer);
	}, []);

	// Countdown timer for offer
	useEffect(() => {
		if (!isPass && countdown > 0) {
			const interval = setInterval(() => {
				setCountdown((c) => c - 1);
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [isPass, countdown]);

	const formatCountdown = (seconds: number) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, "0");
		const s = (seconds % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			{isPass && isConfettiActive && (
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
					<CardTitle className="text-2xl">
						{isPass ? "Congratulations! 🎉" : "Test Complete"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{isPass ? (
						<>
							{score === totalQuestions ? (
								<>
									<p className="mb-4 text-lg font-semibold">You scored {score}/{totalQuestions} — a perfect score!</p>
									<p className="mb-4">Incredible! You aced the test. Want to stay sharp and keep your edge? Unlock all tests for unlimited practice and new questions.</p>
									<div className="mb-4 text-base font-bold text-blue-700 flex flex-col items-center">
										<span>$3.99 Weekly - Only today</span>
										<span className="text-xs text-gray-500 mt-1">Offer expires in <span className="font-mono">{formatCountdown(countdown)}</span></span>
									</div>
									<Button onClick={onUnlockAllTests} className="w-full bg-blue-700 hover:bg-blue-800 text-white text-base font-semibold mb-2">
										Keep Practicing — Unlock All Tests
									</Button>
									<Button onClick={onReturnHome} variant="outline" className="w-full mt-2">
										Return to Home
									</Button>
								</>
							) : (totalQuestions - score >= 1 && totalQuestions - score <= 5) ? (
								<>
									<p className="mb-4 text-lg font-semibold">You scored {score}/{totalQuestions} — so close to perfect!</p>
									<p className="mb-4">Amazing work! You only missed a few. Want to review your weak spots and make sure you&apos;re 100% ready? Unlock all tests and access Weak Areas mode.</p>
									<div className="mb-4 text-base font-bold text-blue-700 flex flex-col items-center">
										<span>$3.99 Weekly - Only today</span>
										<span className="text-xs text-gray-500 mt-1">Offer expires in <span className="font-mono">{formatCountdown(countdown)}</span></span>
									</div>
									<Button onClick={onUnlockAllTests} className="w-full bg-blue-700 hover:bg-blue-800 text-white text-base font-semibold mb-2">
										Review Weak Areas — Unlock All Tests
									</Button>
									<Button onClick={onReturnHome} variant="outline" className="w-full mt-2">
										Return to Home
									</Button>
								</>
							) : (
								<>
									<p className="mb-4 text-lg font-semibold">You scored {score}/{totalQuestions} — you passed!</p>
									<p className="mb-4">Great job! Want to review your weak areas and boost your confidence even more? Unlock all tests and access Weak Areas mode.</p>
									<div className="mb-4 text-base font-bold text-blue-700 flex flex-col items-center">
										<span>$3.99 Weekly - Only today</span>
										<span className="text-xs text-gray-500 mt-1">Offer expires in <span className="font-mono">{formatCountdown(countdown)}</span></span>
									</div>
									<Button onClick={onUnlockAllTests} className="w-full bg-blue-700 hover:bg-blue-800 text-white text-base font-semibold mb-2">
										Review Weak Areas — Unlock All Tests
									</Button>
									<Button onClick={onReturnHome} variant="outline" className="w-full mt-2">
										Return to Home
									</Button>
								</>
							)}
						</>
					) : (
						<>
							<p className="mb-4 text-lg font-semibold">🚦You scored {score}/{totalQuestions} — not quite a pass.</p>
							<p className="mb-4">80% of users improve 2x after using <span className="font-semibold">Weak Areas</span> mode. Unlock all tests now.</p>
							<div className="mb-4 text-base font-bold text-blue-700 flex flex-col items-center">
								<span>$3.99 Weekly - Only today</span>
								<span className="text-xs text-gray-500 mt-1">Offer expires in <span className="font-mono">{formatCountdown(countdown)}</span></span>
							</div>
							<Button onClick={onUnlockAllTests} className="w-full bg-blue-700 hover:bg-blue-800 text-white text-base font-semibold mb-2">
								Unlock All Tests
							</Button>
							<Button onClick={onReturnHome} variant="outline" className="w-full mt-2">
								Return to Home
							</Button>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
