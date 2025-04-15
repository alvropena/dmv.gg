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
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignInDialog } from "@/components/SignInDialog";

export default function Features() {
	const [api, setApi] = useState<CarouselApi | null>(null);
	const [current, setCurrent] = useState(0);
	const [isSignInOpen, setIsSignInOpen] = useState(false);

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

	return (
		<section id="features" className="w-full py-16 md:py-20 lg:py-24">
			<div className="container mx-auto px-4">
				<div className="flex flex-col items-start justify-center space-y-4 text-left mb-10">
					<div className="space-y-2">
						<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
							Everything You Need to Pass Your Test
						</h2>
						<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							Our platform is designed to help you learn efficiently and pass
							your DMV knowledge test on the first try.
						</p>
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

				<div className="w-full px-0 mx-auto relative">
					<Carousel
						setApi={setApi}
						opts={{
							align: "start",
							loop: true,
							containScroll: false,
						}}
						className="w-full"
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
