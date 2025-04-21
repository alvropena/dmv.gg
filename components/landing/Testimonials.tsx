"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/data/testimonials";
import Image from "next/image";

export default function Testimonials() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// Auto-advance testimonials every 5 seconds
	useEffect(() => {
		if (!isPaused) {
			intervalRef.current = setInterval(() => {
				setCurrentIndex((prevIndex) =>
					prevIndex + 1 >= testimonials.length ? 0 : prevIndex + 1,
				);
			}, 5000);
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isPaused]);

	const nextTestimonial = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex + 1 >= testimonials.length ? 0 : prevIndex + 1,
		);
	};

	const prevTestimonial = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex - 1 < 0 ? testimonials.length - 1 : prevIndex - 1,
		);
	};

	const currentTestimonial = testimonials[currentIndex];

	return (
		<section
			id="testimonials"
			className="w-full py-16 md:py-20 lg:py-24 bg-white"
		>
			<div className="container mx-auto px-2 md:px-6">
				<div
					className="relative bg-white rounded-[40px] px-4 md:px-8 py-3 md:py-4"
					onMouseEnter={() => setIsPaused(true)}
					onMouseLeave={() => setIsPaused(false)}
				>
					<div className="hidden lg:flex absolute left-12 top-1/2 -translate-y-1/2">
						<Button
							variant="outline"
							size="icon"
							onClick={prevTestimonial}
							className="rounded-full h-12 w-12 border-2"
						>
							<ChevronLeft className="h-6 w-6" />
							<span className="sr-only">Previous testimonial</span>
						</Button>
					</div>
					<div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2">
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

					<div className="flex flex-col items-center max-w-4xl mx-auto">
						<div className="w-[280px] aspect-square relative rounded-full overflow-hidden mb-8">
							<Image
								src={currentTestimonial.image}
								alt={currentTestimonial.name}
								fill
								className="object-cover"
								priority
							/>
						</div>

						<div className="text-center space-y-6 max-w-[75%] mx-auto">
							<p className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed">
								&ldquo;{currentTestimonial.quote}&rdquo;
							</p>

							<div className="space-y-2">
								<h3 className="text-xl md:text-2xl font-bold">
									{currentTestimonial.name}
								</h3>
								<p className="text-gray-600">{currentTestimonial.role}</p>
								<p className="text-sm text-gray-500">
									{currentTestimonial.description}
								</p>
							</div>

							<div className="flex lg:hidden justify-center gap-4 pt-4">
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
			</div>
		</section>
	);
}
