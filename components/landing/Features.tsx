import { Badge } from "@/components/ui/badge";
import {
	BookOpen,
	BarChart2,
	Award,
	Clock,
	CheckCircle,
	ArrowRight,
} from "lucide-react";
import FeatureCard from "@/components/landing/FeatureCard";

export default function Features() {
	return (
		<section id="features" className="w-full py-16 md:py-20 lg:py-24">
			<div className="container mx-auto px-4">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<div className="space-y-2">
						<Badge
							variant="outline"
							className="w-fit mx-auto border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100"
						>
							Features
						</Badge>
						<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
							Everything You Need to Pass Your Test
						</h2>
						<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							Our platform is designed to help you learn efficiently and pass
							your DMV knowledge test on the first try.
						</p>
					</div>
				</div>
				<div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
					<FeatureCard
						icon={<BookOpen className="h-10 w-10 text-blue-600" />}
						title="Real DMV Questions"
						description="Practice with actual questions from your state's DMV test to ensure you're fully prepared."
					/>
					<FeatureCard
						icon={<BarChart2 className="h-10 w-10 text-blue-600" />}
						title="Progress Tracking"
						description="Monitor your improvement over time and focus on areas where you need more practice."
					/>
					<FeatureCard
						icon={<Award className="h-10 w-10 text-blue-600" />}
						title="Pass Guarantee"
						description="Our users are 3x more likely to pass their test on the first attempt."
					/>
					<FeatureCard
						icon={<Clock className="h-10 w-10 text-blue-600" />}
						title="Study Efficiently"
						description="Our algorithm focuses on your weak areas to maximize your study time."
					/>
					<FeatureCard
						icon={<CheckCircle className="h-10 w-10 text-blue-600" />}
						title="Instant Feedback"
						description="Get immediate explanations for every question to understand the correct answers."
					/>
					<FeatureCard
						icon={<ArrowRight className="h-10 w-10 text-blue-600" />}
						title="Mobile Friendly"
						description="Study anywhere, anytime on your phone, tablet, or computer."
					/>
				</div>
			</div>
		</section>
	);
}
