import { Badge } from "@/components/ui/badge";

export default function HowItWorks() {
	return (
		<section id="how-it-works" className="w-full py-16 md:py-20 lg:py-24">
			<div className="container mx-auto px-4">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<div className="space-y-2">
						<Badge
							variant="outline"
							className="w-fit mx-auto border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-100"
						>
							How It Works
						</Badge>
						<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
							Three Simple Steps to Success
						</h2>
						<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							Our streamlined process makes it easy to prepare for your DMV
							knowledge test.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
