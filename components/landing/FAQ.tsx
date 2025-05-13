"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqItems = [
	{
		question: "Is DMV.gg really free?",
		answer:
			"Yes! You get one full DMV-style practice test for free — no credit card needed. Want unlimited tests and Weak Areas mode? Just upgrade anytime.",
	},
	{
		question: "Are the questions the same as the real DMV test?",
		answer:
			"Almost. We base everything on the official California DMV handbook, and many users say they saw the same questions on their real test.",
	},
	{
		question: "What do I get if I upgrade?",
		answer:
			"You’ll unlock unlimited practice tests, access to Weak Areas mode, and detailed progress tracking to help you pass faster.",
	},
	{
		question: "Can I use DMV.gg on my phone?",
		answer:
			"Yep — it works perfectly on iPhone, Android, tablets, and desktop. No downloads needed.",
	},
	{
		question: "How long does the free test take?",
		answer:
			"About 5–10 minutes. It’s 36 real-style questions and you get your score instantly. You can take it right after signing up.",
	},
	{
		question: "What if I don’t pass my test?",
		answer:
			"Don’t stress. Most users who take 3+ practice tests with DMV.gg pass on their first try. Keep practicing — we’ve got your back.",
	},
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="mb-4">
			<div className="w-full bg-[#3D0A0C] rounded-[40px]">
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="w-full flex items-center justify-between p-6 md:p-8 text-left"
				>
					<span className="text-lg md:text-xl lg:text-2xl font-bold text-[#FFB5C2] pr-4 flex-1">
						{question}
					</span>
					<ChevronDown
						className={cn(
							"h-6 w-6 text-[#FFB5C2] transition-transform duration-200 flex-shrink-0",
							isOpen && "rotate-180",
						)}
					/>
				</button>
				<div
					className={cn(
						"overflow-hidden transition-all duration-200 ease-in-out w-full",
						isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
					)}
				>
					<div className="px-6 md:px-8 pb-6 md:pb-8 text-[#FFB5C2] text-lg md:text-xl lg:text-2xl leading-[1.6] font-light">
						{answer}
					</div>
				</div>
			</div>
		</div>
	);
}

export default function FAQ() {
	return (
		<section id="faq" className="w-full py-12 md:py-12 lg:py-52 bg-[#540B0E]">
			<div className="container mx-auto px-6">
				<div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
					<h2 className="text-5xl font-extrabold tracking-tighter text-[#FFB5C2] sm:text-5xl md:text-5xl lg:text-7xl xl:text-8xl">
						Got questions?
					</h2>
				</div>
				<div className="w-full md:max-w-[75%] mx-auto">
					<div className="space-y-4">
						{faqItems.map((item) => (
							<FAQItem
								key={item.question}
								question={item.question}
								answer={item.answer}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
