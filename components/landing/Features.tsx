import {
	BookOpen,
	BarChart2,
	Award,
	Clock,
	CheckCircle,
	ArrowRight,
} from "lucide-react";
import FeatureCard from "@/components/landing/FeatureCard";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { SignInDialog } from "@/components/SignInDialog";

export default function Features() {
	const [api, setApi] = useState<CarouselApi | null>(null);
	const [current, setCurrent] = useState(0);
	const [isSignInOpen, setIsSignInOpen] = useState(false);
	const [autoplay, setAutoplay] = useState(true);
	const AUTOPLAY_INTERVAL = 5000; // 5 seconds

	const handleStartPracticing = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsSignInOpen(true);
	};

	const features = [
		{
			id: "practice",
			icon: <BookOpen className="h-24 w-24 text-blue-600" />,
			title: "Use one-off card details online",
			description:
				"Practice with actual questions from your state's DMV test to ensure you're fully prepared.",
		},
		{
			id: "progress",
			icon: <BarChart2 className="h-24 w-24 text-blue-600" />,
			title: "Progress Tracking",
			description:
				"Monitor your improvement over time and focus on areas where you need more practice.",
		},
		{
			id: "guarantee",
			icon: <Award className="h-24 w-24 text-blue-600" />,
			title: "Pass Guarantee",
			description:
				"Our users are 3x more likely to pass their test on the first attempt.",
		},
		{
			id: "efficient",
			icon: <Clock className="h-24 w-24 text-blue-600" />,
			title: "Study Efficiently",
			description:
				"Our algorithm focuses on your weak areas to maximize your study time.",
		},
		{
			id: "feedback",
			icon: <CheckCircle className="h-24 w-24 text-blue-600" />,
			title: "Instant Feedback",
			description:
				"Get immediate explanations for every question to understand the correct answers.",
		},
		{
			id: "mobile",
			icon: <ArrowRight className="h-24 w-24 text-blue-600" />,
			title: "Mobile Friendly",
			description:
				"Study anywhere, anytime on your phone, tablet, or computer.",
		},
	];

	useEffect(() => {
		if (!api) return;

		const onSelect = () => {
			setCurrent(api.selectedScrollSnap());
		};

		api.on("select", onSelect);
		return () => {
			api.off("select", onSelect);
		};
	}, [api]);

	// Add autoplay functionality
	const scrollToNextItem = useCallback(() => {
		if (!api) return;
		
		const nextIndex = (current + 1) % features.length;
		api.scrollTo(nextIndex);
	}, [api, current, features.length]);

	useEffect(() => {
		let intervalId: NodeJS.Timeout;
		
		if (autoplay && api) {
			intervalId = setInterval(scrollToNextItem, AUTOPLAY_INTERVAL);
		}
		
		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	}, [autoplay, api, scrollToNextItem]);

	// Pause autoplay on hover/interaction
	const handleMouseEnter = () => setAutoplay(false);
	const handleMouseLeave = () => setAutoplay(true);

	return (
		<section id="features" className="w-full py-8 min-h-screen flex items-center md:min-h-[85vh] md:py-12 lg:py-52 bg-[#FFF25F]">
			<div className="container mx-auto px-6">
				<div className="grid gap-6 lg:gap-12">
					<div className="flex flex-col justify-center items-center text-center space-y-4 md:space-y-8">
						<div className="space-y-2 md:space-y-6 max-w-5xl mx-auto">
							<h2 className="text-4xl font-extrabold tracking-tighter text-[#3F3500] sm:text-5xl md:text-5xl lg:text-7xl xl:text-8xl">
								Everything You Need to Pass Your Test
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

				<div className="w-full px-0 mx-auto relative mt-10">
					<Carousel
						setApi={setApi}
						opts={{
							align: "start",
							loop: true,
							containScroll: false,
						}}
						className="w-full"
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
					>
						<CarouselContent className="-ml-4">
							{features.map((feature) => (
								<CarouselItem
									key={feature.id}
									className="pl-4 w-[75%] basis-auto"
								>
									<FeatureCard
										icon={feature.icon}
										title={feature.title}
										description={feature.description}
									/>
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>

					<div className="flex justify-center gap-2 mt-8">
						{features.map((feature) => (
							<button
								type="button"
								key={feature.id}
								className={`w-2 h-2 rounded-full transition-all ${
									current === features.indexOf(feature)
										? "bg-blue-600 w-4"
										: "bg-gray-300"
								}`}
								onClick={() => api?.scrollTo(features.indexOf(feature))}
								aria-label={`Go to slide ${features.indexOf(feature) + 1}`}
							/>
						))}
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
