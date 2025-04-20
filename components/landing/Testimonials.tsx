"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
	{
		name: "Sarah Johnson",
		role: "Student Driver",
		image: "/testimonials/sarah.jpg",
		quote: "DMV.gg simplifies the process for new drivers to learn and practice their knowledge test in one inclusive platform.",
		description: "Passed on first attempt with 98% score"
	},
	{
		name: "Michael Thompson",
		role: "Recent Graduate",
		image: "/testimonials/michael.jpg",
		quote: "The practice tests and study materials helped me feel confident and prepared for my actual DMV test.",
		description: "Studied for just 2 weeks"
	},
	{
		name: "Jessica Lee",
		role: "International Student",
		image: "/testimonials/jessica.jpg",
		quote: "As an international student, DMV.gg made it easy to understand California's driving rules and regulations.",
		description: "Successfully got her license in 3 weeks"
	}
];

export default function Testimonials() {
	const [currentIndex, setCurrentIndex] = useState(0);

	const nextTestimonial = () => {
		setCurrentIndex((prevIndex) => 
			prevIndex + 1 >= testimonials.length ? 0 : prevIndex + 1
		);
	};

	const prevTestimonial = () => {
		setCurrentIndex((prevIndex) => 
			prevIndex - 1 < 0 ? testimonials.length - 1 : prevIndex - 1
		);
	};

	const currentTestimonial = testimonials[currentIndex];

	return (
		<section id="testimonials" className="w-full py-16 md:py-20 lg:py-24 bg-white">
			<div className="container mx-auto px-6">
				<div className="flex flex-col items-center max-w-4xl mx-auto">
					<div className="w-[280px] aspect-square relative rounded-full overflow-hidden mb-8 bg-black/20 backdrop-blur-sm flex items-center justify-center">
						<div className="text-center">
							<p className="text-4xl font-medium">{currentTestimonial.name.split(' ').map(n => n[0]).join('')}</p>
						</div>
						{/* <Image
							src={currentTestimonial.image}
							alt={currentTestimonial.name}
							fill
							className="object-cover"
							priority
						/> */}
					</div>

					<div className="text-center space-y-6 max-w-[75%] mx-auto">
						<p className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed">
							&ldquo;{currentTestimonial.quote}&rdquo;
						</p>

						<div className="space-y-2">
							<h3 className="text-xl md:text-2xl font-bold">
								{currentTestimonial.name}
							</h3>
							<p className="text-gray-600">
								{currentTestimonial.role}
							</p>
							<p className="text-sm text-gray-500">
								{currentTestimonial.description}
							</p>
						</div>

						<div className="flex justify-center gap-4 pt-4">
							<Button
								variant="outline"
								size="icon"
								onClick={prevTestimonial}
								className="rounded-full h-12 w-12 border-2"
							>
								<ChevronLeft className="h-6 w-6" />
								<span className="sr-only">Previous testimonial</span>
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={nextTestimonial}
								className="rounded-full h-12 w-12 border-2"
							>
								<ChevronRight className="h-6 w-6" />
								<span className="sr-only">Next testimonial</span>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
