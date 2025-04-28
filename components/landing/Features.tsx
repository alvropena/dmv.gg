import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { features } from "@/data/features";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";

export default function Features() {
	const [isSignInOpen, setIsSignInOpen] = useState(false);
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!api || isPaused) return;

		intervalRef.current = setInterval(() => {
			api.scrollNext();
		}, 5000);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [api, isPaused]);

	useEffect(() => {
		if (!api) return;

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap());
		});
	}, [api]);

	const handleStartPracticing = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsSignInOpen(true);
	};

	const FeatureCard = ({ feature }: { feature: typeof features[0] }) => (
		<div className="bg-white/50 rounded-3xl p-6 flex flex-col items-center text-center h-full">
			<div className="w-full h-[300px] rounded-2xl bg-[#3F3500]/10 backdrop-blur-sm p-6 flex items-center justify-center mb-6">
				<div className="text-center text-[#3F3500]">
					<p className="text-lg font-medium">Preview content can go here</p>
				</div>
			</div>
			<h3 className="text-2xl font-bold text-[#3F3500] mb-3">
				{feature.title}
			</h3>
			<p className="text-[#3F3500]/80">
				{feature.description}
			</p>
		</div>
	);

	return (
		<section id="features" className="w-full py-12 md:py-12 lg:py-52 bg-[#FFF25F]">
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

				{/* Mobile Carousel */}
				<div 
					className="mt-4 block md:hidden"
					onMouseEnter={() => setIsPaused(true)}
					onMouseLeave={() => setIsPaused(false)}
				>
					<Carousel 
						className="w-full" 
						setApi={setApi}
						opts={{
							align: "start",
							loop: true,
						}}
					>
						<CarouselContent>
							{features.map((feature) => (
								<CarouselItem key={feature.id}>
									<FeatureCard feature={feature} />
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
					<div className="flex justify-center gap-2 mt-8">
						{features.map((_, index) => (
							<button
								key={index}
								className={`w-2 h-2 rounded-full transition-colors ${
									index === current
										? "bg-[#3F3500]"
										: "bg-[#3F3500]/20"
								}`}
								onClick={() => api?.scrollTo(index)}
								aria-label={`Go to feature ${index + 1}`}
							/>
						))}
					</div>
				</div>

				{/* Desktop Grid */}
				<div className="mt-24 hidden md:grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
					{features.map((feature) => (
						<FeatureCard key={feature.id} feature={feature} />
					))}
				</div>
			</div>
		</section>
	);
}