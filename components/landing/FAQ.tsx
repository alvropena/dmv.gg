"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqItems = [
	{
		question: "Is DMV.gg free to use?",
		answer:
			"Yes, DMV.gg offers one free practice test. After that, you can upgrade to a premium plan for full access to all questions and features.",
	},
	{
		question: "Are these the actual questions from the California DMV test?",
		answer:
			"Yes, all our questions are based on the official California DMV handbook and are similar to those you'll encounter on the actual test. Many users report seeing identical questions.",
	},
	{
		question: "How often is the content updated?",
		answer:
			"We regularly update our question bank to reflect the latest DMV test content and rule changes for each state.",
	},
	{
		question: "Can I use DMV.gg on my phone?",
		answer:
			"Yes, DMV.gg is fully responsive and works on all devices including smartphones, tablets, and computers.",
	},
	{
		question: "How many practice tests can I take?",
		answer:
			"With our premium plan, you can take unlimited practice tests until you feel confident and ready for the real exam.",
	},
	{
		question: "Do you offer a pass guarantee?",
		answer:
			"While we can't guarantee everyone will pass, our statistics show that users who complete at least 5 practice tests have a 95% pass rate on their first attempt.",
	},
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="mb-4">
			<div className="w-full bg-[#3D0A0C] rounded-[40px]">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="w-full flex items-center justify-between p-6 md:p-8 text-left"
				>
					<span className="text-lg md:text-xl lg:text-2xl font-light text-[#FFB5C2] pr-4 flex-1 font-bold">
						{question}
					</span>
					<ChevronDown
						className={cn(
							"h-6 w-6 text-[#FFB5C2] transition-transform duration-200 flex-shrink-0",
							isOpen && "rotate-180"
						)}
					/>
				</button>
				<div
					className={cn(
						"overflow-hidden transition-all duration-200 ease-in-out w-full",
						isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
					)}
				>
					<div className="px-6 pb-6 text-[#FFB5C2] text-lg md:text-xl lg:text-2xl leading-[1.6] font-light">
						{answer}
					</div>
				</div>
			</div>
		</div>
	);
}

export default function FAQ() {
	return (
		<section id="faq" className="w-full py-16 md:py-20 lg:py-24 bg-[#540B0E]">
			<div className="container mx-auto px-6">
				<div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
					<h2 className="text-5xl font-extrabold tracking-tighter text-[#FFB5C2] sm:text-5xl md:text-5xl lg:text-7xl xl:text-8xl">
						Got questions?
					</h2>
				</div>
				<div className="w-full md:max-w-[75%] mx-auto">
					<div className="space-y-4">
						{faqItems.map((item, index) => (
							<FAQItem key={index} question={item.question} answer={item.answer} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
