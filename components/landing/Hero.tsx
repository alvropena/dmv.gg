"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import TestDemo from "@/components/landing/TestDemo";
import { useState } from "react";
import { SignInDialog } from "@/components/SignInDialog";

export default function Hero() {
	const [isSignInOpen, setIsSignInOpen] = useState(false);

	const handleStartPracticing = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsSignInOpen(true);
	};

	return (
		<section className="w-full py-16 md:py-20 lg:py-24">
			<div className="container mx-auto px-4">
				<div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
					<div className="flex flex-col justify-center space-y-4">
						<div className="space-y-2">
							<Badge
								variant="outline"
								className="w-fit border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100"
							>
								Pass Your Test on the First Try
							</Badge>
							<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
								Ace Your California DMV Knowledge Test
							</h1>
							<p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Practice with real questions from the California DMV, track your
								progress, and pass your test with confidence.
							</p>
						</div>
						<div className="flex flex-col gap-2 min-[400px]:flex-row">
							<Button size="lg" onClick={handleStartPracticing}>
								Start Practicing Now
							</Button>
							<Button size="lg" variant="outline" asChild>
								<Link href="#how-it-works">Learn More</Link>
							</Button>
						</div>
						<div className="flex items-center gap-4 text-sm">
							<div className="flex items-center gap-1">
								<CheckCircle className="h-4 w-4 text-green-500" />
								<span>Real DMV Questions</span>
							</div>
							<div className="flex items-center gap-1">
								<CheckCircle className="h-4 w-4 text-green-500" />
								<span>California DMV Focused</span>
							</div>
							<div className="flex items-center gap-1">
								<CheckCircle className="h-4 w-4 text-green-500" />
								<span>Free to Start</span>
							</div>
						</div>
					</div>
					<div className="flex items-center justify-center">
						<div className="w-full max-w-[600px] overflow-hidden rounded-xl border shadow-lg">
							<TestDemo />
						</div>
					</div>
				</div>
			</div>

			<SignInDialog
				isOpen={isSignInOpen}
				onClose={() => setIsSignInOpen(false)}
			/>
		</section>
	);
}
