"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SignInDialog } from "@/components/SignInDialog";

export default function CTA() {
	const [isSignInOpen, setIsSignInOpen] = useState(false);

	const handleGetStarted = () => {
		setIsSignInOpen(true);
	};

	return (
		<section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600 text-white">
			<div className="container mx-auto px-4">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<div className="space-y-2">
						<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
							Ready to Ace Your California DMV Test?
						</h2>
						<p className="max-w-[900px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							Join thousands of California drivers who have successfully passed
							their test using DMV.gg
						</p>
					</div>
					<div className="flex flex-col gap-2 min-[400px]:flex-row">
						<Button size="lg" variant="secondary" onClick={handleGetStarted}>
							Get Started for Free
						</Button>
					</div>
					<p className="text-sm text-blue-100">
						No credit card required to start
					</p>
				</div>
			</div>
			<SignInDialog
				isOpen={isSignInOpen}
				onClose={() => setIsSignInOpen(false)}
			/>
		</section>
	);
}
