"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
	{
		name: "Sarah J.",
		state: "California",
		avatar: "SJ",
		content:
			"I was so nervous about my DMV test, but after practicing with DMV.gg for just a week, I passed with a perfect score! The questions were almost identical to the real test.",
		rating: 5,
	},
	{
		name: "Michael T.",
		state: "California",
		avatar: "MT",
		content:
			"This site saved me so much time. Instead of reading the entire California handbook, I could focus on practicing real questions. Passed on my first try!",
		rating: 5,
	},
	{
		name: "Jessica L.",
		state: "California",
		avatar: "JL",
		content:
			"The progress tracking feature helped me identify my weak areas. I focused on those topics and felt super confident on test day. Highly recommend!",
		rating: 5,
	},
	{
		name: "David R.",
		state: "California",
		avatar: "DR",
		content:
			"After failing my first attempt, I found DMV.gg and studied for just 3 days. Passed with flying colors on my second try. Wish I had found this sooner!",
		rating: 5,
	},
	{
		name: "Emily W.",
		state: "California",
		avatar: "EW",
		content:
			"The mobile app made it so easy to study during my commute. The interface is clean and user-friendly. Worth every penny!",
		rating: 4,
	},
	{
		name: "Robert K.",
		state: "California",
		avatar: "RK",
		content:
			"As someone who gets test anxiety, the realistic practice tests helped me feel prepared and confident. No surprises on test day at the California DMV!",
		rating: 5,
	},
];

export default function Testimonials() {
	const [currentIndex, setCurrentIndex] = useState(0);

	const nextTestimonial = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex + 3 >= testimonials.length ? 0 : prevIndex + 3,
		);
	};

	const prevTestimonial = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex - 3 < 0 ? Math.max(testimonials.length - 3, 0) : prevIndex - 3,
		);
	};

	const visibleTestimonials = testimonials.slice(
		currentIndex,
		currentIndex + 3,
	);

	return (
		<section id="testimonials" className="w-full py-8 min-h-screen flex items-center md:min-h-[85vh] md:py-12 lg:py-24">
			<div className="container mx-auto px-6">
				<div className="grid gap-6 lg:gap-12">
					<div className="flex flex-col justify-center items-center text-center space-y-4 md:space-y-8">
						<div className="space-y-2 md:space-y-6 max-w-5xl mx-auto">
							<h2 className="text-4xl font-extrabold tracking-tighter text-[#93BBFF] sm:text-5xl md:text-5xl lg:text-7xl xl:text-8xl">
								Hear From Our Users
							</h2>
							<p className="text-[#93BBFF] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
								Thousands of drivers have used DMV.gg to pass their knowledge test
								on the first try.
							</p>
						</div>
					</div>
				</div>

				<div className="mx-auto max-w-5xl mt-12 md:mt-16">
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{visibleTestimonials.map((testimonial) => (
							<Card
								key={`${testimonial.name}-${testimonial.avatar}`}
								className="overflow-hidden"
							>
								<CardContent className="p-6">
									<div className="flex flex-col space-y-4">
										<div className="flex items-center space-x-2">
											<Avatar className="h-10 w-10 border bg-gray-100">
												<AvatarFallback>{testimonial.avatar}</AvatarFallback>
											</Avatar>
											<div>
												<div className="font-medium">{testimonial.name}</div>
												<div className="text-xs">{testimonial.state}</div>
											</div>
										</div>
										<div className="flex">
											{[...Array(5)].map((_, i) => (
												<Star
													key={`${testimonial.name}-${testimonial.avatar}-star-${i}`}
													className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
												/>
											))}
										</div>
										<p className="text-sm">{testimonial.content}</p>
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					<div className="flex justify-center mt-8 gap-2">
						<Button
							variant="outline"
							size="icon"
							onClick={prevTestimonial}
							className="rounded-full"
						>
							<ChevronLeft className="h-4 w-4" />
							<span className="sr-only">Previous</span>
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={nextTestimonial}
							className="rounded-full"
						>
							<ChevronRight className="h-4 w-4" />
							<span className="sr-only">Next</span>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
