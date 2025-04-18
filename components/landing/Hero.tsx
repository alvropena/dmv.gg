"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SignInDialog } from "@/components/SignInDialog";
import { ArrowRight } from "lucide-react";
export default function Hero() {
	const [isSignInOpen, setIsSignInOpen] = useState(false);

	const handleStartPracticing = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsSignInOpen(true);
	};

	return (
		<section className="w-full py-8 min-h-screen flex items-center md:min-h-[85vh] md:py-12 lg:py-24">
			<div className="container mx-auto px-6">
				<div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
					<div className="flex flex-col justify-center space-y-4 md:space-y-8">
						<div className="space-y-2 md:space-y-6">
							<h1 className="text-4xl font-extrabold tracking-tighter text-[#B6DBFF] sm:text-5xl md:text-5xl lg:text-7xl xl:text-8xl">
								Ace your DMV Knowledge Test
							</h1>
							<p className="max-w-[600px] text-[#B6DBFF] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Practice with real questions from the California DMV, track your
								progress, and pass your test with confidence.
							</p>
						</div>
						<div className="flex gap-2">
							<Button
								className="rounded-full text-lg px-6 py-4 h-auto bg-[#FFF25F] text-black hover:bg-[#FFF25F]/90 hover:text-black"
								onClick={handleStartPracticing}
							>
								Get the app 
								<ArrowRight className="w-4 h-4" />
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
