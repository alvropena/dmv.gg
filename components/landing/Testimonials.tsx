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
			className="w-full py-12 md:py-12 lg:py-52 bg-[#F1F1EF]"
		>
			<div className="container mx-auto px-2 md:px-6">
				<div className="flex flex-col justify-center items-center text-center space-y-4 md:space-y-8 mb-8">
					<div className="space-y-2 md:space-y-6 max-w-[90%] mx-auto">
						<h2 className="text-5xl font-extrabold tracking-normal sm:text-5xl md:text-5xl lg:text-7xl xl:text-8xl text-[#1C1F2A]">
							Trusted by <span className="md:hidden">10k+</span><span className="hidden md:inline">10,000+</span> students
						</h2>
						<p className="md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-[#1C1F2A]/80">
							Join thousands of successful drivers who started their journey with DMV.gg
						</p>
					</div>
				</div>

				<div className="max-w-6xl mx-auto relative">
					<div
						className="relative px-4 md:px-8 py-3 md:py-4"
						onMouseEnter={() => setIsPaused(true)}
						onMouseLeave={() => setIsPaused(false)}
					>
						<div className="hidden lg:flex absolute -left-20 top-1/2 -translate-y-1/2">
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
						<div className="hidden lg:flex absolute -right-20 top-1/2 -translate-y-1/2">
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

						<div className="flex flex-col items-center max-w-6xl mx-auto">
							<div className="text-center space-y-6 w-full md:max-w-[80%] lg:max-w-[85%] mx-auto">
								<div className="p-8 w-full flex flex-col items-center">
									<div className="w-[280px] md:w-[400px] lg:w-[480px] aspect-square relative rounded-full overflow-hidden mb-8">
										<Image
											src={currentTestimonial.image}
											alt={currentTestimonial.name}
											fill
											className="object-cover object-top"
											priority
										/>
									</div>

									<p className="text-xl md:text-2xl lg:text-4xl font-light leading-relaxed text-[#1C1F2A]">
										&ldquo;{currentTestimonial.quote}&rdquo;
									</p>

									<div className="space-y-2 mt-6">
										<h3 className="text-xl md:text-2xl font-bold text-[#1C1F2A]">
											{currentTestimonial.name}
										</h3>
										<p className="text-[#1C1F2A]/70">{currentTestimonial.role}</p>
									</div>
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
			</div>
		</section>
	);
}
