"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SignInDialog } from "@/components/SignInDialog";

export default function Hero() {
	const [isSignInOpen, setIsSignInOpen] = useState(false);

	const handleStartPracticing = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsSignInOpen(true);
	};

	return (
		<section className="w-full py-8">
			<div className="container mx-auto px-4">
				<div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
					<div className="flex flex-col justify-center space-y-4">
						<div className="space-y-2">
							<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-5xl lg:text-6xl">
								Ace Your DMV Knowledge Test
							</h1>
							<p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Practice with real questions from the California DMV, track your
								progress, and pass your test with confidence.
							</p>
						</div>
						<div className="flex gap-2">
							<Button
								size="lg"
								className="rounded-full px-6 inline-flex"
								onClick={handleStartPracticing}
							>
								Get started
							</Button>
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
