import { Button } from "@/components/ui/button";
import { SignInDialog } from "@/components/SignInDialog";
import { useState } from "react";
import { features } from "@/data/features";
import Image from "next/image";

export default function Features() {
	const [isSignInOpen, setIsSignInOpen] = useState(false);

	const handleStartPracticing = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsSignInOpen(true);
	};

	return (
		<section id="features" className="w-full py-28 md:py-12 lg:py-52 bg-[#FFF25F]">
			<div className="container mx-auto px-6">
				<div className="grid gap-6 lg:gap-12">
					<div className="flex flex-col justify-center items-center text-center space-y-4 md:space-y-8">
						<div className="space-y-2 md:space-y-6 max-w-5xl mx-auto">
							<h2 className="text-5xl font-extrabold tracking-tighter text-[#3F3500] sm:text-5xl md:text-5xl lg:text-7xl xl:text-8xl">
								Pass Your Test With Confidence
							</h2>
							<p className="text-[#3F3500] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Our platform is designed to help you learn efficiently and pass
								your DMV knowledge test on the first try.
							</p>
							<div className="flex gap-2 justify-center">
								<Button
									className="rounded-full text-lg px-6 py-4 h-auto bg-[#3F3500] text-white hover:bg-[#3F3500]/90 hover:text-white"
									onClick={handleStartPracticing}
								>
									Get started for free
								</Button>
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-24 mt-24">
					{features.map((feature) => (
						<div
							key={feature.id}
							className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
						>
							{feature.imagePosition === "left" ? (
								<>
									<div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
										<Image
											src={feature.image}
											alt={feature.title}
											fill
											className="object-cover"
										/>
									</div>
									<div className="space-y-4">
										<h3 className="text-3xl md:text-4xl font-bold text-[#3F3500]">
											{feature.title}
										</h3>
										<p className="text-lg md:text-xl text-[#3F3500]/80">
											{feature.description}
										</p>
									</div>
								</>
							) : (
								<>
									<div className="space-y-4 md:order-1">
										<h3 className="text-3xl md:text-4xl font-bold text-[#3F3500]">
											{feature.title}
										</h3>
										<p className="text-lg md:text-xl text-[#3F3500]/80">
											{feature.description}
										</p>
									</div>
									<div className="relative aspect-[4/3] rounded-3xl overflow-hidden md:order-2">
										<Image
											src={feature.image}
											alt={feature.title}
											fill
											className="object-cover"
										/>
									</div>
								</>
							)}
						</div>
					))}
				</div>
			</div>

			<SignInDialog
				isOpen={isSignInOpen}
				onClose={() => setIsSignInOpen(false)}
			/>
		</section>
	);
}
